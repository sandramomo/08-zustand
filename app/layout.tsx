import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Footer from "@/components/Footer/Footer";
import { Roboto } from 'next/font/google'; 
const roboto = Roboto({
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-roboto', 
  display: 'swap', 
});

export const metadata: Metadata = {
  title: "Note App",
  description: "Created by Oleksandra",
  openGraph: {
    title: 'Note App',
    description: 'NoteHub is a simple and efficient application designed for managing personal notes.',
    url: 'https://08-zustand-vert-three.vercel.app/',
    images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Note App',
        },
      ],
  }
};

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
      <TanStackProvider>
       <Header/>
        <main> {children} {modal}</main>
        <Footer/>
          </TanStackProvider>
      </body>
    </html>
  );
}
