import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectsSection from "@/components/ProjectsSection";
import Playground from "@/components/Playground";
import AboutFooter from "@/components/AboutFooter";

export default function HomePage() {
  return (
    <div className="relative min-h-screen text-ink">
      <Playground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <ProjectsSection />
        </main>
        <AboutFooter />
      </div>
    </div>
  );
}
