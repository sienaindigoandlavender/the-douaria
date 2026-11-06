import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-start justify-center bg-limewash px-5 pt-24 md:px-10 lg:px-14">
      <h1 className="house font-light text-[clamp(2.6rem,6vw,5rem)] leading-none tracking-[-0.03em]">This door doesn't open.</h1>
      <Link href="/" className="link-house mt-8 text-lg">Back to the house</Link>
    </div>
  );
}
