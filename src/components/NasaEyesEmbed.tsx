// src/components/NasaEyesEmbed.tsx
import React from "react";
import { Link } from "react-router-dom";

interface NasaEyesEmbedProps {
  slug?: string; // "earth", "asteroids", etc.
  showHeader?: boolean; // toggle header
}

const NasaEyesEmbed: React.FC<NasaEyesEmbedProps> = ({
  slug = "earth",
  showHeader = true,
}) => {
  const src =
    slug === "asteroids"
      ? "https://eyes.nasa.gov/apps/asteroids/#/"
      : `https://eyes.nasa.gov/apps/solar-system/#/${slug}`;

  return (
    <div className="h-screen flex flex-col bg-black">
      {showHeader && (
        <div className="p-4 bg-gray-900 text-white flex justify-between items-center flex-none">
          <h1 className="text-lg font-bold">NASA Eyes – {slug}</h1>
          <Link
            to="/"
            className="text-sm bg-white text-gray-900 px-3 py-1 rounded-md hover:bg-gray-200"
          >
            ⬅ Back Home
          </Link>
        </div>
      )}

      {/* Fullscreen iframe */}
      <div className="flex-1">
        <iframe
          src={src}
          title={`NASA Eyes – ${slug}`}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default NasaEyesEmbed;
