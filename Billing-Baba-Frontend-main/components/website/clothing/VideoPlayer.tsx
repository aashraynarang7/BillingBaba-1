"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { PlayCircle } from 'lucide-react'

interface VideoPlayerProps {
  youtubeUrl: string;
  title: string;
}

export default function VideoPlayer({ youtubeUrl, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(youtubeUrl);

  if (!videoId) {
    return (
      <div className="text-center py-10 text-red-500">
        Invalid YouTube URL provided.
      </div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-8">
          {title}
        </h2>
        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
          {!isPlaying ? (
            <div onClick={handlePlayClick} className="relative w-full h-full cursor-pointer group">
              <Image
                src={thumbnailUrl}
                alt={`Thumbnail for ${title}`}
                layout="fill"
                objectFit="cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-300 group-hover:bg-black/50">
                <PlayCircle className="w-20 h-20 text-white/80 transform transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          )}
        </div>
      </div>
    </section>
  )
}