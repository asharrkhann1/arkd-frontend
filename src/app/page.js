import HeroCarousel from "@/components/Landing/HeroCarousel";
import FeaturedCategories from "@/components/Landing/FeaturedCategories";
import AnimatedDivider from "@/components/Landing/AnimatedDivider";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import ReviewsSection from "@/components/Landing/ReviewsSection";
import WhyChooseUs from "@/components/Landing/WhyChooseUs";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <FeaturedCategories />
      <AnimatedDivider />
      <FeaturesSection />
      <ReviewsSection />
      <WhyChooseUs />
    </>
  );
}
