
import PagePlaceholder from "@/components/layout/page-placeholder";
import AuthGuard from "@/components/auth/auth-guard";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <PagePlaceholder
        title="My Profile"
        description="View and manage your BookNook account information."
      />
    </AuthGuard>
  );
}
