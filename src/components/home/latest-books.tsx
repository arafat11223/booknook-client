
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

const latestBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Development",
    cover: "bg-emerald-800",
  },
  {
    id: 2,
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity",
    cover: "bg-slate-800",
  },
  {
    id: 3,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance",
    cover: "bg-amber-700",
  },
  {
    id: 4,
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    category: "Finance",
    cover: "bg-blue-900",
  },
  {
    id: 5,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    cover: "bg-orange-800",
  },
  {
    id: 6,
    title: "Think Like a Monk",
    author: "Jay Shetty",
    category: "Self Development",
    cover: "bg-teal-800",
  },
];

export default function LatestBooks() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
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

        {/* Books Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestBooks.map((book) => (
            <article
              key={book.id}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Book Cover Placeholder */}
              <div
                className={`flex h-64 items-center justify-center ${book.cover}`}
              >
                <div className="flex h-48 w-36 flex-col items-center justify-center rounded-r-lg border-l-4 border-white/20 bg-white/10 px-4 text-center text-white shadow-xl">
                  <BookOpen size={38} strokeWidth={1.5} />

                  <h3 className="mt-5 text-lg font-bold leading-snug">
                    {book.title}
                  </h3>

                  <div className="mt-4 h-px w-10 bg-white/60" />

                  <p className="mt-3 text-xs text-white/80">
                    {book.author}
                  </p>
                </div>
              </div>

              {/* Book Information */}
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

                <Link
                  href="/books"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900"
                >
                  Explore Books
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
