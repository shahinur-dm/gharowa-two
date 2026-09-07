'use client';

import React, { useState, useEffect } from 'react';
import { Play, X, Video } from 'lucide-react';
import { BlogVideo } from '../types';
import { api } from '../lib/api';

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  // Convert youtu.be, youtube.com/watch?v=, youtube.com/embed/, or shorts to embed format
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
  }
  return url;
}

export default function BlogVideoSection() {
  const [videos, setVideos] = useState<BlogVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<BlogVideo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/blogs');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setVideos(res.data);
        }
      } catch (err) {
        console.warn('Failed to fetch blog videos', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (!isLoading && videos.length === 0) {
    return null;
  }

  // Duplicate items for infinite seamless horizontal scrolling
  const displayList = videos.length > 0 ? [...videos, ...videos, ...videos, ...videos] : [];

  return (
    <section className="py-10 sm:py-14 bg-white relative overflow-hidden font-sans">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center">
        <div className="inline-flex items-center justify-center gap-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#EA580C] tracking-tight">
            Our Blog
          </h2>
          <span className="w-1 h-7 sm:h-8 bg-[#EA580C] rounded-full inline-block" />
        </div>
      </div>

      {/* Infinite Horizontal Carousel Container */}
      <div className="relative w-full overflow-hidden">
        {/* Continuous Marquee Track */}
        <div className="animate-marquee-continuous flex items-center gap-4 sm:gap-6 py-2 px-3">
          {displayList.map((video, index) => {
            return (
              <div
                key={`${video._id}-${index}`}
                onClick={() => setSelectedVideo(video)}
                className="group relative shrink-0 w-[280px] sm:w-[340px] md:w-[380px] lg:w-[410px] aspect-[16/7] rounded-2xl sm:rounded-[20px] overflow-hidden border-2 border-[#EA580C] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-900 select-none"
              >
                {/* Video Thumbnail Background */}
                <img
                  src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop'}
                  alt={video.title || 'Video blog'}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Ambient Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity" />

                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#EA580C] group-hover:border-[#EA580C] transition-all duration-300">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white ml-0.5" />
                  </div>
                </div>

                {/* Video Title & Duration */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white drop-shadow-md">
                  <p className="text-xs sm:text-sm font-semibold truncate pr-2 text-white/95">
                    {video.title}
                  </p>
                  {video.duration && (
                    <span className="shrink-0 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-black/60 border border-white/20 text-white/90">
                      {video.duration}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Popup Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-800 border-b border-slate-700 text-white">
              <div className="flex items-center gap-2 min-w-0 pr-4">
                <Video className="w-5 h-5 text-[#EA580C] shrink-0" />
                <h3 className="text-sm sm:text-base font-semibold truncate text-white">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-xl bg-slate-700/80 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="relative w-full aspect-video bg-black">
              {selectedVideo.videoUrl.includes('youtube') || selectedVideo.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={getYouTubeEmbedUrl(selectedVideo.videoUrl)}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  Your browser does not support HTML video.
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
