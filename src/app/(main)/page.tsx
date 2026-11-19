
import HeroSection from "@/components/home/hero-section";
import LatestBooks from "@/components/home/latest-books";
import ExploreCategories from "@/components/home/explore-categories";
import HowItWorks from "@/components/home/how-it-works";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LatestBooks />
      <ExploreCategories />
      <HowItWorks />
    </>
  );
}
