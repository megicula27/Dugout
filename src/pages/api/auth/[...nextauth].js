import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/users/User"; // Ensure this is your Mongoose user model
import dbConnect from "@/lib/database/mongo";
import { generateUserId } from "@/utils/idGenerator";

const options = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Credentials Provider for email/password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect(); // Ensure a database connection with Mongoose

        // Check if user exists
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) {
          throw new Error("Incorrect password");
        }

        // Return user object if authentication successful
        return {
          id: user._id,
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();
      if (account.provider === "google") {
        // Check if user exists in MongoDB
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // Create a new MongoDB user document with default fields

          const uid = generateUserId();

          await User.create({
            uid,
            email: user.email,
            username: user.name,
            activeStatus: true, // Set default or calculated values
            teams: [], // Default teams array
            games: [], // Default games array
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Persist additional user information in token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      console.log(user);

      return token;
    },
    async session({ session, token }) {
      // Persist token data into session
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
    // async signOut({ token }) {
    //   // This callback runs when the user signs out
    //   console.log("i was called");

    //   if (token) {
    //     await dbConnect();
    //     const userFromDB = await User.findOne({ email: token.email });

    //     if (userFromDB) {
    //       userFromDB.activeStatus = false;
    //       await userFromDB.save();
    //     }
    //   }
    // },
  },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Using JWT for session storage
    maxAge: 2 * 24 * 60 * 60,
  },
  events: {
    signOut: async ({ token }) => {
      await dbConnect(); // Ensure database connection is established

      // Retrieve the token manually

      // If we have a valid token, update the active status in the database
      console.log("sign out was called ");

      if (token) {
        const userFromDB = await User.findOne({ email: token.email }).select(
          "email activeStatus"
        );

        if (userFromDB) {
          userFromDB.activeStatus = false;
          await userFromDB.save();
        }
      }
    },
  },
};

export default NextAuth(options);
