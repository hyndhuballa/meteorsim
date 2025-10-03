import React from "react";

interface TutorialButtonProps {
  onClick: () => void;
}

const TutorialButton: React.FC<TutorialButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open tutorial"
      className="fixed right-6 bottom-8 z-[10000] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
    >
      ?
    </button>
  );
};

export default TutorialButton;