
import Link from "next/link";
import {
  Search,
  BookOpen,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Discover Books",
    description:
      "Browse our library and explore books from different categories to find your next favourite read.",
    icon: Search,
  },
  {
    id: 2,
    title: "Borrow Your Book",
    description:
      "Choose an available book, sign in to your account, and complete the borrowing process.",
    icon: BookOpen,
  },
  {
    id: 3,
    title: "Return on Time",
    description:
      "Enjoy your reading experience and return the book by its due date so others can read it too.",
    icon: RefreshCw,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Simple & Easy
          </span>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How Borrowing Works
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Borrowing books from BookNook is simple. Follow these three steps
            to start your reading journey.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.id}
                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
              >
                <span className="absolute right-6 top-5 text-4xl font-bold text-green-100">
                  0{step.id}
                </span>

                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                  <Icon size={30} strokeWidth={1.7} />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800"
          >
            Start Exploring
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
