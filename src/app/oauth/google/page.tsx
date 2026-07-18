import { Suspense } from "react";
import OAuthCallback from "@/views/OAuthCallback";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OAuthCallback />
    </Suspense>
  );
}
