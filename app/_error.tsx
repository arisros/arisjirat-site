import Image from "next/image";

// export default function NotFound() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24 relative">
//       <Image
//         src="/funny-404-error-page-design.gif"
//         priority
//         alt="wait..."
//         fill
//         style={{ objectFit: "cover" }}
//       />
//       <header className="absolute bottom-0 left-0 align-middle text-center w-full p-10 text-green-700">
//         <h2 className="text-2xl font-semibold">
//           Mohon maaf, halaman tidak ditemukan
//         </h2>
//       </header>
//     </main>
//   );
// }

function Error({}) {
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
          Mohon maaf, halaman tidak ditemukan
        </h2>
      </header>
    </main>
  );
}

Error.getInitialProps = () => {
  // const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode: "" };
};

export default Error;
