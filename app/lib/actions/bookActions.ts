"use server";

import { Book, BookCondition } from "../../types/book";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

// The path to our JSON file where we store the books
const BOOKS_FILE_PATH = path.join(process.cwd(), "app/data/books.json");

// Read all books from our JSON file
// This is a helper function used by other functions to get the book data
async function readBooksFromFile(): Promise<Book[]> {
  try {
    // Read and parse the JSON file
    const jsonData = await fs.readFile(BOOKS_FILE_PATH, "utf-8");
    const { books } = JSON.parse(jsonData);

    // Convert date strings back to Date objects
    return books.map((book: any) => ({
      ...book,
      addedDate: new Date(book.addedDate),
      lastCheckedOutDate: book.lastCheckedOutDate
        ? new Date(book.lastCheckedOutDate)
        : undefined,
    }));
  } catch (error) {
    console.error("Couldn't read books:", error);
    return []; // Return empty array if something goes wrong
  }
}

// Save books to our JSON file
// This is a helper function used by other functions to save changes
async function writeBooksToFile(books: Book[]): Promise<void> {
  try {
    // Convert dates to strings before saving
    const booksToSave = books.map((book) => ({
      ...book,
      addedDate: book.addedDate.toISOString().split("T")[0], // Just get the date part
      lastCheckedOutDate: book.lastCheckedOutDate
        ? book.lastCheckedOutDate.toISOString().split("T")[0]
        : undefined,
    }));

    // Save the books to the JSON file
    await fs.writeFile(
      BOOKS_FILE_PATH,
      JSON.stringify({ books: booksToSave }, null, 2) // Pretty print with 2 spaces
    );
  } catch (error) {
    console.error("Couldn't save books:", error);
    throw new Error("Failed to save books");
  }
}

// Get all books (active and inactive)
export async function getBooks(): Promise<Book[]> {
  return await readBooksFromFile();
}

// Get a single book by its ID
export async function getBook(id: string): Promise<Book | undefined> {
  const books = await readBooksFromFile();
  return books.find((book) => book.id === id);
}

// Get only active (non-deleted) books
export async function getActiveBooks(): Promise<Book[]> {
  const books = await readBooksFromFile();
  return books.filter((book) => book.isActive);
}

// The data we need when adding or updating a book
interface AddBookData {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  description: string;
  condition: BookCondition;
}

// Add a new book
export async function addBook(data: AddBookData): Promise<void> {
  const books = await readBooksFromFile();
  const newBook: Book = {
    id: (books.length + 1).toString(),
    ...data,
    isCheckedOut: false,
    isActive: true,
    addedDate: new Date(),
  };

  books.push(newBook);
  await writeBooksToFile(books);
  //revalidatePath is a function that tells Next.js to refresh the cache for the given path
  //this is used when data changes on the server
  revalidatePath("/books");
}

// Update an existing book
export async function updateBook(
  bookId: string,
  data: AddBookData
): Promise<void> {
  const books = await readBooksFromFile();
  //find the book by id
  const bookIndex = books.findIndex((b) => b.id === bookId);
  //checkt to see it exists
  if (bookIndex !== -1) {
    const book = books[bookIndex];
    books[bookIndex] = {
      ...book,
      ...data,
      id: book.id,
      isCheckedOut: book.isCheckedOut,
      isActive: book.isActive,
      addedDate: book.addedDate,
      lastCheckedOutDate: book.lastCheckedOutDate,
    };
    await writeBooksToFile(books);
    revalidatePath(`/books/${bookId}`);
    revalidatePath("/books");
  }
}

// Toggle checkout status
export async function toggleCheckoutStatus(bookId: string): Promise<void> {
  const books = await readBooksFromFile();
  const book = books.find((b) => b.id === bookId);

  if (book) {
    book.isCheckedOut = !book.isCheckedOut;
    book.lastCheckedOutDate = book.isCheckedOut ? new Date() : undefined;
    await writeBooksToFile(books);
    revalidatePath(`/books/${bookId}`);
    revalidatePath("/books");
  }
}

// Mark a book as inactive (soft delete)
export async function markBookInactive(bookId: string): Promise<void> {
  const books = await readBooksFromFile();
  const book = books.find((b) => b.id === bookId);

  if (book) {
    book.isActive = false;
    await writeBooksToFile(books);
    revalidatePath("/books");
  }
}

// Update book condition
export async function updateBookCondition(
  bookId: string,
  condition: BookCondition
): Promise<void> {
  const books = await readBooksFromFile();
  const book = books.find((b) => b.id === bookId);

  if (book) {
    book.condition = condition;
    await writeBooksToFile(books);
    revalidatePath(`/books/${bookId}`);
    revalidatePath("/books");
  }
}
