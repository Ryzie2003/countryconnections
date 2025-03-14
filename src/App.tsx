import React, { useState } from "react";

const initialCountries = [
  // Geographical Group: "Islands and Archipelagos"
  { name: "Australia", group: "Islands and Archipelagos" },
  { name: "New Zealand", group: "Islands and Archipelagos" },
  { name: "Fiji", group: "Islands and Archipelagos" },
  { name: "Maldives", group: "Islands and Archipelagos" },

  // Economic Group: "G7 Countries"
  { name: "United States", group: "G7 Countries" },
  { name: "Germany", group: "G7 Countries" },
  { name: "Japan", group: "G7 Countries" },
  { name: "Canada", group: "G7 Countries" },

  // Semantic Group: "Countries with 'Republic' in the Name"
  { name: "Brazil", group: "Countries with 'Republic' in the Official Name" },
  { name: "Czechia", group: "Countries with 'Republic' in the Official Name" },
  { name: "Slovakia", group: "Countries with 'Republic' in the Official Name" },
  { name: "South Korea", group: "Countries with 'Republic' in the Official Name" },

  // Historical Group: "Colonial Powers"
  { name: "United Kingdom", group: "Colonial Powers" },
  { name: "France", group: "Colonial Powers" },
  { name: "Spain", group: "Colonial Powers" },
  { name: "Portugal", group: "Colonial Powers" },
];

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

let guessesLeft: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
let gameLost: boolean;

const startNewGame = () => {
  guessesLeft = 4;
  gameLost = false;
}

startNewGame();

const App = () => {
  const [countries, setCountries] = useState(shuffleArray([...initialCountries]));
  const [selected, setSelected] = useState([]);
  const [foundGroups, setFoundGroups] = useState([]);

  const handleSelect = (country) => {
    if (selected.includes(country)) {
      setSelected(selected.filter((c) => c !== country));
    } else {
      setSelected([...selected, country]);
    }
  };

  const endGame = () => {
    guessesLeft = 0;
    gameLost = true;
    //reveal correct answers
  }

  const checkSelection = () => {
    if (selected.length === 4) {
      const group = selected[0].group;
      if (selected.every((c) => c.group === group)) {
        setFoundGroups([...foundGroups, group]);
        setCountries(countries.filter((c) => !selected.includes(c)));
      } else if (guessesLeft != 0) {
        guessesLeft -= 1;
      }

      if (guessesLeft == 0) {
        endGame();
      }
      setSelected([]);
    }
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center h-[100vh]">
      <h1 className="text-2xl font-bold mb-4">Country Connections 🌍</h1>
      {!gameLost && <div className="mb-[5vh] grid grid-cols-4 gap-1 h-[40vh]">
        {countries.map((country) => (
          <button
            key={country.name}
            className={`p-2 rounded text-center h-[10vh] w-[11vw] ${
              selected.includes(country) ? "bg-blue-300" : "bg-gray-200"
            }`}
            onClick={() => handleSelect(country)}
          >
            {country.name}
          </button>
        ))}
      </div>}
      <div className="flex flex-col">
        {gameLost && 
          // Get unique groups from initialCountries
          [...new Set(initialCountries.map(country => country.group))].map(groupName => (
            <button
              key={groupName}
              className="p-2 mb-3 rounded text-center h-[10vh] w-[44vw] bg-gray-200 opacity-50"
            >
              <div className="font-bold">{groupName}</div>
              <div className="flex flex-row justify-center items-center space-x-2">
                {initialCountries
                  .filter(country => country.group === groupName)
                  .map(country => (
                    <div key={country.name}>{country.name}</div>
                  ))}
              </div>
            </button>
          ))
        }
      </div>
      {!gameLost && <button className={`mt-3 border rounded-md p-[10px] bg-white text-black ${selected.length !== 4 ? 'opacity-50' : 'opacity-100 cursor-pointer'}`}  onClick={checkSelection} disabled={selected.length !== 4}>
        Submit Selection
      </button>}
      {gameLost && <button className={'mt-3 border rounded-md p-[10px] bg-white text-black'} onClick={startNewGame}>
        Restart Game
      </button>}
      <h3 className="mt-4">Incorrect guesses left: {guessesLeft}</h3>
      <div className="mt-4">
        {foundGroups.length > 0 && <h2 className="text-lg font-bold">Found Groups:</h2>}
        {foundGroups.map((group, index) => (
          <p key={index} className="text-green-600">✔ {group}</p>
        ))}
      </div>
    </div>
  );
};

export default App;
