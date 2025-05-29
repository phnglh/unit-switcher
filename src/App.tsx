import React, { useState } from "react";

const UnitInput = () => {
  const [unit, setUnit] = useState<"%" | "px">("%");
  const [value, setValue] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("0");
  const [lastValidValue, setLastValidValue] = useState<number>(1);

 

  const sanitizeInput = (raw: string): number => {
    let cleaned = raw.replace(",", ".");
    cleaned = cleaned.replace(/[^0-9.-]/g, "");
    cleaned = cleaned
      .replace(/^-+/, "-") 
      .replace(
        /\./g,
        (_match, offset, string) => (string.indexOf(".") === offset ? "." : ""),
      );

    if (!cleaned || cleaned === "-" || isNaN(parseFloat(cleaned))) {
      return lastValidValue;
    }

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? lastValidValue : parsed;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
  };

  const handleBlur = () => {
    let parsed = sanitizeInput(inputValue);
    if (parsed < 0) parsed = 0;
    if (unit === "%" && parsed > 100) {
      parsed = lastValidValue <= 100 ? lastValidValue : 100;
    }

    setValue(parsed);
    setLastValidValue(parsed);
    setInputValue(parsed.toString());
  };

  const handleUnitChange = (u: "%" | "px") => {
    if (u === "%" && value > 100) {
      setValue(100);
      setLastValidValue(100);
      setInputValue("100");
    }
    setUnit(u);
  };

  const increment = () => {
    const newVal = parseFloat((value + 1).toFixed(2));
    if (unit === "%" && newVal > 100) return;
    setValue(newVal);
    setLastValidValue(newVal);
    setInputValue(newVal.toString());
  };

  const decrement = () => {
    const newVal = parseFloat((value - 1).toFixed(2));
    if (newVal < 0) return;
    setValue(newVal);
    setLastValidValue(newVal);
    setInputValue(newVal.toString());
  };

  return (
    <div className="space-y-8 text-sm text-neutral-400">
      <div className="flex items-center justify-between">
        <div className="mb-1">Unit</div>
        <div className="inline-flex rounded-md bg-neutral-800 p-1 border border-neutral-700">
          {["%", "px"].map((u) => (
            <button
              key={u}
              onClick={() => handleUnitChange(u as "%" | "px")}
              className={`px-10 py-2 rounded-md text-sm font-medium transition-colors ${
                unit === u
                  ? "bg-neutral-700 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="mb-1">Value</div>
        <div className="inline-flex relative rounded-md bg-neutral-800 border border-neutral-800 p-1 custom-input-container">
          <button
            onClick={decrement}
            type="button"
            disabled={value <= 0}
            className="px-7 py-2 text-white hover:bg-[#3B3B3B] disabled:opacity-40 rounded-l-md"
          >
            –
          </button>

          <input
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="relative w-16 text-center bg-transparent text-white py-2 focus:outline-none"
          />

          <button
            onClick={increment}
            type="button"
            disabled={unit === "%" && value >= 100}
            className="px-7 py-2 text-white hover:bg-[#3B3B3B] disabled:opacity-40 rounded-r-md"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center text-neutral-100">
      <div className="w-96 bg-neutral-800 p-4 rounded-lg">
        <UnitInput />
      </div>
    </div>
  );
};

export default App;
