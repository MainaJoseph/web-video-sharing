// PaymentPage.tsx (Server Component)
import React from "react";
import { use } from "react";
import PaymentStatusClient from "./PaymentStatusClient";

export default function PaymentPage({
  searchParams,
}: {
  searchParams: { session_id?: string; cancel?: string };
}) {
  // Unwrap searchParams with React.use()
  const params = use(Promise.resolve(searchParams));

  return (
    <PaymentStatusClient
      cancel={params.cancel === "true"}
      sessionId={params.session_id}
    />
  );
}
