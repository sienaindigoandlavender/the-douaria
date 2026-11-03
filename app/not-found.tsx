import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-start justify-center bg-plaster px-4 pt-24 md:px-10">
      <h1 className="font-display text-[48px]">This door doesn't open.</h1>
      <Link href="/" className="mt-6 underline underline-offset-4">Back to the house</Link>
    </div>
  );
}
