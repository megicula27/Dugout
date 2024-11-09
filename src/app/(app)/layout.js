// src/app/layout.js
import Navbar from "@/components/Navbar/Navbar";

// src/app/layout.js
export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="layout-container">{children}</div>
    </>
  );
}
