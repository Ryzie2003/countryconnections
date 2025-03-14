import React, { useState } from "react";

const initialEntities = [
   // Island Nations
   { name: "Japan", group: "Island Nations", difficulty: 1 },
   { name: "Indonesia", group: "Island Nations", difficulty: 1 },
   { name: "New Zealand", group: "Island Nations", difficulty: 1 },
   { name: "Philippines", group: "Island Nations", difficulty: 1 },

  // Moderate Group: "Communist Countries"
  { name: "China", group: "Communist Countries", difficulty: 2 },
  { name: "Cuba", group: "Communist Countries", difficulty: 2 },
  { name: "Vietnam", group: "Communist Countries", difficulty: 2 },
  { name: "Laos", group: "Communist Countries", difficulty: 2 },

  // Challenging Group: "Obscure Mountain Ranges"
  { name: "Vienna", group: "Capital cities of landlocked countries", difficulty: 3 },
  { name: "Minsk", group: "Capital cities of landlocked countries", difficulty: 3 },
  { name: "Prague", group: "Capital cities of landlocked countries", difficulty: 3 },
  { name: "Kathmandu", group: "Capital cities of landlocked countries", difficulty: 3 },

  // Expert Group: "Hidden Wonders of the World"
  { name: "London", group: "U.S. Cities Sharing Global Names", difficulty: 4 },
  { name: "Manchester", group: "U.S. Cities Sharing Global Names", difficulty: 4 },
  { name: "Oslo", group: "U.S. Cities Sharing Global Names", difficulty: 4 },
  { name: "Madrid", group: "U.S. Cities Sharing Global Names", difficulty: 4 },
];


const difficultyToBG = [
  {difficulty: 1, color: "bg-green-300"},
  {difficulty: 2, color: "bg-blue-300"},
  {difficulty: 3, color: "bg-yellow-300"},
  {difficulty: 4, color: "bg-red-300"}
]



const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

let guessesLeft: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
let gameLost: boolean;
let gameWon: boolean;
let guessesTaken;

const startNewGame = () => {
  guessesLeft = 4;
  guessesTaken = 0;
  gameLost = false;
  gameWon = false;
}

startNewGame();

const App = () => {
  const [countries, setCountries] = useState(shuffleArray([...initialEntities]));
  const [selected, setSelected] = useState([]);
  const [foundGroups, setFoundGroups] = useState([]);
  const [shakingTiles, setShakingTiles] = useState<string[]>([]);
  const [groupDetails, setGroupDetails] = useState([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);


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

  const winGame = () => {
    alert('you win!');
    gameWon = true;
  }

  const checkSelection = () => {
    guessesTaken += 1;
    if (selected.length === 4) {
      const group = selected[0].group;
      const difficulty = selected[0].difficulty;

      if (selected.every((c) => c.group === group)) {
        setFoundGroups([...foundGroups, group]);
        setGroupDetails([
          ...groupDetails,
          { groupName: group, difficulty: difficulty, countries: selected },
        ]);
        setCountries(countries.filter((c) => !selected.includes(c)));
      } else {
        setShakingTiles(selected.map((c) => c.name));
        setTimeout(() => setShakingTiles([]), 500);
        if (guessesLeft > 0) {
          guessesLeft -= 1;
        }
      }
      console.log(foundGroups.length);

      if (foundGroups.length == 3) {
        winGame();
      }

      if (guessesLeft == 0) {
        endGame();
      }
      setSelected([]);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const foundDifficulty = difficultyToBG.find((d) => d.difficulty === difficulty);
    return foundDifficulty ? foundDifficulty.color : "bg-gray-200";
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center h-[100vh]">
      <h1 className="text-2xl font-bold mb-4">Country Connections 🌍</h1>
  
      {showHowToPlay && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-md w-80">
            <h2 className="text-xl font-bold mb-4">How to Play</h2>
            <p className="mb-4">
              In this game, your task is to group geographical entities into 4 categories. 
              For example, capitals, rivers, mountains, etc. Click on the tiles to select them, 
              and when you've selected 4 tiles, hit "Submit Selection" to check if they're in the same group.
            </p>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {!gameLost && 
      <div className="mb-[5vh] grid grid-cols-4 gap-1 h-[40vh]">
        {foundGroups.length > 0 && (
            <div className="col-span-4">
              <div className="grid grid-cols-1 gap-1 mb-1">
                {groupDetails.map(({ groupName, countries, difficulty }) => (
                  <div key={groupName} className={`text-center p-2 ${getDifficultyColor(difficulty)}`}>
                    <div className="font-bold">{groupName}</div>
                    <div className="flex flex-row justify-center items-center space-x-2">
                      {countries.map((country) => (
                        <div key={country.name}>{country.name}</div>
                      ))}
                    </div>
                    <div className="text-sm mt-2">Difficulty: {difficulty}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        {countries.map((country) => (
          <button
            key={country.name}
            className={`p-2 rounded text-center h-[10vh] w-[11vw] ${
              selected.includes(country) ? "bg-blue-300" : "bg-gray-200"
            } ${shakingTiles.includes(country.name) ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
            onClick={() => handleSelect(country)}
          >
            {country.name}
          </button>
        ))}
      </div>
      }
      <div className="flex flex-col">
        {gameLost && 
          // Get unique groups from initialCountries
          [...new Set(initialEntities.map(country => country.group))].map(groupName => (
            <button
              key={groupName}
              className={`p-2 mb-3 rounded text-center h-[10vh] w-[44vw] opacity-50`}
            >
              <div className="font-bold">{groupName}</div>
              <div className="flex flex-row justify-center items-center space-x-2">
                {initialEntities
                  .filter(country => country.group === groupName)
                  .map(country => (
                    <div key={country.name}>{country.name}</div>
                  ))}
              </div>
            </button>
          ))
        }
      </div>
      <div className="flex flex-row justify-center items-center">
        <button
          className="mr-5 bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setShowHowToPlay(true)}
        >
          How to Play
        </button>
        {(!gameLost && !gameWon) && <button className={`border rounded-md p-[10px] bg-white text-black ${selected.length !== 4 ? 'opacity-50' : 'opacity-100 cursor-pointer'}`}  onClick={checkSelection} disabled={selected.length !== 4}>
          Submit Selection
        </button>}
        <button
          className="ml-5 bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setCountries(shuffleArray([...initialEntities.filter(
            (country) => !foundGroups.includes(country.group)
          )]))}
        >
          Shuffle
        </button>
      </div>
      {gameLost && <h1 className="mt-4">You Lost!</h1>}
      {gameWon && <h1 className="mt-4">You Won!</h1>}
      <h3 className="mt-4">Incorrect guesses left: {guessesLeft}</h3>
      <h3 className="mt-4">Attempts: {guessesTaken}</h3>
    </div>
  );
};

export default App;
