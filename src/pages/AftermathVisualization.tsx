import React, { useState, useEffect, useRef } from "react";
import { Shield, Rocket, Satellite, AlertTriangle, Target, Loader, X } from "lucide-react";
import PageIntroModal from "../components/PageIntroModal";
import TutorialButton from "../components/TutorialButton";

const methods = [
  {
    id: 1,
    title: "Monitoring & Early Detection",
    icon: <Satellite size={36} className="text-cyan-400" />,
    videoUrl: "/videos/earlydetection.mp4",
    details: `🌌 Overview
Continuous sky surveys (NASA’s NEOWISE, ESA’s Flyeye, LSST/ Rubin Observatory) 
track asteroids long before they threaten Earth.

🔭 How it Works
- Wide-field telescopes scan the sky every night.  
- AI models predict orbital paths.  
- Potentially Hazardous Asteroids (PHAs) are flagged.  

🛰️ Real-world Systems
- NASA’s Planetary Defense Coordination Office (PDCO).  
- ESA’s Space Situational Awareness (SSA) program.  

📈 Benefit
Early detection = decades of preparation for deflection or evacuation.`
  },
  {
    id: 2,
    title: "Kinetic Impactor",
    icon: <Rocket size={36} className="text-red-400" />,
    videoUrl: "/videos/kineticimpactor.mp4",
    details: `🚀 Concept
A spacecraft deliberately collides with an asteroid to alter its orbit.  

🧪 Tested Example
- NASA’s DART (2022) successfully shortened the orbit of Dimorphos.  

📐 Challenges
- Requires precise targeting.  
- Works best decades before impact.  

✨ Advantages
- Relatively low-cost, proven method.`
  },
  {
    id: 3,
    title: "Nuclear Explosive",
    icon: <AlertTriangle size={36} className="text-yellow-400" />,
    videoUrl: "/videos/nuclearexplosive.mp4",
    details: `☢️ Concept
Detonate a nuclear device near or on the asteroid to change its velocity.  

🔥 Mechanism
- Explosion vaporizes part of the surface, creating thrust.  
- Can also fragment the asteroid (risk of multiple impacts).  

⚠️ Concerns
- Political/legal issues with nuclear use in space.  
- Risk of breaking the asteroid into dangerous fragments.  

✅ Best For
- Large asteroids detected late.`
  },
  {
    id: 4,
    title: "Gravity Tractor",
    icon: <Shield size={36} className="text-green-400" />,
    videoUrl: "/videos/gravitytractor.mp4",
    details: `🛡️ Concept
A heavy spacecraft flies alongside an asteroid, slowly pulling it off course 
with mutual gravity.  

📉 Effectiveness
- Works over years/decades.  
- Gentle but reliable method.  

⚙️ Requirements
- Powerful engines for station-keeping.  
- Long-term mission planning.`
  },
  {
    id: 5,
    title: "Laser Ablation",
    icon: <Target size={36} className="text-purple-400" />,
    videoUrl: "/videos/lazerablation.mp4",
    details: `🔦 Concept
High-powered lasers heat the asteroid’s surface until it vaporizes, creating 
a jet of gas that shifts its orbit.  

🛰️ Deployment
- Space-based laser arrays.  
- Could operate continuously for years.  

⚡ Challenges
- Extremely high energy requirement.  
- Needs long-distance precision.`
  },
  {
    id: 6,
    title: "Civil Defense",
    icon: <AlertTriangle size={36} className="text-orange-400" />,
    videoUrl: "/videos/civildefence.mp4",
    details: `🏙️ Concept
If deflection fails, governments must prepare to mitigate damage on Earth.  

🚨 Measures
- Early warning systems.  
- Evacuation planning.  
- Underground shelters.  

📊 Historical Analogy
- Similar to hurricane/earthquake response systems.  

⚠️ Limit
- Saves lives, but not infrastructure.`
  }
];

export default function AftermathVisualization() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const currentMethod = methods.find(m => m.id === activeCard);

  useEffect(() => {
    const video = videoRef.current;
    if (activeCard !== null && video && currentMethod) {
      setIsVideoLoading(true);
      video.src = currentMethod.videoUrl;
      video.load(); // Explicitly load the new source
      video.play().catch(error => {
        console.error("Video autoplay was prevented:", error);
      });
    }

    // Add event listener for closing modal with Escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveCard(null);
      }
    };

    if (activeCard !== null) {
      window.addEventListener("keydown", handleKeyDown);
      modalRef.current?.focus(); // Focus the modal for accessibility
    }

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeCard, currentMethod]);

  useEffect(() => { setShowIntro(true); }, []);
  const closeIntro = () => {
    localStorage.setItem("aftermathVisualizationIntroDismissed", "yes");
    setShowIntro(false);
  };

  const openIntro = () => setShowIntro(true);

  const formatDetails = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (/^[\u2600-\u27BF\ufe0f\u{1F300}-\u{1FAFF}]/u.test(line)) {
        return (
          <p key={i} className="mt-3 text-cyan-400 font-semibold">
            {line}
          </p>
        );
      }
      return (
        <p key={i} className="text-gray-200 text-sm leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <>
      {showIntro && (
        <PageIntroModal
          title="Asteroid Impact Mitigation Strategies"
          descriptionLines={[
            "This section introduces the strategies scientists have developed to protect our planet from potential asteroid impacts. From early detection systems to advanced deflection methods, explore how technology and planning can reduce risks and safeguard humanity.",
          ]}
          onClose={closeIntro}
        />
      )}

      {!showIntro && <TutorialButton onClick={openIntro} />}

      <div className="p-10 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100 min-h-screen">
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-10 text-center">
          ☄️ Asteroid Impact Mitigation Strategies
        </h1>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {methods.map((method) => (
            <div
              key={method.id}
              onClick={() => setActiveCard(method.id)}
              className="p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-lg 
                         cursor-pointer hover:scale-105 transform transition-all duration-300 flex flex-col items-center"
            >
              {method.icon}
              <h2 className="text-lg font-bold mt-3 text-center">{method.title}</h2>
              <p className="text-xs text-gray-400 mt-2">(Click to explore)</p>
            </div>
          ))}
        </div>

        {activeCard !== null && currentMethod && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50" onClick={() => setActiveCard(null)}>
              <div ref={modalRef} tabIndex={-1} onClick={(e) => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl 
                              w-11/12 md:w-3/4 lg:w-2/3 max-h-[80vh] p-6 relative 
                              transform transition-all duration-300 scale-100 overflow-y-auto focus:outline-none">
                <button
                  onClick={() => setActiveCard(null)}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full text-sm z-10"
                >
                  <X size={16} />
                </button>
                <div className="flex flex-col items-center text-center">
                  {currentMethod.icon}
                  <h2 className="text-2xl font-bold mt-3 text-yellow-400">
                    {currentMethod.title}
                  </h2>

                  {/* Video Section */}
                  <div className="mt-5 w-full max-w-2xl">
                    {isVideoLoading && (
                      <div className="w-full aspect-video flex items-center justify-center bg-black rounded-lg">
                        <Loader className="animate-spin text-cyan-400" size={48} />
                      </div>
                    )}
                    <video
                      ref={videoRef}
                      controls
                      muted
                      playsInline
                      autoPlay
                      onCanPlay={() => setIsVideoLoading(false)}
                      onWaiting={() => setIsVideoLoading(true)}
                      onError={(e) => console.error("Video Error:", e)}
                      className={`w-full max-h-[360px] rounded-lg shadow-lg border border-gray-700 ${isVideoLoading ? 'hidden' : 'block'}`}
                    >
                      {/* The source is now set programmatically in the useEffect hook */}
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {/* Details Section */}
                  <div className="mt-5 text-left space-y-2 max-w-2xl">
                    {formatDetails(currentMethod.details)}
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
    </>
  );
}
