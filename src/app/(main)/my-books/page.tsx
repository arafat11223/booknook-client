
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Edit,
  LoaderCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import AuthGuard from "@/components/auth/auth-guard";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Book, BooksResponse } from "@/types/book";

function MyBooksContent() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await apiRequest<BooksResponse>("/books");

      const userId = session?.user?.id;

      setBooks(
        response.data.filter(
          (book) => book.addedBy.userId === userId
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load your books."
      );
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchMyBooks();
    }
  }, [session?.user?.id, fetchMyBooks]);

  const handleDelete = async () => {
    if (!selectedBook) return;

    try {
      setIsDeleting(true);

      await apiRequest(`/books/${selectedBook._id}`, {
        method: "DELETE",
        authenticated: true,
      });

      setBooks((previousBooks) =>
        previousBooks.filter(
          (book) => book._id !== selectedBook._id
        )
      );

      toast.success("Book deleted successfully.");
      setSelectedBook(null);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to delete book."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              Your Collection
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              My Books
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage the books you have added to BookNook.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800"
          >
            <Plus size={18} />
            Add New Book
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Total Books Added
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {books.length}
          </p>
        </div>

        {isLoading && (
          <div className="flex min-h-80 flex-col items-center justify-center">
            <LoaderCircle
              size={36}
              className="animate-spin text-green-700"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading your books...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="mt-8 rounded-xl border border-red-100 bg-white p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={fetchMyBooks}
              className="mt-4 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && books.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <BookOpen
              size={44}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No Books Added Yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Start building your collection by adding your first book.
            </p>

            <Link
              href="/add-book"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
            >
              <Plus size={18} />
              Add Your First Book
            </Link>
          </div>
        )}

        {!isLoading && !error && books.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book._id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-56 overflow-hidden bg-slate-100">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {book.category}
                  </span>

                  <h2 className="mt-3 line-clamp-1 text-lg font-bold text-slate-900">
                    {book.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    By {book.author}
                  </p>

                  <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-sm">
                    <span className="text-slate-500">
                      Total: {book.totalCopies}
                    </span>

                    <span className="font-semibold text-green-700">
                      Available: {book.availableCopies}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/my-books/edit/${book._id}`)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedBook(book)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>

            <h2
              id="delete-dialog-title"
              className="mt-5 text-xl font-bold text-slate-900"
            >
              Delete This Book?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {selectedBook.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setSelectedBook(null)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                Delete Book
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function MyBooksPage() {
  return (
    <AuthGuard>
      <MyBooksContent />
    </AuthGuard>
  );
}
