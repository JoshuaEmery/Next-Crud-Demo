/**
 * This is a Next.js page component that displays details for a single book.
 * It's located at app/books/[id]/page.tsx, where [id] means it's a dynamic route.
 * The actual URL might be something like /books/1 or /books/2
 */

// Tell Next.js this is a Client Component (runs in the browser)
// This lets us use React hooks and handle user interactions
"use client";

import { useState, useEffect, use } from "react"; // React hooks for managing state and effects
import { Book } from "../../types/book"; // Our Book type definition
import {
  getBook, // Gets a single book from storage
  toggleCheckoutStatus, // Changes a book's checkout status
  markBookInactive, // Marks a book as removed
} from "../../lib/actions/bookActions";
import { useRouter } from "next/navigation"; // Helps us navigate between pages
import Link from "next/link"; // Next.js link component for navigation
import ConfirmDialog from "../../ui/ConfirmDialog"; // Our custom confirmation dialog

// In Next.js 15, route parameters (like the book ID) are Promises
// This type tells TypeScript what our parameters look like
type PageParams = Promise<{ id: string }>;

// The main component that shows a single book's details
//We are destructuring the params which resolves to a promise containing pageParams
export default function BookPage({ params }: { params: PageParams }) {
  //use() is a new way to get the book ID from the URL
  //https://medium.com/@ayonaalex2/params-search-params-resolved-as-promise-in-next-js-15-444317307481
  const { id } = use(params); // Get the book ID from the URL
  // Set up our hooks and state variables
  const router = useRouter(); // For changing pages
  const [showConfirm, setShowConfirm] = useState<boolean>(false); // Should we show the delete dialog?
  //book is the book's data, we use | null because null is a type, we have to tell typescript that it can be null
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Are we still loading?

  // Load the book's data when the page loads
  // useEffect runs code when certain things change (like the book ID)
  useEffect(() => {
    const loadBook = async () => {
      const bookData = await getBook(id); // Get the book from storage
      setBook(bookData || null); // Save it in our state
      setLoading(false); // We're done loading
    };
    loadBook();
  }, [id]); // Only run this again if the ID changes

  // If we're still loading, show a loading message
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  // If we couldn't find the book, show an error message
  if (!book) {
    return (
      <div className="p-4">
        <p>Book not found</p>
        <Link
          href="/books"
          className="px-4 py-2 border rounded inline-block hover:bg-gray-100 transition-colors"
        >
          Back to Books
        </Link>
      </div>
    );
  }

  // Function that runs when we want to remove a book
  const handleRemove = async () => {
    await markBookInactive(id); // Mark it as removed in storage
    router.push("/books"); // Go back to the book list
  };

  // Function that runs when we want to check out or return a book
  const handleCheckout = async () => {
    await toggleCheckoutStatus(id); // Change the checkout status
    const updatedBook = await getBook(id); // Get the updated data
    setBook(updatedBook || null); // Update our local state
  };

  // The actual page layout
  return (
    <div className="p-4">
      {/* Back button */}
      <Link
        href="/books"
        className="px-4 py-2 border rounded inline-block hover:bg-gray-100 transition-colors"
      >
        Back to Books
      </Link>

      <div className="mt-4">
        {/* Book title */}
        <h1 className="text-2xl">{book.title}</h1>

        <div className="mt-4">
          {/* All the book's details */}
          <p>
            <strong>Author:</strong> {book.author}
          </p>
          <p>
            <strong>ISBN:</strong> {book.isbn}
          </p>
          <p>
            <strong>Published:</strong> {book.publishedYear}
          </p>
          <p>
            <strong>Genre:</strong> {book.genre}
          </p>
          <p>
            <strong>Description:</strong> {book.description}
          </p>
          <p>
            <strong>Current Condition:</strong> {book.condition}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {book.isCheckedOut ? "Checked Out" : "Available"}
          </p>

          {/* Book's history information */}
          <div className="mt-4">
            <h2>History</h2>
            <p>
              <strong>Added to Library:</strong>{" "}
              {book.addedDate.toLocaleDateString()}
            </p>
            {/* Only show the last checkout date if there is one */}
            {book.lastCheckedOutDate && (
              <p>
                <strong>Last Checked Out:</strong>{" "}
                {book.lastCheckedOutDate.toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Buttons for actions we can take on this book */}
          <div className="mt-4 space-x-2">
            {/* Check out/in button - text changes based on current status */}
            <button
              onClick={handleCheckout}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
            >
              {book.isCheckedOut ? "Check In" : "Check Out"}
            </button>
            {/* Button to edit the book's information */}
            <Link
              href={`/books/edit/${book.id}`}
              className="px-4 py-2 border rounded inline-block hover:bg-gray-100 transition-colors"
            >
              Edit Book
            </Link>
            {/* Button to remove the book (shows a confirmation first) */}
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 border rounded text-red-600 hover:bg-red-50 transition-colors"
            >
              Remove Book
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog
          This pops up when we try to remove a book
          It asks "are you sure?" before actually removing it */}
      <ConfirmDialog
        isOpen={showConfirm} // Should we show the dialog?
        onConfirm={handleRemove} // What to do if they click "yes"
        onCancel={() => setShowConfirm(false)} // What to do if they click "no"
        title="Remove Book"
        message={`Are you sure you want to remove "${book.title}" from the library? This action cannot be undone.`}
      />
    </div>
  );
}
