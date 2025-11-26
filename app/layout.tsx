import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pointillist Hands",
  description: "3D Pointillist Hand Visualization",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="bg-black">{children}</body>
    </html>
  )
}

