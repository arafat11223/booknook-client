
import { Suspense } from "react";

import AuthGuard from "@/components/auth/auth-guard";
import EditBookForm from "@/components/books/edit-book-form";

type EditBookPageProps = {
  params: Promise<{ id: string }>;
};

async function EditBookContent({ params }: EditBookPageProps) {
  const { id } = await params;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              Manage Your Collection
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Edit Book
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Update your book information.
            </p>
          </div>

          <EditBookForm bookId={id} />
        </div>
      </main>
    </AuthGuard>
  );
}

export default function EditBookPage({ params }: EditBookPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="size-10 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />
        </div>
      }
    >
      <EditBookContent params={params} />
    </Suspense>
  );
}
