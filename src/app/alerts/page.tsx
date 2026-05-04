import { Suspense } from "react";
import AlertsPage from "@/views/Alerts";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AlertsPage />
    </Suspense>
  );
}
