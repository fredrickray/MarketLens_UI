"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { authApi } from "@/lib/api/endpoints";

const OAuthCallback = () => {
  const router = useRouter();
  const params = useSearchParams();
  const { applyAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const code = params.get("code");
    if (!code) {
      setError("Missing authorization code");
      return;
    }
    (async () => {
      try {
        const res = await authApi.exchangeOAuth(code);
        applyAuth(res);
        toast.success("Signed in with Google");
        router.replace("/dashboard");
      } catch {
        setError("Could not complete Google sign-in");
      }
    })();
  }, [params, applyAuth, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        {error ? (
          <>
            <p className="mb-4 text-destructive">{error}</p>
            <button
              className="text-primary underline"
              onClick={() => router.replace("/login")}
            >
              Back to login
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Completing sign-in…</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
