import { Suspense } from "react";
import VerifyEmail from "@/views/VerifyEmail";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyEmail />
    </Suspense>
  );
}
