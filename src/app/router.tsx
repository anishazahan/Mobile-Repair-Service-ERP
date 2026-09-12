import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { PlaceholderPage } from "@/components/feedback/placeholder-page";
import { ComingSoonPage } from "@/pages/public/ComingSoonPage";
import { Loader2 } from "lucide-react";

const PublicLayout = lazy(() => import("@/layouts/PublicLayout").then((m) => ({ default: m.PublicLayout })));
const ErpLayout = lazy(() => import("@/layouts/ErpLayout").then((m) => ({ default: m.ErpLayout })));
const HomePage = lazy(() => import("@/pages/public/HomePage").then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage").then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("@/pages/erp/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));
const OrdersListPage = lazy(() => import("@/pages/erp/orders/OrdersListPage").then((m) => ({ default: m.OrdersListPage })));
const RepairBoardPage = lazy(() => import("@/pages/erp/orders/RepairBoardPage").then((m) => ({ default: m.RepairBoardPage })));
const NewOrderPage = lazy(() => import("@/pages/erp/orders/NewOrderPage").then((m) => ({ default: m.NewOrderPage })));
const OrderDetailPage = lazy(() => import("@/pages/erp/orders/OrderDetailPage").then((m) => ({ default: m.OrderDetailPage })));
const CustomersListPage = lazy(() => import("@/pages/erp/customers/CustomersListPage").then((m) => ({ default: m.CustomersListPage })));
const CustomerDetailPage = lazy(() => import("@/pages/erp/customers/CustomerDetailPage").then((m) => ({ default: m.CustomerDetailPage })));
const DevicesListPage = lazy(() => import("@/pages/erp/devices/DevicesListPage").then((m) => ({ default: m.DevicesListPage })));
const DeviceDetailPage = lazy(() => import("@/pages/erp/devices/DeviceDetailPage").then((m) => ({ default: m.DeviceDetailPage })));
const PartsListPage = lazy(() => import("@/pages/erp/parts/PartsListPage").then((m) => ({ default: m.PartsListPage })));
const PartDetailPage = lazy(() => import("@/pages/erp/parts/PartDetailPage").then((m) => ({ default: m.PartDetailPage })));
const SuppliersListPage = lazy(() => import("@/pages/erp/suppliers/SuppliersListPage").then((m) => ({ default: m.SuppliersListPage })));
const SupplierDetailPage = lazy(() => import("@/pages/erp/suppliers/SupplierDetailPage").then((m) => ({ default: m.SupplierDetailPage })));

const IMG = {
  services: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=85&w=1600&auto=format&fit=crop",
  pricing: "https://images.unsplash.com/photo-1743836798811-6208a08233c9?q=85&w=1600&auto=format&fit=crop",
  book: "https://images.unsplash.com/photo-1649433391719-2e784576d044?q=85&w=1600&auto=format&fit=crop",
  about: "https://images.unsplash.com/photo-1635501108232-29707bfb7c75?q=85&w=1600&auto=format&fit=crop",
  team: "https://images.unsplash.com/photo-1699389795119-297f8af9111f?q=85&w=1600&auto=format&fit=crop",
  contact: "https://images.unsplash.com/photo-1626863905121-3b0c0ed7b94c?q=85&w=1600&auto=format&fit=crop",
};

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
      {
        path: "services",
        element: (
          <ComingSoonPage
            eyebrow="What We Fix"
            title="The Full Services Directory"
            description="A detailed, filterable directory of every repair we offer — by device type, issue, and price — is on its way."
            image={IMG.services}
            imageAlt="Technician holding professional repair tools"
          />
        ),
      },
      {
        path: "pricing",
        element: (
          <ComingSoonPage
            eyebrow="Pricing"
            title="Full Pricing & Service Packages"
            description="The complete rate card for every repair category, plus bundled service packages, is being finalized."
            image={IMG.pricing}
            imageAlt="Close-up of a technician working on circuit board repair"
          />
        ),
      },
      {
        path: "book-a-service",
        element: (
          <ComingSoonPage
            eyebrow="Book a Service"
            title="Online Booking Is Almost Here"
            description="Soon you'll be able to pick a device, describe the issue, and reserve a slot online in under a minute. For now, give us a call and we'll get you booked in."
            image={IMG.book}
            imageAlt="Calendar on a screen representing appointment scheduling"
          />
        ),
      },
      {
        path: "about",
        element: (
          <ComingSoonPage
            eyebrow="About Us"
            title="The Full GadgetFIX Story"
            description="Our history, our workshop, and the people behind every repair — the full About page is coming soon."
            image={IMG.about}
            imageAlt="Technician working on a device at the repair bench"
          />
        ),
      },
      {
        path: "team",
        element: (
          <ComingSoonPage
            eyebrow="Our Team"
            title="Meet Every Technician"
            description="Full profiles for every certified technician on the floor — specialties, experience, and more — are on the way."
            image={IMG.team}
            imageAlt="Technician diagnosing a device in the workshop"
          />
        ),
      },
      {
        path: "contact",
        element: (
          <ComingSoonPage
            eyebrow="Contact Us"
            title="Get In Touch"
            description="A full contact page with a live map, contact form, and shop hours is coming soon. In the meantime, call or drop by the shop."
            image={IMG.contact}
            imageAlt="Customer service team assisting customers"
          />
        ),
      },
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
          { path: "orders", element: withSuspense(<OrdersListPage />) },
          { path: "orders/board", element: withSuspense(<RepairBoardPage />) },
          { path: "orders/new", element: withSuspense(<NewOrderPage />) },
          { path: "orders/:id", element: withSuspense(<OrderDetailPage />) },
          { path: "customers", element: withSuspense(<CustomersListPage />) },
          { path: "customers/:id", element: withSuspense(<CustomerDetailPage />) },
          { path: "devices", element: withSuspense(<DevicesListPage />) },
          { path: "devices/:id", element: withSuspense(<DeviceDetailPage />) },
          { path: "inventory/parts", element: withSuspense(<PartsListPage />) },
          { path: "inventory/parts/:id", element: withSuspense(<PartDetailPage />) },
          { path: "inventory/suppliers", element: withSuspense(<SuppliersListPage />) },
          { path: "inventory/suppliers/:id", element: withSuspense(<SupplierDetailPage />) },
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
