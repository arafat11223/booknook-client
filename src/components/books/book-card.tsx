
import Link from "next/link";
import { BookOpen, UserRound } from "lucide-react";

import type { Book } from "@/types/book";

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/books/${book._id}`}
        className="block"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-green-700 shadow-sm">
            {book.category}
          </span>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h2 className="line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-green-700">
              {book.title}
            </h2>

            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <UserRound size={15} />
              {book.author}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="flex items-center gap-2 text-sm text-slate-600">
              <BookOpen size={16} />
              Available Copies
            </span>

            <span
              className={`text-sm font-semibold ${
                book.availableCopies > 0
                  ? "text-green-700"
                  : "text-red-600"
              }`}
            >
              {book.availableCopies}
            </span>
          </div>

          <div className="flex items-center justify-center rounded-md bg-green-700 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-green-800">
            View Details
          </div>
        </div>
      </Link>
    </article>
  );
}

