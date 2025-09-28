import { Link } from "react-router-dom";

export default function NasaEyesEmbed() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
        <h1 className="text-lg font-bold">NASA Eyes</h1>
        <Link
          to="/"
          className="text-sm bg-white text-gray-900 px-3 py-1 rounded-md hover:bg-gray-200"
        >
          ⬅ Back Home
        </Link>
      </div>

      {/* Embed Section */}
      <div className="flex-1">
        <iframe
          src="https://eyes.nasa.gov/apps/asteroids/#/"
          title="NASA Eyes on Asteroids"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
