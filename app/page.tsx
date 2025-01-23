// This is the main page component in Next.js (routes to '/')
// In the App Router, page.tsx files automatically become routes
import Link from "next/link";
import Child from "./ui/Child";
// The default export defines the main component for this route
// This is a Server Component by default in Next.js 13+
export default function Home() {
  return (
    // Using Tailwind CSS classes for styling (p-4 adds padding)
    <div className="p-4">
      <h1 className="text-2xl">Welcome to Our Library</h1>
      <p className="mt-4">
        Discover our collection of classic literature and contemporary works.
      </p>
      {/* Next.js Link component for client-side navigation
          This is more efficient than regular <a> tags */}
      <Link href="/books" className="mt-4 inline-block border p-2">
        Browse Books
      </Link>
      <Child testProps="Hello World" />
    </div>
  );
}
