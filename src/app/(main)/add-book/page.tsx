
import PagePlaceholder from "@/components/layout/page-placeholder";
import AuthGuard from "@/components/auth/auth-guard";

export default function AddBookPage() {
  return (
    <AuthGuard>
      <PagePlaceholder
        title="Add New Book"
        description="Add a new book to the BookNook library."
      />
    </AuthGuard>
  );
}
