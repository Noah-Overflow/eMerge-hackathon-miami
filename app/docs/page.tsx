import { IntegrationGuide } from "@/components/docs/IntegrationGuide";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main>
        <IntegrationGuide />
      </main>
      <Footer />
    </>
  );
}
