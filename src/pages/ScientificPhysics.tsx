// src/pages/ScientificPhysics.tsx
import React, { useState } from "react";

interface Formula {
  id: string;
  title: string;
  formula: string;
  explanation: string;
  example: string;
  inputs: { label: string; name: string; placeholder: string }[];
  calculate: (values: Record<string, number>) => number | string;
}

// ✅ Full formula list
const formulas: Formula[] = [
  {
    id: "work",
    title: "Work Done",
    formula: "W = F × d × cosθ",
    explanation:
      "Work is the product of force and displacement in the direction of the force.",
    example: "If F=10N, d=5m, θ=0°, then W = 50 J",
    inputs: [
      { label: "Force (N)", name: "F", placeholder: "e.g. 10" },
      { label: "Distance (m)", name: "d", placeholder: "e.g. 5" },
      { label: "Angle (degrees)", name: "θ", placeholder: "e.g. 0" },
    ],
    calculate: (values) =>
      values.F * values.d * Math.cos((values["θ"] * Math.PI) / 180),
  },
  {
    id: "ke",
    title: "Kinetic Energy",
    formula: "KE = ½ × m × v²",
    explanation: "Kinetic energy is the energy of motion.",
    example: "If m=2kg, v=3m/s → KE = 9 J",
    inputs: [
      { label: "Mass (kg)", name: "m", placeholder: "e.g. 2" },
      { label: "Velocity (m/s)", name: "v", placeholder: "e.g. 3" },
    ],
    calculate: (values) => 0.5 * values.m * values.v * values.v,
  },
  {
    id: "impactEnergy",
    title: "Impact Energy",
    formula: "E = ½ × m × v²",
    explanation:
      "Impact energy tells how powerful a collision is. Similar to kinetic energy.",
    example: "If m=1000kg, v=20m/s → E = 200,000 J",
    inputs: [
      { label: "Mass (kg)", name: "m", placeholder: "e.g. 1000" },
      { label: "Velocity (m/s)", name: "v", placeholder: "e.g. 20" },
    ],
    calculate: (values) => 0.5 * values.m * values.v * values.v,
  },
  {
    id: "craterSize",
    title: "Crater Size",
    formula: "D ≈ k × (E)^(1/3.4)",
    explanation:
      "Crater size is estimated based on impact energy. This is an approximation.",
    example: "If E = 200,000 J → D ≈ 2.5 m",
    inputs: [
      { label: "Impact Energy (J)", name: "E", placeholder: "e.g. 200000" },
    ],
    calculate: (values) => (0.07 * Math.pow(values.E, 1 / 3.4)).toFixed(2),
  },
  {
    id: "velocityEffect",
    title: "Velocity Effect",
    formula: "Relative severity ~ v²",
    explanation:
      "Impact severity scales with the square of velocity. Faster asteroids hit much harder.",
    example: "If velocity doubles, severity increases fourfold.",
    inputs: [{ label: "Velocity (km/s)", name: "v", placeholder: "e.g. 15" }],
    calculate: (values) =>
      `Severity Index: ${(values.v * values.v).toFixed(2)}`,
  },
  {
    id: "massEstimation",
    title: "Mass Estimation",
    formula: "m = ρ × V , V = (4/3)πr³",
    explanation:
      "Mass is estimated using volume (assuming spherical shape) and density.",
    example: "If radius=10m, density=3000 → m ≈ 1.26×10⁷ kg",
    inputs: [
      { label: "Radius (m)", name: "r", placeholder: "e.g. 10" },
      { label: "Density (kg/m³)", name: "ρ", placeholder: "e.g. 3000" },
    ],
    calculate: (values) =>
      (
        (4 / 3) *
        Math.PI *
        Math.pow(values.r, 3) *
        values["ρ"]
      ).toExponential(3),
  },
];

const ScientificPhysics: React.FC = () => {
  const [values, setValues] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, number | string>>({});

  const handleChange = (id: string, name: string, val: string) => {
    setValues({ ...values, [`${id}_${name}`]: parseFloat(val) || 0 });
  };

  const handleCalculate = (formula: Formula) => {
    const inputs: Record<string, number> = {};
    formula.inputs.forEach((inp) => {
      inputs[inp.name] = values[`${formula.id}_${inp.name}`] || 0;
    });
    const result = formula.calculate(inputs);
    setResults({ ...results, [formula.id]: result });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white px-6 py-10">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-cyan-400 drop-shadow-lg">
        ⚡ Scientific Physics Lab
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {formulas.map((f) => (
          <div
            key={f.id}
            className="bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-700 hover:shadow-2xl hover:scale-[1.02] transition-transform"
          >
            <h2 className="text-xl font-bold mb-2 text-blue-400">{f.title}</h2>
            <p className="italic text-sm text-gray-300 mb-2">
              Formula: <span className="text-yellow-300">{f.formula}</span>
            </p>
            <p className="mb-2 text-gray-200">{f.explanation}</p>
            <p className="mb-4 text-gray-400 text-sm">Example: {f.example}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {f.inputs.map((inp) => (
                <div key={inp.name}>
                  <label className="block text-xs text-gray-400 mb-1">
                    {inp.label}
                  </label>
                  <input
                    type="number"
                    placeholder={inp.placeholder}
                    className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                    onChange={(e) =>
                      handleChange(f.id, inp.name, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => handleCalculate(f)}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-md font-semibold transition"
            >
              Calculate
            </button>

            {results[f.id] !== undefined && (
              <p className="mt-3 font-bold text-green-400">
                Result: {results[f.id].toString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScientificPhysics;
