import { Construction } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/feedback/empty-state";

/** Temporary stand-in for ERP modules not yet built in this development pass. */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} />
      <EmptyState
        icon={Construction}
        title={`${title} is coming up next`}
        description="This module is fully specified in the frontend architecture and will be built in the next development pass."
      />
    </div>
  );
}
