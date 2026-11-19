
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";

import AuthGuard from "@/components/auth/auth-guard";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type {
  Borrow,
  BorrowsResponse,
  BorrowResponse,
} from "@/types/borrow";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function MyBorrowsContent() {
  const { data: session, isPending } = authClient.useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBorrows = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await apiRequest<BorrowsResponse>(
        "/borrows",
        {
          authenticated: true,
        }
      );

      setBorrows(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load borrowed books."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending && session?.user?.id) {
      fetchBorrows();
    }
  }, [isPending, session?.user?.id, fetchBorrows]);

  const handleReturn = async (borrowId: string) => {
    try {
      setReturningId(borrowId);
      setError("");
      setSuccess("");

      const response = await apiRequest<BorrowResponse>(
        `/borrows/${borrowId}`,
        {
          method: "DELETE",
          authenticated: true,
        }
      );

      setBorrows((previousBorrows) =>
        previousBorrows.map((borrow) =>
          borrow._id === borrowId
            ? response.data
            : borrow
        )
      );

      setSuccess("Book returned successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to return the book."
      );
    } finally {
      setReturningId(null);
    }
  };

  const activeBorrows = borrows.filter(
    (borrow) => borrow.status === "borrowed"
  );

  const returnedBorrows = borrows.filter(
    (borrow) => borrow.status === "returned"
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Your Reading Activity
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            My Borrows
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track the books you have borrowed and manage your returns.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-3 text-green-700">
                <BookOpen size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Currently Borrowed
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {activeBorrows.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-700">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Returned Books
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {returnedBorrows.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {success && (
          <div
            role="status"
            className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}

            <button
              type="button"
              onClick={fetchBorrows}
              className="ml-3 font-semibold underline"
            >
              Try Again
            </button>
          </div>
        )}

        {isPending || isLoading ? (
          <div className="flex min-h-80 flex-col items-center justify-center">
            <LoaderCircle
              size={36}
              className="animate-spin text-green-700"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading your borrowed books...
            </p>
          </div>
        ) : borrows.length === 0 && !error ? (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <BookOpen
              size={44}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No Borrowed Books Yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Explore our library and borrow your first book.
            </p>

            <Link
              href="/books"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              <BookOpen size={18} />
              Browse Books
            </Link>
          </div>
        ) : !isLoading && borrows.length > 0 ? (
          <div className="mt-8 space-y-10">
            <section>
              <div className="mb-5 flex items-center gap-2">
                <Clock size={20} className="text-green-700" />

                <h2 className="text-xl font-bold text-slate-900">
                  Currently Borrowed
                </h2>
              </div>

              {activeBorrows.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-sm text-slate-500">
                    You have no active borrowed books.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {activeBorrows.map((borrow) => (
                    <article
                      key={borrow._id}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="h-56 overflow-hidden bg-slate-100">
                        <img
                          src={borrow.bookImage}
                          alt={borrow.bookTitle}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="p-5">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          Borrowed
                        </span>

                        <h3 className="mt-3 line-clamp-1 text-lg font-bold text-slate-900">
                          {borrow.bookTitle}
                        </h3>

                        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays size={16} />

                            <span>
                              Borrowed: {formatDate(borrow.borrowDate)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays size={16} />

                            <span>
                              Return by: {formatDate(borrow.returnDate)}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleReturn(borrow._id)}
                          disabled={returningId !== null}
                          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {returningId === borrow._id ? (
                            <>
                              <LoaderCircle
                                size={17}
                                className="animate-spin"
                              />
                              Returning...
                            </>
                          ) : (
                            <>
                              <RotateCcw size={17} />
                              Return Book
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {returnedBorrows.length > 0 && (
              <section>
                <div className="mb-5 flex items-center gap-2">
                  <CheckCircle2
                    size={20}
                    className="text-blue-700"
                  />

                  <h2 className="text-xl font-bold text-slate-900">
                    Returned Books
                  </h2>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="divide-y divide-slate-100">
                    {returnedBorrows.map((borrow) => (
                      <div
                        key={borrow._id}
                        className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                      >
                        <img
                          src={borrow.bookImage}
                          alt={borrow.bookTitle}
                          className="size-20 rounded-lg object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-900">
                            {borrow.bookTitle}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Borrowed: {formatDate(borrow.borrowDate)}
                          </p>

                          {borrow.returnedAt && (
                            <p className="mt-1 text-sm text-slate-500">
                              Returned: {formatDate(borrow.returnedAt)}
                            </p>
                          )}
                        </div>

                        <span className="inline-flex items-center gap-2 self-start rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 sm:self-center">
                          <CheckCircle2 size={14} />
                          Returned
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default function MyBorrowsPage() {
  return (
    <AuthGuard>
      <MyBorrowsContent />
    </AuthGuard>
  );
}
