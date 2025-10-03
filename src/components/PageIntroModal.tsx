import React from "react";

interface PageIntroModalProps {
  title: string;
  descriptionLines: string[];
  onClose: () => void;
}

const PageIntroModal: React.FC<PageIntroModalProps> = ({ title, descriptionLines, onClose }) => {
  return (
    <div className="fixed inset-0 z-[10000] bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full text-white relative">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        {descriptionLines.map((line, i) => (
          <p key={i} className="mb-3 leading-relaxed text-lg">
            {line}
          </p>
        ))}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 rounded-full w-9 h-9 flex items-center justify-center font-bold text-xl leading-none focus:outline-none"
          aria-label="Close intro dialog"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default PageIntroModal;