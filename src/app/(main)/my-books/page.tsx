
import PagePlaceholder from "@/components/layout/page-placeholder";
import AuthGuard from "@/components/auth/auth-guard";

export default function MyBooksPage() {
  return (
    <AuthGuard>
      <PagePlaceholder
        title="My Books"
        description="Manage the books you have added to BookNook."
      />
    </AuthGuard>
  );
}
