/**
 * This is a reusable component that displays a list of books.
 * It's used on pages that need to show multiple books with interactive features
 * like checking out/in books and removing them.
 */

// Tell Next.js this is a Client Component because it has interactivity
"use client";

// Import the tools we need
import { Book } from "../types/book"; // Type definition for our book data
import {
  toggleCheckoutStatus,
  markBookInactive,
} from "../lib/actions/bookActions"; // Functions to handle book actions
import { useRouter } from "next/navigation"; // For refreshing the page after actions
import Link from "next/link"; // For navigation links
import { useState } from "react"; // For managing dialog state
import ConfirmDialog from "./ConfirmDialog"; // Our confirmation dialog component

// Define what props (parameters) this component accepts
// TypeScript helps us ensure we pass in the correct data
interface BookListProps {
  books: Book[]; // An array of books to display
}

// The main BookList component
// It takes 'books' as a prop and displays them in a list
// We do not need to await this because the params are NOT passed through routing
export default function BookList({ books }: BookListProps) {
  // Get the router so we can refresh the page after actions
  const router = useRouter();

  // State for managing the confirmation dialog
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookToRemove, setBookToRemove] = useState<Book | null>(null);

  // Handle checking out or returning a book
  const handleCheckout = async (bookId: string) => {
    await toggleCheckoutStatus(bookId); // Update the book's status
    router.refresh(); // Refresh the page to show the new status
  };

  // Show confirmation dialog before removing a book
  const handleRemoveClick = (book: Book) => {
    setBookToRemove(book); // Store the book to be removed
    setShowConfirm(true); // Show the confirmation dialog
  };

  // Handle actual book removal after confirmation
  const handleRemoveConfirm = async () => {
    if (bookToRemove) {
      await markBookInactive(bookToRemove.id); // Mark the book as removed
      setShowConfirm(false); // Hide the confirmation dialog
      setBookToRemove(null); // Clear the book to remove
      router.refresh(); // Refresh the page to update the list
    }
  };

  // The component's layout
  return (
    <div className="mt-4">
      <h2 className="text-xl mb-2">Book List</h2>
      <ul>
        {/* 
          Filter out inactive (removed) books and map through the rest
          .filter() removes books where isActive is false
          .map() creates a list item for each remaining book
        */}
        {books
          .filter((book) => book.isActive)
          .map((book) => (
            // Each list item needs a unique key (the book's ID) for React to track it
            <li key={book.id} className="mb-4 p-2 border rounded">
              {/* Book title */}
              <h3>{book.title}</h3>
              {/* Book author */}
              <p>Author: {book.author}</p>
              {/* Show if the book is checked out or available */}
              <p>Status: {book.isCheckedOut ? "Checked Out" : "Available"}</p>
              {/* Only show the last checkout date if there is one */}
              {book.lastCheckedOutDate && (
                <p>
                  Last Checked Out:{" "}
                  {new Date(book.lastCheckedOutDate).toLocaleDateString()}
                </p>
              )}
              {/* Buttons for actions (checkout/return, view details, and remove) */}
              <div className="mt-2 space-x-2">
                {/* Button to check out or return the book */}
                <button
                  className="px-2 py-1 border rounded hover:bg-gray-100 transition-colors"
                  onClick={() => handleCheckout(book.id)}
                >
                  {book.isCheckedOut ? "Check In" : "Check Out"}
                </button>
                {/* Link to view book details */}
                <Link
                  href={`/books/${book.id}`}
                  className="px-2 py-1 border rounded inline-block hover:bg-gray-100 transition-colors"
                >
                  View Details →
                </Link>
                {/* Button to remove the book from the list */}
                <button
                  className="px-2 py-1 border rounded hover:bg-gray-100 transition-colors text-red-600 hover:bg-red-50"
                  onClick={() => handleRemoveClick(book)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
      </ul>

      {/* Confirmation Dialog for removing books */}
      <ConfirmDialog
        isOpen={showConfirm}
        onConfirm={handleRemoveConfirm}
        onCancel={() => {
          setShowConfirm(false);
          setBookToRemove(null);
        }}
        title="Remove Book"
        message={
          bookToRemove
            ? `Are you sure you want to remove "${bookToRemove.title}" from the library? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
