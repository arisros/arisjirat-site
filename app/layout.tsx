import type { Metadata } from "next";
import {
  Open_Sans,
  Abhaya_Libre,
  Advent_Pro,
  Bagel_Fat_One,
  Noto_Sans_Nandinagari,
} from "next/font/google";
import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";

const inter = Noto_Sans_Nandinagari({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Aris Jirat Kurniawan",
  description:
    "Halo, terimakasih telah mengunjungi website ini, saat ini masih ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const header = (
    <header>
      <div className="text-center bg-white p-8 my-6 rounded-md">
        <Link href="/">
          <Image
            src="/favicon.ico"
            width={40}
            height={40}
            className="mx-auto"
            alt={"logo"}
          />
          <h1 className="text-2xl font-bold mt-4 text-slate-700">
            Aris Kurniawan
          </h1>
        </Link>
        <p className="text-slate-400">
          Hai! 🖐️ Salam kenal dan selamat datang ✌️ 🚀
        </p>
      </div>
    </header>
  );

  const footer = (
    <footer>
      <div className="border-t border-slate-100 mt-12 py-6 text-center text-slate-400">
        <a href="">
          <h3>@aris</h3>
        </a>
      </div>
    </footer>
  );

  return (
    <html>
      <head />
      <body className={inter.className}>
        <div className="mx-auto  max-w-2xl px-6">
          {header}
          {children}
          {footer}
        </div>
      </body>
    </html>
  );
}
