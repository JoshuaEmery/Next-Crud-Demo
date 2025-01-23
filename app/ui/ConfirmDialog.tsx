/**
 * This is a reusable confirmation dialog component.
 * It's used when we need the user to confirm an important action
 * (like removing a book from the library).
 */

// Tell Next.js this is a Client Component because it has interactivity
"use client";

// Define the props (parameters) our dialog needs
interface ConfirmDialogProps {
  isOpen: boolean; // Whether the dialog should be shown
  onConfirm: () => void; // Function to call when user confirms
  onCancel: () => void; // Function to call when user cancels
  title: string; // The dialog title
  message: string; // The message to show in the dialog
}

// The main ConfirmDialog component
export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
}: ConfirmDialogProps) {
  // If dialog isn't open, don't render anything
  if (!isOpen) return null;

  return (
    // Semi-transparent overlay that covers the whole screen
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      {/* The dialog box itself */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Dialog title */}
        <h2 className="text-xl text-black font-semibold mb-4">{title}</h2>
        {/* Dialog message */}
        <p className="text-gray-600 mb-6">{message}</p>
        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          {/* Cancel button */}
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded text-black hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          {/* Confirm button - styled as destructive action */}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
