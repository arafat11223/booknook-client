
"use client";

import { useState } from "react";

import { apiRequest } from "@/lib/api";

type ProtectedResponse = {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  userId: string;
};

export default function ApiTestPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setResult("");

    try {
      const data = await apiRequest<ProtectedResponse>(
        "/api/protected",
        {
          authenticated: true,
        }
      );

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900">
        JWT Authentication Test
      </h1>

      <p className="mt-2 text-slate-600">
        Test the connection between Better Auth and Express API.
      </p>

      <button
        type="button"
        onClick={testApi}
        disabled={loading}
        className="mt-6 rounded-md bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Protected API"}
      </button>

      {result && (
        <pre className="mt-6 overflow-x-auto rounded-lg bg-slate-900 p-5 text-sm text-green-300">
          {result}
        </pre>
      )}
    </main>
  );
}
