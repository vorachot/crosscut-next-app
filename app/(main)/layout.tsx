import Sidebar from "@/components/sidebar";
import BreadCrumb from "@/components/breadcrumb";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="relative flex flex-col">
        {/* <Navbar /> */}
        <BreadCrumb />
        <Sidebar />
        <main className="h-auto w-auto ml-[260px] mt-16 p-10 flex-grow">
          {children}
        </main>
      </div>
    </section>
  );
}
