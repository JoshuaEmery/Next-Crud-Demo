/**
 * This is the main Books page component that displays all active books.
 * It uses the BookList component to show the books in a consistent way.
 * Located at app/books/page.tsx, this is the page users see at /books
 */

// This is a server component
import { getActiveBooks } from "../lib/actions/bookActions"; // Function to get non-deleted books
import BookList from "../ui/BookList"; // Our reusable book list component
import Link from "next/link"; // Next.js component for navigation

// This is a Server Component (no "use client" directive)
// It fetches data on the server before sending the page to the browser
export default async function BooksPage() {
  // Fetch the list of active books
  // This runs on the server at request time
  const books = await getActiveBooks();

  return (
    // Main container with padding
    <div className="p-4">
      {/* Header section with title and Add New Book button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Library Collection</h1>
        {/* Link to the create new book page */}
        <Link
          href="/books/create"
          className="border p-2 hover:bg-gray-100 transition-colors"
        >
          + Add New Book
        </Link>
      </div>

      {/* Display the list of books using our BookList component */}
      {/* We pass the books we fetched as a prop to BookList */}
      <BookList books={books} />
    </div>
  );
}
