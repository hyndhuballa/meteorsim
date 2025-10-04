import React from "react";

interface LandingIntroModalProps {
  onClose: () => void;
  videoId?: string;
}

const LandingIntroModal: React.FC<LandingIntroModalProps> = ({
  onClose,
  videoId = "your-video-id", // Default video ID
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4 backdrop-blur-md"
      onClick={onClose} // Allow closing by clicking the backdrop
    >
      <div
        className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full text-white shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside it
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="text-3xl font-bold mb-4 text-center">Welcome to Meteor Impact Simulator</h2>
        <p className="mb-4 text-lg text-white/80 text-center">
          Explore asteroid impacts, predict consequences, and test mitigation strategies using real NASA and USGS data. Learn how cosmic events shape Earth and discover ways to protect our planet.
        </p>
        <div className="mb-4 aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Project Demo"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        </div>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition text-xl font-bold w-full"
          aria-label="Close welcome dialog"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LandingIntroModal;