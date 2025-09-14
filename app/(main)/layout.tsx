import Sidebar from "@/components/sidebar";
import BreadCrumb from "@/components/breadcrumb";
import { BreadcrumbProvider } from "@/context/BreadCrumbContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <BreadcrumbProvider>
        <div className="relative flex flex-col">
          {/* <Navbar /> */}
          <BreadCrumb />
          <Sidebar />
          <main className="h-auto w-auto md:ml-[260px] mt-16 p-10 flex-grow">
            {children}
          </main>
        </div>
      </BreadcrumbProvider>
    </section>
  );
}
