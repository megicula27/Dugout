import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import AuthProvider from "@/provider/AuthProvider";
import ChangeStatusOnUnload from "@/provider/ChangeStatusOnUnload";
import ChangeStatusOnLoad from "@/provider/ChangeStatusOnLoad";
import BackgroundWrapper from "@/provider/BackgroundWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dugout",
  description: "Tournament app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <BackgroundWrapper inter={inter}>
        <AuthProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <ChangeStatusOnLoad />
          <ChangeStatusOnUnload />
          {children}
        </AuthProvider>
      </BackgroundWrapper>
    </html>
  );
}
