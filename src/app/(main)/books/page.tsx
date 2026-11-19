
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Library, Plus, RefreshCw } from "lucide-react";

import BookCard from "@/components/books/book-card";
import { apiRequest } from "@/lib/api";
import type { Book, BooksResponse } from "@/types/book";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await apiRequest<BooksResponse>("/books");

      setBooks(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load books."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-green-700">
                Explore Our Collection
              </p>

              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                All Books
              </h1>

              <p className="mt-3 max-w-2xl text-slate-600">
                Discover your next favourite book from our growing
                library collection.
              </p>
            </div>

            <Link
              href="/add-book"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800"
            >
              <Plus size={18} />
              Add a Book
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Library Collection
            </h2>

            {!isLoading && !error && (
              <p className="mt-1 text-sm text-slate-500">
                {books.length} {books.length === 1 ? "book" : "books"} found
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={fetchBooks}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={isLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {isLoading && (
          <div className="flex min-h-72 flex-col items-center justify-center">
            <div className="size-10 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />

            <p className="mt-4 text-sm text-slate-500">
              Loading books...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-red-100 bg-white px-5 text-center">
            <BookOpen size={40} className="text-red-500" />

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Unable to Load Books
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchBooks}
              className="mt-5 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && books.length === 0 && (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-50">
              <Library size={30} className="text-green-700" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No Books Available Yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Our library collection is currently empty. Be the first
              to contribute a book to BookNook.
            </p>

            <Link
              href="/add-book"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800"
            >
              <Plus size={18} />
              Add First Book
            </Link>
          </div>
        )}

        {!isLoading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
