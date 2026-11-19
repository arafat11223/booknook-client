
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

type BookCategory =
  | "Fiction"
  | "Science"
  | "History"
  | "Kids"
  | "Others";

type CreateBookResponse = {
  success: boolean;
  message: string;
  data: {
    _id: string;
  };
};

const categories: BookCategory[] = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function AddBookForm() {
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<BookCategory>("Fiction");
  const [description, setDescription] = useState("");
  const [totalCopies, setTotalCopies] = useState("1");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedImage(null);
    setPreview("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!session?.user) {
      setError("Please login before adding a book.");
      return;
    }

    if (!selectedImage) {
      setError("Please select a book cover image.");
      return;
    }

    const copies = Number(totalCopies);

    if (!Number.isInteger(copies) || copies < 1) {
      setError("Total copies must be at least 1.");
      return;
    }

    try {
      setIsSubmitting(true);
      setIsUploading(true);

      const imageUrl = await uploadImage(selectedImage);

      setIsUploading(false);

      await apiRequest<CreateBookResponse>("/books", {
        method: "POST",
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
          : "Failed to add the book."
      );
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

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
              Enter the details of your book.
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
              placeholder="Enter book title"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
              placeholder="Enter author name"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value as BookCategory)}
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
              placeholder="Write a short description about the book..."
              className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
              onChange={(event) => setTotalCopies(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
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
              Upload an image for your book.
            </p>
          </div>
        </div>

        {preview ? (
          <div className="relative mx-auto max-w-xs overflow-hidden rounded-xl border border-slate-200">
            <Image
              src={preview}
              alt="Book cover preview"
              width={400}
              height={500}
              unoptimized
              className="h-80 w-full object-cover"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow-md transition hover:bg-red-50"
              aria-label="Remove image"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <label
            htmlFor="bookImage"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center transition hover:border-green-500 hover:bg-green-50"
          >
            <Upload size={32} className="text-green-700" />

            <span className="mt-4 font-semibold text-slate-700">
              Click to upload book cover
            </span>

            <span className="mt-2 text-xs text-slate-500">
              PNG, JPG or WEBP. Maximum 32 MB.
            </span>
          </label>
        )}

        <input
          id="bookImage"
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => handleImageChange(event.target.files?.[0])}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">
          Added By
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your account information.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              readOnly
              value={session?.user?.name || ""}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              readOnly
              value={session?.user?.email || ""}
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-4 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle size={19} className="animate-spin" />
            {isUploading ? "Uploading Image..." : "Adding Book..."}
          </>
        ) : (
          <>
            <BookPlus size={19} />
            Add Book
          </>
        )}
      </button>
    </form>
  );
}
