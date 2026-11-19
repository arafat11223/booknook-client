
import PagePlaceholder from "@/components/layout/page-placeholder";
import AuthGuard from "@/components/auth/auth-guard";

export default function MyBorrowsPage() {
  return (
    <AuthGuard>
      <PagePlaceholder
        title="My Borrows"
        description="View and manage the books you have borrowed."
      />
    </AuthGuard>
  );
}
