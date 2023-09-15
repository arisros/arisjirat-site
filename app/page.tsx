import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aris Jirat Kurniawan",
  description: "Hai salam kenal dan selamat datang",
};

export default function Home() {
  return (
    <div>
      <div className="my-12 text-center flex items-center justify-center">
        <Link
          href="/studies"
          className="bg-green-700 text-white rounded-lg w-3/4 p-1 m-0"
        >
          <p className="p-0 mt-1">Studies</p>
        </Link>
      </div>
    </div>
  );
}
