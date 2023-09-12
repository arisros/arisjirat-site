import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Aris Jirat Kurniawan",
  description: "Mohon maaf situs ini dalam pengerjaan",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 relative">
      <Image
        src="/funny-404-error-page-design.gif"
        priority
        alt="wait..."
        fill
        style={{ objectFit: "cover" }}
      />
      <header className="absolute bottom-0 left-0 align-middle text-center w-full p-10 text-green-700">
        <h2 className="text-2xl font-semibold">
          Mohon maaf, situs ini dalam pengerjaan
        </h2>
      </header>
    </main>
  );
}
