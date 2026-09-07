'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { MenuItem, RestaurantSettings } from '../types';
import HeroSection from '../components/HeroSection';
import FeaturedDishes from '../components/FeaturedDishes';
import HomeMenuSection from '../components/HomeMenuSection';
import BlogVideoSection from '../components/BlogVideoSection';
import ReviewSection from '../components/ReviewSection';
import AboutStorySection from '../components/AboutStorySection';
import WhyChooseUs from '../components/WhyChooseUs';
import ChefAndOwnerSection from '../components/ChefAndOwnerSection';
import ContactSection from '../components/ContactSection';

export default function HomePage() {
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [dishesRes, settingsRes]: [any, any] = await Promise.all([
          api.get('/menu/items'),
          api.get('/settings'),
        ]);

        if (dishesRes.success && dishesRes.data) {
          setDishes(dishesRes.data);
        }
        if (settingsRes.success && settingsRes.data) {
          setSettings(settingsRes.data);
        }
      } catch (err) {
        console.warn('Error fetching homepage data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="-mt-[64px] sm:-mt-[72px] space-y-2 pb-16">
      {/* 1. Hero Section (Mutton Khichuri + 2D Pouring Animation) */}
      <HeroSection settings={settings} />

      {/* 2. Popular Dishes (Directly Below Hero with View All & Carousel) */}
      <FeaturedDishes dishes={dishes} />

      {/* 3. Our Menu (Category Filter Pills & Responsive Grid matching Reference 2) */}
      <HomeMenuSection dishes={dishes} />

      {/* 4. OUR BLOG (Infinite Continuous Video Scroll & Modal Player) */}
      <BlogVideoSection />

      {/* 5. OUR REVIEW (Customers Loves - Google Review Cards & Store Summary) */}
      <ReviewSection />

      {/* 6. About Us / Our Story with Heritage Stats */}
      <AboutStorySection settings={settings} />

      {/* 7. Why Choose Us (4 Value Pillars) */}
      <WhyChooseUs />

      {/* 8. Chef & Owner Section */}
      <ChefAndOwnerSection settings={settings} />

      {/* 9. Contact Us Section with Form & Coordinates */}
      <ContactSection settings={settings} />
    </div>
  );
}

