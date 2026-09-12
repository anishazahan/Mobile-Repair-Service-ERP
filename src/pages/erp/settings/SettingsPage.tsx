import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/features/auth/store";
import { MyProfileForm } from "@/features/settings/components/my-profile-form";
import { ServiceCatalogSection } from "@/features/settings/components/service-catalog-section";
import { ShopProfileForm } from "@/features/settings/components/shop-profile-form";

export function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const canManageShop = user?.role === "admin" || user?.role === "manager";

  if (!canManageShop) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" description="Manage your personal account details." />
        <div className="max-w-xl">
          <MyProfileForm />
        </div>
      </div>
    );
  }

  const tab = searchParams.get("tab") === "profile" ? "profile" : searchParams.get("tab") === "catalog" ? "catalog" : "shop";

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Shop details, the service price list, and your personal account." />

      <Tabs value={tab} onValueChange={(v) => setSearchParams(v === "shop" ? {} : { tab: v })}>
        <TabsList>
          <TabsTrigger value="shop">Shop Profile</TabsTrigger>
          <TabsTrigger value="catalog">Service Catalog</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="max-w-xl">
          <ShopProfileForm />
        </TabsContent>
        <TabsContent value="catalog">
          <ServiceCatalogSection />
        </TabsContent>
        <TabsContent value="profile" className="max-w-xl">
          <MyProfileForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
