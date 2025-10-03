import React from "react";

const LandingIntroModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full text-white">
        <h2 className="text-2xl font-bold mb-4">Welcome to Meteor Impact Simulator</h2>
        {/* <p className="mb-2">Explore asteroid impacts with scientific accuracy.</p> */}
        <p className="mb-4">An interactive platform to explore asteroid impacts, predict their consequences, and test mitigation strategies using real NASA and USGS data. 
            Learn how cosmic events shape Earth and discover ways to protect our planet.</p>
        <div className="mb-4 aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.youtube.com/embed/your-video-id" // replace with your actual video URL
            title="Project Demo"
            allowFullScreen
            className="w-full h-full rounded"
          />
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LandingIntroModal;