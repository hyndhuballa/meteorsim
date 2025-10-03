import React, { useState } from "react";
import Joyride, { Step } from "react-joyride";

const steps: Step[] = [
  {
    target: '.intro-modal', // Will be used for custom logic, could point to the whole modal
    content: (
      <div>
        <strong>Welcome!</strong><br />
        This page lets you simulate an asteroid impact.<br />
        You can enter asteroid parameters, run simulations, and analyze live results!
      </div>
    ),
    placement: "center",
    disableBeacon: true
  },
  {
    target: '.input-diameter',
    content: "Choose the asteroid’s diameter here.",
  },
  {
    target: '.input-velocity',
    content: "Set the asteroid’s entry velocity here.",
  },
  {
    target: '.btn-launch-sim',
    content: "Click here to simulate the asteroid’s impact.",
  },
  {
    target: '.sim-area-globe',
    content: "Here's where your asteroid’s impact is visualized.",
  },
  {
    target: '.sidebar-options',
    content: "Use these tools for real-time tracking, impact analysis, and more.",
  }
];

const TutorialTour: React.FC<{
  run: boolean;
  onFinish: () => void;
}> = ({ run, onFinish }) => (
  <Joyride
    steps={steps}
    run={run}
    showSkipButton
    continuous
    styles={{
      options: {
        zIndex: 10000,
      }
    }}
    callback={(data) => {
      if (
        data.status === "finished" ||
        data.status === "skipped"
      ) {
        onFinish();
      }
    }}
    locale={{
      last: "Finish",
      skip: "Skip Tutorial"
    }}
  />
);

export default TutorialTour;
