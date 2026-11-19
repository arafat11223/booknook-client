
import Link from "next/link";
import {
  BookOpen,
  FlaskConical,
  Landmark,
  Baby,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Fiction",
    description: "Explore stories, novels, and imaginative worlds.",
    icon: BookOpen,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    id: 2,
    name: "Science",
    description: "Discover scientific knowledge and new ideas.",
    icon: FlaskConical,
    color: "bg-blue-50 text-blue-700",
  },
  {
    id: 3,
    name: "History",
    description: "Explore historical events and civilizations.",
    icon: Landmark,
    color: "bg-amber-50 text-amber-700",
  },
  {
    id: 4,
    name: "Kids",
    description: "Find fun and educational books for children.",
    icon: Baby,
    color: "bg-pink-50 text-pink-700",
  },
  {
    id: 5,
    name: "Others",
    description: "Discover books from different categories.",
    icon: MoreHorizontal,
    color: "bg-violet-50 text-violet-700",
  },
];

export default function ExploreCategories() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Find Your Interest
          </span>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Explore Categories
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Browse books by category and discover something interesting to read.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <article
                key={category.id}
                className="group rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
              >
                <div
                  className={`flex size-14 items-center justify-center rounded-xl ${category.color}`}
                >
                  <Icon size={28} strokeWidth={1.7} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {category.name}
                </h3>

                <p className="mt-2 min-h-14 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>

                <Link
                  href={`/books?category=${category.name}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition-colors hover:text-green-900"
                >
                  Explore
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
