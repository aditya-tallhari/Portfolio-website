"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-black text-green-500 font-mono p-10">
        <h2>FATAL SYSTEM EXCEPTION</h2>
        <p>{error.message}</p>
        <button onClick={() => reset()} className="mt-4 border border-green-500 p-2 text-sm uppercase">
          Attempt Recovery
        </button>
      </body>
    </html>
  );
}
