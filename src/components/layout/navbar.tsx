
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  UserRound,
  BookMarked,
  BookCopy,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

import { useSession, signOut } from "@/lib/auth-client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/books" },
];

const userLinks = [
  { name: "My Profile", href: "/profile", icon: UserRound },
  { name: "My Books", href: "/my-books", icon: BookMarked },
  { name: "My Borrows", href: "/my-borrows", icon: BookCopy },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const user = session?.user;

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    await signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const AuthLinks = () => {
    if (isPending) {
      return (
        <div className="h-9 w-24 animate-pulse rounded-md bg-slate-100" />
      );
    }

    if (!user) {
      return (
        <>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            Login
          </Link>

          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="inline-flex h-9 items-center justify-center rounded-md bg-green-700 px-4 text-sm font-medium text-white transition-colors hover:bg-green-800"
          >
            Register
          </Link>
        </>
      );
    }

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-10 items-center gap-2 rounded-full border border-slate-200 px-2 transition-colors hover:bg-slate-50"
          >
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="size-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-800">
                <UserRound size={18} />
              </div>
            )}

            <span className="max-w-28 truncate text-sm font-medium text-slate-700">
              {user.name}
            </span>

            <ChevronDown size={15} className="text-slate-500" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
  <p className="truncate text-sm font-semibold">{user.name}</p>
  <p className="truncate text-xs font-normal text-slate-500">
    {user.email}
  </p>
</div>

            <DropdownMenuSeparator />

            {userLinks.map((link) => {
              const Icon = link.icon;

              return (
                <DropdownMenuItem
                  key={link.href}
                  render={
                    <Link href={link.href}>
                      <Icon size={16} />
                      {link.name}
                    </Link>
                  }
                />
              );
            })}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-green-700 text-white">
            <BookOpen size={21} />
          </div>

          <span className="text-xl font-bold tracking-tight text-green-800">
            BookNook
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-green-700 ${
                isActive(link.href)
                  ? "text-green-700"
                  : "text-slate-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <AuthLinks />
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label={open ? "Close menu" : "Open menu"}
                  className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 transition-colors hover:bg-slate-100"
                />
              }
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-6">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="text-green-700" />

                  <span className="text-xl font-bold text-green-800">
                    BookNook
                  </span>
                </Link>

                <div className="flex flex-col gap-2">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-green-50 text-green-700"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                {user && !isPending && (
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="size-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-800">
                          <UserRound size={20} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {user && !isPending ? (
                    <>
                      {userLinks.map((link) => {
                        const Icon = link.icon;

                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                              isActive(link.href)
                                ? "bg-green-50 text-green-700"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <Icon size={17} />
                            {link.name}
                          </Link>
                        );
                      })}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut size={17} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <AuthLinks />
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
