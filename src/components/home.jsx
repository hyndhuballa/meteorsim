import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Interactive Space Tools
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/nasa-eyes"
          className="block rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">🌍 Interactive 3D Earth</h2>
          <p className="text-gray-600">
            Explore Earth, planets, and asteroids in NASA’s Eyes.
          </p>
        </Link>
      </div>
    </div>
  );
}
