
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useSession } from "@/lib/auth-client";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      const callbackURL = encodeURIComponent(pathname);
      router.replace(`/login?callbackURL=${callbackURL}`);
    }
  }, [isPending, session, pathname, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
