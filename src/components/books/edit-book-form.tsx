
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookPlus,
  ImagePlus,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { uploadImage } from "@/lib/upload-image";
import type { Book } from "@/types/book";

type BookResponse = {
  success: boolean;
  message: string;
  data: Book;
};

type BookCategory = Book["category"];

const categories: BookCategory[] = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

type EditBookFormProps = {
  bookId: string;
};

export default function EditBookForm({
  bookId,
}: EditBookFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<BookCategory>("Fiction");
  const [description, setDescription] = useState("");
  const [totalCopies, setTotalCopies] = useState("1");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await apiRequest<BookResponse>(
          `/books/${bookId}`
        );

        const currentBook = response.data;

        if (
          currentBook.addedBy.userId !== session?.user?.id
        ) {
          setError("You are not authorized to edit this book.");
          return;
        }

        setBook(currentBook);
        setTitle(currentBook.title);
        setAuthor(currentBook.author);
        setCategory(currentBook.category);
        setDescription(currentBook.description);
        setTotalCopies(String(currentBook.totalCopies));
        setPreview(currentBook.image);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load book details."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchBook();
    }
  }, [bookId, session?.user?.id]);

  const handleImageChange = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 32 * 1024 * 1024) {
      setError("Image size must be less than 32 MB.");
      return;
    }

    setError("");
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeSelectedImage = () => {
    if (selectedImage && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setSelectedImage(null);
    setPreview(book?.image || "");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (!book || !session?.user) {
      setError("Please login before editing a book.");
      return;
    }

    const copies = Number(totalCopies);

    if (!Number.isInteger(copies) || copies < 1) {
      setError("Total copies must be at least 1.");
      return;
    }

    const borrowedCopies =
      book.totalCopies - book.availableCopies;

    if (copies < borrowedCopies) {
      setError(
        `At least ${borrowedCopies} copies must remain because some copies are currently borrowed.`
      );
      return;
    }

    try {
      setIsSubmitting(true);

      let imageUrl = book.image;

      if (selectedImage) {
        setIsUploading(true);
        imageUrl = await uploadImage(selectedImage);
        setIsUploading(false);
      }

      await apiRequest(`/books/${bookId}`, {
        method: "PATCH",
        authenticated: true,
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          category,
          image: imageUrl,
          description: description.trim(),
          totalCopies: copies,
        }),
      });

      router.push("/my-books");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update the book."
      );
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center">
        <LoaderCircle
          size={36}
          className="animate-spin text-green-700"
        />

        <p className="mt-4 text-sm text-slate-500">
          Loading book information...
        </p>
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="rounded-xl border border-red-100 bg-white p-8 text-center">
        <p className="text-sm text-red-600">{error}</p>

        <button
          type="button"
          onClick={() => router.push("/my-books")}
          className="mt-5 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
        >
          Back to My Books
        </button>
      </div>
    );
  }

  if (!book) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-green-50 p-2.5">
            <BookPlus className="text-green-700" size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Book Information
            </h2>

            <p className="text-sm text-slate-500">
              Update your book details.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">
              Book Title
            </label>

            <input
              id="title"
              required
              maxLength={150}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label htmlFor="author" className="mb-2 block text-sm font-semibold text-slate-700">
              Author
            </label>

            <input
              id="author"
              required
              maxLength={100}
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">
              Category
            </label>

            <select
              id="category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as BookCategory)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              id="description"
              required
              maxLength={2000}
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {description.length}/2000
            </p>
          </div>

          <div>
            <label htmlFor="totalCopies" className="mb-2 block text-sm font-semibold text-slate-700">
              Total Copies
            </label>

            <input
              id="totalCopies"
              type="number"
              min="1"
              step="1"
              required
              value={totalCopies}
              onChange={(event) =>
                setTotalCopies(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <p className="mt-1 text-xs text-slate-400">
              Currently available: {book.availableCopies}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-green-50 p-2.5">
            <ImagePlus className="text-green-700" size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Book Cover
            </h2>

            <p className="text-sm text-slate-500">
              Keep the existing image or upload a new one.
            </p>
          </div>
        </div>

        {preview && (
          <div className="relative mx-auto max-w-xs overflow-hidden rounded-xl border border-slate-200">
            <img
              src={preview}
              alt="Book cover preview"
              className="h-80 w-full object-cover"
            />

            {selectedImage && (
              <button
                type="button"
                onClick={removeSelectedImage}
                className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow-md hover:bg-red-50"
                aria-label="Remove selected image"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <label
          htmlFor="bookImage"
          className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-green-500 hover:bg-green-50"
        >
          <Upload size={28} className="text-green-700" />

          <span className="mt-3 font-semibold text-slate-700">
            Click to upload a new cover
          </span>

          <span className="mt-2 text-xs text-slate-500">
            PNG, JPG or WEBP. Maximum 32 MB.
          </span>
        </label>

        <input
          id="bookImage"
          type="file"
          accept="image/*"
          hidden
          onChange={(event) =>
            handleImageChange(event.target.files?.[0])
          }
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">
          Added By
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Name
            </label>

            <input
              readOnly
              value={book.addedBy.name}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              readOnly
              value={book.addedBy.email}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
            />
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => router.push("/my-books")}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 px-6 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle size={19} className="animate-spin" />
              {isUploading ? "Uploading Image..." : "Updating Book..."}
            </>
          ) : (
            <>
              <BookPlus size={19} />
              Update Book
            </>
          )}
        </button>
      </div>
    </form>
  );
}
