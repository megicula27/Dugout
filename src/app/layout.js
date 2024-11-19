// src/app/layout.js
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import AuthProvider from "@/provider/AuthProvider";
import ChangeStatusOnUnload from "@/provider/ChangeStatusOnUnload";
import ChangeStatusOnLoad from "@/provider/ChangeStatusOnLoad";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dugout",
  description: "Tournament app",
};

// src/app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <ChangeStatusOnLoad />
          <ChangeStatusOnUnload />

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
