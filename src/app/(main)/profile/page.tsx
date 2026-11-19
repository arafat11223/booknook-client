
"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import AuthGuard from "@/components/auth/auth-guard";
import { BookOpen, Library, Mail, UserRound } from "lucide-react";

function ProfileContent() {
  const { data: session, isPending, error } = useSession();

  const user = session?.user;

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Unable to Load Profile
        </h1>
        <p className="mt-2 text-slate-500">
          Please sign in again to view your profile.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const initial = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Account Settings
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            My Profile
          </h1>
          <p className="mt-2 text-slate-500">
            View your BookNook account information.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-5 border-b border-slate-100 pb-8 sm:flex-row">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={96}
                height={96}
                unoptimized
                className="size-24 rounded-full border-4 border-green-100 object-cover"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-800">
                {initial}
              </div>
            )}

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-900">
                {user.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{user.email}</p>
              <span className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                BookNook Member
              </span>
            </div>
          </div>

          <div className="grid gap-5 py-8 sm:grid-cols-2">
            <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-5">
              <div className="rounded-lg bg-green-100 p-3 text-green-700">
                <UserRound className="size-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Full Name</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-5">
              <div className="rounded-lg bg-green-100 p-3 text-green-700">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Email Address</p>
                <p className="mt-1 break-all font-semibold text-slate-900">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              My Library
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/my-books"
                className="flex items-center gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-green-300 hover:bg-green-50"
              >
                <Library className="size-6 text-green-700" />
                <div>
                  <p className="font-semibold text-slate-900">My Books</p>
                  <p className="text-sm text-slate-500">
                    Manage your added books
                  </p>
                </div>
              </Link>

              <Link
                href="/my-borrows"
                className="flex items-center gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-green-300 hover:bg-green-50"
              >
                <BookOpen className="size-6 text-green-700" />
                <div>
                  <p className="font-semibold text-slate-900">My Borrows</p>
                  <p className="text-sm text-slate-500">
                    View your borrowed books
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
