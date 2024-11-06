import Navbar from "@/components/Navbar/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children} {/* Keep this for main content */}
      </body>
    </html>
  );
}
