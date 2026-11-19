
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { Book, BooksResponse } from "@/types/book";

export default function LatestBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await apiRequest<BooksResponse>("/books");

        setBooks(response.data.slice(0, 6));
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load latest books."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestBooks();
  }, []);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-green-700">
              Explore Our Collection
            </span>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Latest Books
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Discover the newest additions to our library and find your
              next favourite read.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition-colors hover:text-green-900"
          >
            View All Books
            <ArrowRight size={18} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="size-10 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="font-medium text-red-700">{error}</p>
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <BookOpen className="mx-auto size-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No Books Available Yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Our latest book collections will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book._id}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    {book.category}
                  </span>

                  <h3 className="mt-3 text-lg font-semibold text-slate-900 transition-colors group-hover:text-green-700">
                    {book.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    by {book.author}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {book.availableCopies} copies available
                  </p>

                  <Link
                    href={`/books/${book._id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
