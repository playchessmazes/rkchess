import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "RK Chess Academy - Premier Chess Coaching in Anantapur",
  description: "Official website of RK Chess Academy, Anantapuramu. Professional chess coaching for beginners to advanced players, grandmaster strategies, and expert training.",
  keywords: [
    "RK Chess Academy",
    "RK Chess",
    "Chess Academy Anantapur",
    "Chess Coaching Anantapur",
    "Best Chess Academy Anantapur",
    "Learn Chess Anantapur",
    "Chess Classes Andhra Pradesh",
    "FIDE Chess Training"
  ],
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
  openGraph: {
    title: "RK Chess Academy - Premier Chess Coaching in Anantapur",
    description: "Empowering young chess minds with professional training, strategic mastery, and expert coaching in Anantapuramu.",
    url: "https://rkchessacademy.com",
    siteName: "RK Chess Academy",
    images: [
      {
        url: "/logo.jpeg",
        width: 800,
        height: 800,
        alt: "RK Chess Academy Logo",
      },
    ],
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
