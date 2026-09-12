import { Outlet } from "react-router-dom";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

/** Shell for the public marketing site — deliberately distinct from the ERP shell. */
export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
