import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { PlaceholderPage } from "@/components/feedback/placeholder-page";
import { Loader2 } from "lucide-react";

const PublicLayout = lazy(() => import("@/layouts/PublicLayout").then((m) => ({ default: m.PublicLayout })));
const ErpLayout = lazy(() => import("@/layouts/ErpLayout").then((m) => ({ default: m.ErpLayout })));
const HomePage = lazy(() => import("@/pages/public/HomePage").then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage").then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("@/pages/erp/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

function RouteFallback() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<PublicLayout />),
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: "services", element: <PlaceholderPage title="Services" /> },
      { path: "pricing", element: <PlaceholderPage title="Pricing & Service Packages" /> },
      { path: "book-a-service", element: <PlaceholderPage title="Book a Service" /> },
      { path: "about", element: <PlaceholderPage title="About Us" /> },
      { path: "team", element: <PlaceholderPage title="Our Team" /> },
      { path: "contact", element: <PlaceholderPage title="Contact Us" /> },
    ],
  },
  { path: "/login", element: withSuspense(<LoginPage />) },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        element: withSuspense(<ErpLayout />),
        children: [
          { index: true, element: withSuspense(<DashboardPage />) },
          { path: "orders", element: <PlaceholderPage title="Service Orders" /> },
          { path: "customers", element: <PlaceholderPage title="Customers" /> },
          { path: "devices", element: <PlaceholderPage title="Devices" /> },
          { path: "inventory/parts", element: <PlaceholderPage title="Spare Parts" /> },
          { path: "inventory/suppliers", element: <PlaceholderPage title="Suppliers" /> },
          { path: "billing", element: <PlaceholderPage title="Billing" /> },
          { path: "reports", element: <PlaceholderPage title="Reports" /> },
          { path: "technicians", element: <PlaceholderPage title="Technicians" /> },
          { path: "staff", element: <PlaceholderPage title="Staff & Users" /> },
          { path: "settings", element: <PlaceholderPage title="Settings" /> },
        ],
      },
    ],
  },
  { path: "*", element: withSuspense(<NotFoundPage />) },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
