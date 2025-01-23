// Enum for book condition - provides a fixed set of possible values
// This ensures consistency in condition values across the application
export enum BookCondition {
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
  DESTROYED = "DESTROYED",
}

// Interface defining the shape of a Book object
// This is used for type checking throughout the application
export interface Book {
  id: string; // Unique identifier for the book
  title: string; // Book title
  author: string; // Book author
  isbn: string; // International Standard Book Number
  publishedYear: number; // Year the book was published
  genre: string; // Book genre/category
  description: string; // Book description/summary
  condition: BookCondition; // Current condition using the enum above
  isCheckedOut: boolean; // Whether the book is currently checked out
  isActive: boolean; // Soft delete flag - false means book is "deleted"
  lastCheckedOutDate?: Date; // Optional - date of last checkout (undefined if never checked out)
  addedDate: Date; // When the book was added to the library
}
