/**
 * This is the page component for creating a new book.
 * It's located at app/books/create/page.tsx and shows a form where users
 * can enter details for a new book to add to the library.
 */

// Tell Next.js this is a Client Component (runs in the browser)
// This lets us use React hooks and handle form interactions
"use client";

// Import the tools we need
import { useState } from "react"; // React hook for managing form state
import { BookCondition } from "../../types/book"; // The allowed conditions a book can be in
import { addBook } from "../../lib/actions/bookActions"; // Function to save a new book
import { useRouter } from "next/navigation"; // For navigating after saving
import Link from "next/link"; // For the back button

// The main component for creating a new book
export default function CreateBookPage() {
  // Set up our hooks
  const router = useRouter(); // We'll use this to go back to the book list after saving

  // Create state for our form data
  // useState gives us a variable that React will watch for changes
  // When it changes, React will update the form automatically
  const [formData, setFormData] = useState({
    title: "", // The book's title
    author: "", // Who wrote the book
    isbn: "", // The book's ISBN number
    publishedYear: new Date().getFullYear(), // Default to current year
    genre: "", // What type of book it is
    description: "", // A description of the book
    condition: BookCondition.GOOD, // What condition it's in (default to GOOD)
  });

  // This function runs when the form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the form from doing a regular submit
    await addBook(formData); // Save the new book to our storage
    router.push("/books"); // Go back to the book list
  };

  // The form layout
  return (
    <div className="p-4">
      {/* Back button to return to the book list */}
      <Link href="/books" className="border p-2">
        ← Back to Books
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl">Add New Book</h1>
        {/* The form that collects book information */}
        <form onSubmit={handleSubmit} className="mt-4">
          {/* Title input field */}
          <div className="mb-4">
            <label>
              <div>Title:</div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border p-2 text-black"
                required
              />
            </label>
          </div>

          {/* Author input field */}
          <div className="mb-4">
            <label>
              <div>Author:</div>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full border p-2 text-black"
                required
              />
            </label>
          </div>

          {/* ISBN input field */}
          <div className="mb-4">
            <label>
              <div>ISBN:</div>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                className="w-full border p-2 text-black"
                required
              />
            </label>
          </div>

          {/* Published Year input field */}
          <div className="mb-4">
            <label>
              <div>Published Year:</div>
              <input
                type="number"
                value={formData.publishedYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publishedYear: parseInt(e.target.value),
                  })
                }
                className="w-full border p-2 text-black"
                required
              />
            </label>
          </div>

          {/* Genre input field */}
          <div className="mb-4">
            <label>
              <div>Genre:</div>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                className="w-full border p-2 text-black"
                required
              />
            </label>
          </div>

          {/* Description textarea field */}
          <div className="mb-4">
            <label>
              <div>Description:</div>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border p-2 text-black"
                required
                rows={3}
              />
            </label>
          </div>

          {/* Condition dropdown field */}
          <div className="mb-4">
            <label>
              <div>Condition:</div>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    condition: e.target.value as BookCondition,
                  })
                }
                className="w-full border p-2 text-black"
              >
                {/* Create an option for each possible book condition */}
                {Object.values(BookCondition).map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Submit button */}
          <button type="submit" className="border p-2">
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
}
