import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Personal Portfolio & Interactive CV",
  description: "Modern, interactive personal portfolio website showcasing fullstack projects, skills, education, and career experience.",
  keywords: ["portfolio", "CV", "developer", "fullstack", "React", "Next.js", "design system"],
  openGraph: {
    title: "Personal Portfolio & Interactive CV",
    description: "Interactive CV and portfolio template built with Next.js & Firebase.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-amber-400 selection:text-black">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
