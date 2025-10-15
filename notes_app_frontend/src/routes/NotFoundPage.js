import React from "react";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";
import { navigate } from "../router";

/**
 * PUBLIC_INTERFACE
 * NotFoundPage shown when route is not matched.
 */
export default function NotFoundPage() {
  return (
    <div className="container">
      <EmptyState
        title="Page not found"
        subtitle="We couldn't find what you were looking for."
        action={<Button variant="primary" onClick={() => navigate("/")}>Go Home</Button>}
      />
    </div>
  );
}
