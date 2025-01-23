/**
 * This is the page component for editing an existing book.
 * It's located at app/books/edit/[id]/page.tsx where [id] is the book's ID.
 * This page loads the current book data and lets users modify it.
 */

// Tell Next.js this is a Client Component (runs in the browser)
// This lets us use React hooks and handle form interactions
"use client";

// Import the tools we need
import { useState, useEffect, use } from "react"; // React hooks for managing state and effects
import { Book, BookCondition } from "../../../types/book"; // Types for our book data
import { updateBook, getBook } from "../../../lib/actions/bookActions"; // Functions to get and update books
import { useRouter } from "next/navigation"; // For navigating after saving
import Link from "next/link"; // For navigation links

// In Next.js 14, route parameters are Promises
// This type tells TypeScript what our parameters look like
type PageParams = Promise<{ id: string }>;

// The main component for editing a book
export default function EditBookPage({ params }: { params: PageParams }) {
  // Set up our hooks and state
  const router = useRouter(); // For navigation after saving
  const [book, setBook] = useState<Book | null>(null); // Stores the original book data
  const [loading, setLoading] = useState(true); // Tracks if we're still loading
  const { id } = use(params); // Get the book ID from the URL

  // State for our form fields
  // This is separate from the book state because we want to track changes
  // before saving them
  const [formData, setFormData] = useState({
    title: "", // The book's title
    author: "", // Who wrote the book
    isbn: "", // The book's ISBN number
    publishedYear: new Date().getFullYear(), // When it was published
    genre: "", // What type of book it is
    description: "", // A description of the book
    condition: BookCondition.GOOD, // What condition it's in
  });

  // Load the book data when the page loads
  // useEffect runs when the component mounts or when id changes
  useEffect(() => {
    const loadBook = async () => {
      const bookData = await getBook(id); // Get the book from storage
      setBook(bookData || null); // Save the original book data

      // If we found the book, update our form with its current values
      if (bookData) {
        setFormData({
          title: bookData.title,
          author: bookData.author,
          isbn: bookData.isbn,
          publishedYear: bookData.publishedYear,
          genre: bookData.genre,
          description: bookData.description,
          condition: bookData.condition,
        });
      }
      setLoading(false); // Mark loading as complete
    };
    loadBook();
  }, [id]); // Only run this again if the ID changes

  // Show a loading message while we fetch the book data
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  // Show an error message if we couldn't find the book
  if (!book) {
    return (
      <div className="p-4">
        <p>Book not found</p>
        <Link href="/books" className="border p-2">
          Back to Books
        </Link>
      </div>
    );
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    await updateBook(id, formData); // Save the changes to storage
    router.push(`/books/${id}`); // Go back to the book details page
  };

  // The form layout
  return (
    <div className="p-4">
      {/* Back button to return to book details */}
      <Link href={`/books/${id}`} className="border p-2">
        ← Back to Book Details
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl">Edit {book.title}</h1>
        {/* Form for editing book details */}
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
            Update Book
          </button>
        </form>
      </div>
    </div>
  );
}
