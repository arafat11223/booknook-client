
"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Library,
  LoaderCircle,
  UserRound,
} from "lucide-react";

import AuthGuard from "@/components/auth/auth-guard";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Book } from "@/types/book";

type BookResponse = {
  success: boolean;
  message: string;
  data: Book;
};

type BorrowResponse = {
  success: boolean;
  message: string;
  data: {
    _id: string;
    bookId: string;
    status: "borrowed" | "returned";
  };
};

type BorrowListResponse = {
  success: boolean;
  message: string;
  data: {
    _id: string;
    bookId: string;
    status: "borrowed" | "returned";
  }[];
};

type BookDetailsContentProps = {
  params: Promise<{ id: string }>;
};

function BookDetailsContent({
  params,
}: BookDetailsContentProps) {
  const { id } = use(params);
  const { data: session } = authClient.useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isAlreadyBorrowed, setIsAlreadyBorrowed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await apiRequest<BookResponse>(
          `/books/${id}`
        );

        setBook(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load book details."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  useEffect(() => {
    const checkBorrowStatus = async () => {
      if (!session?.user?.id || !id) return;

      try {
        const response = await apiRequest<BorrowListResponse>(
          "/borrows",
          {
            authenticated: true,
          }
        );

        setIsAlreadyBorrowed(
          response.data.some(
            (borrow) =>
              borrow.bookId === id &&
              borrow.status === "borrowed"
          )
        );
      } catch {
        setIsAlreadyBorrowed(false);
      }
    };

    checkBorrowStatus();
  }, [id, session?.user?.id]);

  const handleBorrow = async () => {
    if (!book || isBorrowing) return;

    try {
      setIsBorrowing(true);
      setError("");
      setSuccess("");

      const response = await apiRequest<BorrowResponse>(
        "/borrows",
        {
          method: "POST",
          authenticated: true,
          body: JSON.stringify({
            bookId: book._id,
          }),
        }
      );

      setBook((previousBook) =>
        previousBook
          ? {
              ...previousBook,
              availableCopies: previousBook.availableCopies - 1,
            }
          : previousBook
      );

      setIsAlreadyBorrowed(true);
      setSuccess(response.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to borrow this book."
      );
    } finally {
      setIsBorrowing(false);
    }
  };

  const isOutOfStock = book?.availableCopies === 0;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/books"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-green-700"
          >
            <ArrowLeft size={18} />
            Back to All Books
          </Link>

          {isLoading && (
            <div className="flex min-h-80 flex-col items-center justify-center">
              <LoaderCircle
                size={36}
                className="animate-spin text-green-700"
              />

              <p className="mt-4 text-sm text-slate-500">
                Loading book details...
              </p>
            </div>
          )}

          {!isLoading && error && !book && (
            <div className="rounded-xl border border-red-100 bg-white p-8 text-center">
              <BookOpen
                size={40}
                className="mx-auto text-red-500"
              />

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Unable to Load Book
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {error}
              </p>

              <Link
                href="/books"
                className="mt-6 inline-flex rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
              >
                Browse Books
              </Link>
            </div>
          )}

          {!isLoading && book && (
            <div className="grid gap-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
              <div className="overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full max-h-130 min-h-80 w-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <span className="w-fit rounded-full bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700">
                  {book.category}
                </span>

                <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                  {book.title}
                </h1>

                <p className="mt-3 flex items-center gap-2 text-slate-500">
                  <UserRound size={18} />
                  By {book.author}
                </p>

                <div className="mt-8 border-y border-slate-100 py-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    About This Book
                  </h2>

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {book.description}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Library size={17} />
                      Total Copies
                    </div>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {book.totalCopies}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <BookOpen size={17} />
                      Available
                    </div>

                    <p
                      className={`mt-2 text-2xl font-bold ${
                        book.availableCopies > 0
                          ? "text-green-700"
                          : "text-red-600"
                      }`}
                    >
                      {book.availableCopies}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <UserRound size={17} />
                    <span>
                      Added by: {book.addedBy.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CalendarDays size={17} />
                    <span>
                      Added on:{" "}
                      {new Date(book.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                {success && (
                  <div
                    role="status"
                    className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                  >
                    {success}
                  </div>
                )}

                {error && book && (
                  <div
                    role="alert"
                    className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleBorrow}
                  disabled={
                    isBorrowing ||
                    isOutOfStock ||
                    isAlreadyBorrowed
                  }
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-4 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isBorrowing ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Borrowing...
                    </>
                  ) : isAlreadyBorrowed ? (
                    "Already Borrowed"
                  ) : isOutOfStock ? (
                    "Out of Stock"
                  ) : (
                    "Borrow Book"
                  )}
                </button>

                <p className="mt-2 text-center text-xs text-slate-400">
                  {isAlreadyBorrowed
                    ? "You have already borrowed this book."
                    : isOutOfStock
                      ? "No copies are currently available."
                      : "You can borrow this book for 14 days."}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}

export default function BookDetailsPage({
  params,
}: BookDetailsContentProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-80 items-center justify-center">
          <LoaderCircle
            size={36}
            className="animate-spin text-green-700"
          />
        </div>
      }
    >
      <BookDetailsContent params={params} />
    </Suspense>
  );
}
