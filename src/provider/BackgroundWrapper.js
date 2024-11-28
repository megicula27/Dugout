"use client";

import { usePathname } from "next/navigation";

export default function BackgroundWrapper({ children, inter }) {
  const pathname = usePathname();

  const whiteBackgroundRoutes = [
    "/games",
    "/login",
    "/register",
    "/teams",
    "/tournament",
    "/auth",
    "/findplayer",
  ];

  const isWhiteBackground = whiteBackgroundRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <body
      className={`
        ${inter.className} 
        ${isWhiteBackground ? "bg-white text-black" : "bg-black text-white"}
        min-h-screen
      `}
    >
      {children}
    </body>
  );
}
