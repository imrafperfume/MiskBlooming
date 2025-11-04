import HeroTable from "@/src/components/dashboard/hero/HeroTable";

export default function AdminHeroPage() {
  return (
    <div className="p-6 w-full ">
      <h1 className="text-2xl font-bold mb-4">Hero Slider — Admin</h1>
      <HeroTable />
    </div>
  );
}
