// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, Star, Rocket, AlertTriangle } from "lucide-react";

// export default function LiveNasaData() {
//   const [option, setOption] = useState("");
//   const [date, setDate] = useState("");
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     if (!option) {
//       alert("Please select an option first");
//       return;
//     }
//     if (!date) {
//       alert("Please select a date");
//       return;
//     }

//     let url = "";
//     const apiKey = "1P7WUiuH31fTCPBiu4RHCoEesGQ4L4hxkYAas7sH"; // 🔑 replace with your NASA API Key

//     try {
//       setLoading(true);
//       if (option === "apod") {
//         url = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`;
//       } else if (option === "mars") {
//         url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${apiKey}`;
//       } else if (option === "neo") {
//         url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apiKey}`;
//       }

//       const res = await fetch(url);
//       const json = await res.json();
//       setData(json);
//     } catch (err) {
//       console.error("Error fetching NASA data:", err);
//       alert("Error fetching data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getOptionIcon = (opt: string) => {
//     switch (opt) {
//       case "apod": return <Star className="w-4 h-4" />;
//       case "mars": return <Rocket className="w-4 h-4" />;
//       case "neo": return <AlertTriangle className="w-4 h-4" />;
//       default: return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="absolute top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition z-10"
//       >
//         <ArrowLeft className="w-5 h-5" />
//         Back
//       </button>

//       <div className="max-w-6xl mx-auto">
//         {/* Title */}
//         <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-cyan-400">
//           🚀 Live NASA Data Explorer
//         </h1>

//         {/* Controls */}
//         <div className="glass-card p-6 mb-8 rounded-xl shadow-lg">
//           <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
//             {/* Dropdown */}
//             <div className="relative">
//               <select
//                 value={option}
//                 onChange={(e) => setOption(e.target.value)}
//                 className="appearance-none bg-black/50 backdrop-blur-sm text-white border border-cyan-500/30 p-3 pr-8 rounded-lg cursor-pointer
//                            hover:bg-cyan-500/10 hover:border-cyan-400 focus:bg-cyan-500/10 focus:border-cyan-400 transition-all duration-300 min-w-[200px]"
//               >
//                 <option value="">-- Select Option --</option>
//                 <option value="apod">🌌 Picture of the Day</option>
//                 <option value="mars">🔴 Mars Rover Photos</option>
//                 <option value="neo">⚠️ Near Earth Objects</option>
//               </select>
//               <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyan-400 pointer-events-none">
//                 {getOptionIcon(option)}
//               </div>
//             </div>

//             {/* Date input */}
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="bg-black/50 backdrop-blur-sm text-white border border-cyan-500/30 p-3 rounded-lg cursor-pointer
//                          hover:bg-cyan-500/10 hover:border-cyan-400 focus:bg-cyan-500/10 focus:border-cyan-400 transition-all duration-300"
//             />

//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//             >
//               {loading ? "⏳ Loading..." : "🌟 Explore"}
//             </button>
//           </div>
//         </div>

//         {/* Results */}
//         <div className="mt-8">
//           {data && option === "apod" && (
//             <div className="glass-card p-6 rounded-xl shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
//               <h2 className="text-2xl font-bold text-cyan-400 mb-4">{data.title}</h2>
//               <div className="flex justify-center mb-4">
//                 <img
//                   src={data.url}
//                   alt={data.title}
//                   className="max-w-full h-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
//                 />
//               </div>
//               <p className="text-gray-300 leading-relaxed">{data.explanation}</p>
//             </div>
//           )}

//           {data && option === "mars" && (
//             <div className="glass-card p-6 rounded-xl shadow-lg">
//               <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Mars Rover Gallery</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {data.photos?.length > 0 ? (
//                   data.photos.slice(0, 9).map((photo: any) => (
//                     <div key={photo.id} className="group">
//                       <img
//                         src={photo.img_src}
//                         alt={`Mars Rover - ${photo.id}`}
//                         className="w-full h-48 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
//                       />
//                       <p className="text-xs text-gray-400 mt-2">
//                         Camera: {photo.camera.full_name} | Sol: {photo.sol}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="col-span-full text-center py-12">
//                     <Rocket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//                     <p className="text-gray-400 text-lg">No photos available for this date</p>
//                     <p className="text-gray-500">Try a different date!</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {data && option === "neo" && (
//             <div className="glass-card p-6 rounded-xl shadow-lg">
//               <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
//                 <AlertTriangle className="w-6 h-6" />
//                 Near Earth Objects Data
//               </h2>
//               <div className="bg-black/50 backdrop-blur-sm border border-gray-600 rounded-lg p-4 overflow-x-auto">
//                 <pre className="text-green-400 text-sm leading-relaxed">
//                   {JSON.stringify(data, null, 2)}
//                 </pre>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useEffect } from "react";
import { ArrowLeft, Star, Rocket, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageIntroModal from "../components/PageIntroModal";
import TutorialButton from "../components/TutorialButton";

const API_KEY = "1P7WUiuH31fTCPBiu4RHCoEesGQ4L4hxkYAas7sH";

export default function LiveNasaData() {
  const [option, setOption] = useState("");
  const [date, setDate] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowIntro(true);
  }, []);

  const closeIntro = () => {
    localStorage.setItem("liveNasaDataIntroDismissed", "yes");
    setShowIntro(false);
  };

  const openIntro = () => setShowIntro(true);

  const handleSubmit = async () => {
    if (!option || !date) {
      alert("Please select both an option and a date!");
      return;
    }

    let url = "";
    if (option === "apod") {
      url = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_KEY}`;
    } else if (option === "mars") {
      url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${API_KEY}`;
    } else if (option === "neo") {
      url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${API_KEY}`;
    }

    try {
      setLoading(true);
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getOptionIcon = (opt: string) => {
    switch (opt) {
      case "apod": return <Star className="w-4 h-4 text-yellow-400" />;
      case "mars": return <Rocket className="w-4 h-4 text-red-400" />;
      case "neo": return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 relative">
      {showIntro && (
        <PageIntroModal
          title="Live NASA Data Explorer"
          descriptionLines={[
            "Select a date to view real-time asteroid data from NASA",
          ]}
          onClose={closeIntro}
        />
      )}

      {/* Floating Tutorial Button */}
      {!showIntro && <TutorialButton onClick={openIntro} />}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition z-10"
        disabled={showIntro}
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-cyan-400 text-center mb-10 drop-shadow-lg">
          🚀 Live NASA Data Explorer
        </h1>

        {/* Controls */}
        <div className="bg-gray-800/70 border border-gray-700 p-6 rounded-xl shadow-xl mb-10">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            {/* Dropdown */}
            <div className="relative w-full md:w-auto">
              <select
                value={option}
                onChange={(e) => setOption(e.target.value)}
                className="appearance-none w-full bg-black/50 border border-cyan-500/40 text-white px-4 py-3 rounded-lg cursor-pointer focus:border-cyan-400"
              >
                <option value="">-- Select Option --</option>
                <option value="apod">🌌 Picture of the Day</option>
                <option value="mars">🔴 Mars Rover Photos</option>
                <option value="neo">⚠️ Near Earth Objects</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getOptionIcon(option)}
              </div>
            </div>

            {/* Date Picker */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-3 rounded-lg text-black"
            />

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition disabled:opacity-50"
            >
              {loading ? "⏳ Loading..." : "🌟 Explore"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8">
          {/* APOD */}
          {data && option === "apod" && (
            <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">{data.title}</h2>
              <img
                src={data.url}
                alt={data.title}
                className="rounded-lg shadow-md mx-auto mb-4 max-h-[400px] object-contain"
              />
              <p className="text-gray-300">{data.explanation}</p>
            </div>
          )}

          {/* Mars Rover */}
          {data && option === "mars" && (
            <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-red-400 mb-6 text-center">
                🔴 Mars Rover Photos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.photos?.length > 0 ? (
                  data.photos.slice(0, 9).map((photo: any) => (
                    <div key={photo.id} className="group">
                      <img
                        src={photo.img_src}
                        alt={`Mars Rover - ${photo.id}`}
                        className="w-full h-48 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        Camera: {photo.camera.full_name} | Sol: {photo.sol}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">No photos available for this date</p>
                )}
              </div>
            </div>
          )}

          {/* NEO */}
          {data && option === "neo" && (
            <div className="grid md:grid-cols-2 gap-8">
              {data.near_earth_objects?.[date]?.map((neo: any, i: number) => (
                <div
                  key={i}
                  className="bg-gray-900/80 border border-gray-700 rounded-xl p-6 shadow-lg hover:scale-105 transition"
                >
                  <h2 className="text-2xl font-bold text-yellow-400 mb-3">
                    ☄️ {neo.name}
                  </h2>
                  <p><b>Magnitude (H):</b> {neo.absolute_magnitude_h}</p>
                  <p>
                    <b>Diameter:</b>{" "}
                    {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} –{" "}
                    {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                  </p>
                  <p>
                    <b>Hazardous:</b>{" "}
                    <span className={neo.is_potentially_hazardous_asteroid ? "text-red-400" : "text-green-400"}>
                      {neo.is_potentially_hazardous_asteroid ? "⚠️ Yes" : "✅ No"}
                    </span>
                  </p>
                  <p>
                    <b>Velocity:</b>{" "}
                    {parseFloat(neo.close_approach_data[0]?.relative_velocity?.kilometers_per_hour).toFixed(0)} km/h
                  </p>
                  <p>
                    <b>Miss Distance:</b>{" "}
                    {parseFloat(neo.close_approach_data[0]?.miss_distance?.lunar).toFixed(2)} LD 🌙
                  </p>
                  <a
                    href={neo.nasa_jpl_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block mt-3 text-blue-400 hover:underline"
                  >
                    🔗 View on NASA JPL
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
