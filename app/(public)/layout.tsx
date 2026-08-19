import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import GlobalJsonLd from "@/components/SEO/GlobalJsonLd";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col w-full min-h-screen">
      <GlobalJsonLd />
      <Navbar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </div>
  );
}
