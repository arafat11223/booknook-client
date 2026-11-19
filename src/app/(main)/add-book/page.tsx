
import AuthGuard from "@/components/auth/auth-guard";
import AddBookForm from "@/components/books/add-book-form";

export default function AddBookPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              Contribute to BookNook
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Add a New Book
            </h1>

            <p className="mt-3 text-slate-600">
              Share a book with our community by providing its information.
            </p>
          </div>

          <AddBookForm />
        </div>
      </main>
    </AuthGuard>
  );
}
