
import Link from "next/link";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/books" },
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand Information */}
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-green-700 text-white">
                <BookOpen size={21} />
              </div>

              <span className="text-xl font-bold tracking-tight text-green-800">
                BookNook
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-slate-600">
              BookNook is your small online library. Discover new books,
              explore different categories, and borrow your favourite
              books from one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="mb-4 text-base font-semibold text-slate-900">
              Quick Links
            </h2>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-green-700"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="mb-4 text-base font-semibold text-slate-900">
              Contact Us
            </h2>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={18} className="shrink-0 text-green-700" />
                <a
                  href="mailto:contact@booknook.com"
                  className="transition-colors hover:text-green-700"
                >
                  contact@booknook.com
                </a>
              </li>

              <li className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={18} className="shrink-0 text-green-700" />
                <span>+880 1234-567890</span>
              </li>

              <li className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin size={18} className="shrink-0 text-green-700" />
                <span>Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-center text-sm text-slate-500">
            © 2026 BookNook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
