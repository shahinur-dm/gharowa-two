'use client';

import { MenuItem, RestaurantSettings } from '../types';
import { instantMenuItems, instantSettings } from '../data/publicSnapshot';
import HeroSection from '../components/HeroSection';
import FeaturedDishes from '../components/FeaturedDishes';
import HomeMenuSection from '../components/HomeMenuSection';
import BlogVideoSection from '../components/BlogVideoSection';
import ReviewSection from '../components/ReviewSection';
import TrustedBrandsSection from '../components/TrustedBrandsSection';
import AboutStorySection from '../components/AboutStorySection';
import WhyChooseUs from '../components/WhyChooseUs';
import ChefAndOwnerSection from '../components/ChefAndOwnerSection';
import ContactSection from '../components/ContactSection';

export default function HomePage() {
  const dishes = instantMenuItems as MenuItem[];
  const settings = instantSettings as RestaurantSettings;

  return (
    <div className="-mt-[64px] sm:-mt-[72px] space-y-2 pb-16">
      <HeroSection settings={settings} />
      <FeaturedDishes dishes={dishes} />
      <HomeMenuSection dishes={dishes} />
      <BlogVideoSection />
      <ReviewSection />
      <TrustedBrandsSection />
      <AboutStorySection settings={settings} />
      <WhyChooseUs />
      <ChefAndOwnerSection settings={settings} />
      <ContactSection settings={settings} />
    </div>
  );
}
