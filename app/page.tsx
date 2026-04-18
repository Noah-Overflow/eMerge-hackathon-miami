import { CTABanner } from "@/components/CTABanner";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Integrations } from "@/components/Integrations";
import { Navbar } from "@/components/Navbar";
import { Pricing } from "@/components/Pricing";
import { Stats } from "@/components/Stats";
import { UseCase } from "@/components/UseCase";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <UseCase />
        <Integrations />
        <Pricing />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
