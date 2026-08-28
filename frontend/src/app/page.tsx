'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { MenuItem, RestaurantSettings } from '../types';
import HeroSection from '../components/HeroSection';
import FeaturedDishes from '../components/FeaturedDishes';
import WhyChooseUs from '../components/WhyChooseUs';
import AboutStorySection from '../components/AboutStorySection';
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
    <div className="space-y-4 pb-16">
      {/* 1. Mutton Khichuri Hero Section with 2D Pouring Animation */}
      <HeroSection settings={settings} />

      {/* 2. Popular & Featured Dishes Section */}
      <FeaturedDishes dishes={dishes} />

      {/* 3. Why Choose Us (4 Value Pillars) */}
      <WhyChooseUs />

      {/* 4. Our Story / About Us Section */}
      <AboutStorySection settings={settings} />

      {/* 5. Chef & Owner Section */}
      <ChefAndOwnerSection settings={settings} />

      {/* 6. Contact Us Section */}
      <ContactSection settings={settings} />
    </div>
  );
}
