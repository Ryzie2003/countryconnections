import { useEffect, useState } from "react";


interface Entity {
  name: string;
  group: string;
  difficulty: number;
}

const initialEntities: Entity[] = [
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

  // Challenging Group: "Hidden Wonders of the World"
  { name: "San Francisco", group: "Coastal cities", difficulty: 3 },
  { name: "Cape Town", group: "Coastal cities", difficulty: 3 },
  { name: "Mumbai", group: "Coastal cities", difficulty: 3 },
  { name: "Sydney", group: "Coastal cities", difficulty: 3 },

  // Expert Group: "Obscure Mountain Ranges"
  { name: "Vienna", group: "Capital cities of landlocked countries", difficulty: 4 },
  { name: "Minsk", group: "Capital cities of landlocked countries", difficulty: 4 },
  { name: "Prague", group: "Capital cities of landlocked countries", difficulty: 4 },
  { name: "Kathmandu", group: "Capital cities of landlocked countries", difficulty: 4 },

];


const difficultyToBG = [
  {difficulty: 1, color: "bg-green-300"},
  {difficulty: 2, color: "bg-blue-300"},
  {difficulty: 3, color: "bg-yellow-300"},
  {difficulty: 4, color: "bg-red-300"}
]



const shuffleArray = (array: Entity[]) => {
  return array.sort(() => Math.random() - 0.5);
};


const App = () => {
  // State Variables with Types
  const [countries, setCountries] = useState<Entity[]>(shuffleArray([...initialEntities]));
  const [selected, setSelected] = useState<Entity[]>([]);
  const [foundGroups, setFoundGroups] = useState<string[]>([]);
  const [shakingTiles, setShakingTiles] = useState<string[]>([]);
  const [groupDetails, setGroupDetails] = useState<
    { groupName: string; difficulty: number; countries: Entity[] }[]
  >([]);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [previousGuesses, setPreviousGuesses] = useState<string[][]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [guessesLeft, setGuessesLeft] = useState<number>(5);
  const [gameState, setGameState] = useState<string>("Playing");


  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 2000); // Alert disappears after 3 seconds
  
      return () => clearTimeout(timer); // Cleanup function
    }
  }, [alertMessage]); // Runs every time alertMessage changes
  
  useEffect(() => {
    setPreviousGuesses([]); // Resets previous guesses on page refresh
  }, []);

  const handleSelect = (country: Entity) => {
    if (selected.includes(country)) {
      setSelected(selected.filter((c) => c !== country));
    } else if (selected.length < 4) {
      setSelected([...selected, country]);
    }
  };

  const endGame = () => {
    setGameState("Lost");
    //reveal correct answers

     // Convert `initialEntities` into the correct format for `groupDetails`
    const allGroups = initialEntities.reduce((acc, entity) => {
      const existingGroup = acc.find((g) => g.groupName === entity.group);
      if (existingGroup) {
        existingGroup.countries.push(entity);
      } else {
        acc.push({
          groupName: entity.group,
          difficulty: entity.difficulty,
          countries: [entity],
        });
      }
      return acc;
    }, [] as { groupName: string; difficulty: number; countries: Entity[] }[]);

    // Update `groupDetails` with ALL groups from `initialEntities`
    setGroupDetails(allGroups);
  }

  const winGame = () => {
    alert('you win!');
    setGameState("Won");
  }


  const checkSelection = () => {
    // Sort selected group to ensure duplicate sets match correctly
    const sortedSelection = [...selected.map((c) => c.name)].sort();

    // Check if this exact group of names has been tried before
    if (previousGuesses.some((prev) => JSON.stringify(prev) === JSON.stringify(sortedSelection))) {
      setAlertMessage("Already guessed");
      return; // Do nothing if this group has already been guessed
    }

    // Save this new incorrect attempt if it's not correct
    setPreviousGuesses([...previousGuesses, sortedSelection]);

    if (selected.length === 4) {
      const groupCounts: Record<string, number> = {};

      // Count occurrences of each group
      selected.forEach((c) => {
        groupCounts[c.group] = (groupCounts[c.group] || 0) + 1;
      });

      // Find the group with the highest count
      const maxGroup = Object.entries(groupCounts).find(([_, count]) => count === 3);

      if (maxGroup) {
        // If there is a group with exactly 3 matches, the user is 1 tile away
        setAlertMessage("One away")
      } else {
        setAlertMessage(null)
      }

      const group = selected[0].group;
      const difficulty = selected[0].difficulty;

      if (selected.every((c) => c.group === group)) {
        setFoundGroups([...foundGroups, group]);
        setGroupDetails([
          ...groupDetails,
          { groupName: group, difficulty: difficulty, countries: selected },
        ]);
        setCountries(countries.filter((c) => !selected.includes(c)));
        setSelected([]);
      } else {
        setShakingTiles(selected.map((c) => c.name));
        setTimeout(() => setShakingTiles([]), 750);

        if (guessesLeft > 0) {
          setGuessesLeft(prev => {
              if (prev - 1 <= 0) {
                endGame();
                return 0;
              }
              return prev - 1;
            }
          );
        }
      }

      if (foundGroups.length == 4) {
        winGame();
      }
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    const foundDifficulty = difficultyToBG.find((d) => d.difficulty === difficulty);
    return foundDifficulty ? foundDifficulty.color : "bg-gray-200";
  };

  return (
    <div className="flex flex-col gap-y-4 justify-center items-center h-[100vh]">
      <div className="flex flex-col gap-y-4 items-center justify-center">
        <h1 className="text-6xl font-bold mb-4">GeoLink 🌍</h1>
        <button
            className="mb-6 bg-blue-500 opacity-60 text-white font-bold px-2 py-2 rounded w-[150px] hover:opacity-100"
            onClick={() => setShowHowToPlay(true)}
          >
            How to Play
        </button>
      </div>
      {showHowToPlay && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-10">
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
      {alertMessage && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-lg z-50 animate-fade">
          {alertMessage}
        </div>
      )}
      {gameState == "Playing" && 
      <div className="grid grid-cols-4 gap-1.5">
        {foundGroups.length > 0 && (
            <div className="col-span-4">
              <div className="grid grid-cols-1 gap-1">
                {groupDetails.map(({ groupName, countries, difficulty }) => (
                  <div key={groupName} className={`h-[5rem] text-center p-2 ${getDifficultyColor(difficulty)} flex flex-col items-center justify-center h-[14vh]`}>
                    <div className="font-bold">{groupName}</div>
                    <div className="flex flex-row justify-center items-center space-x-2">
                      {countries.map((country) => (
                        <div key={country.name}>{country.name}</div>
                      ))}
                    </div>
                  </div>
                ))}
               
              </div>
            </div>
          )}
        {countries.map((country) => (
          <button
            key={country.name}
            className={`p-2 rounded text-center h-[6rem] w-[9rem] ${
              selected.includes(country) ? "bg-gray-600 text-white font-semibold" : "bg-gray-200"
            } ${shakingTiles.includes(country.name) ? "shake bg-red-600 text-white font-semibold opacity-100" : ""}`}
            onClick={
              () => handleSelect(country)
            }
          >
            {country.name}
          </button>
        ))}
      </div>
      }
      <div className="relative flex flex-col justify-center items-center w-[37.125rem]">
        {gameState == "Lost" && (
              <div className="flex flex-col gap-y-1.5">
                {groupDetails.map(({ groupName, countries, difficulty }) => (
                  <div key={groupName} className={`w-[37.125rem] h-[5rem] gap-y-2 text-center p-2 ${getDifficultyColor(difficulty)} flex flex-col items-center justify-center h-[14vh]`}>
                    <div className="font-bold">{groupName}</div>
                    <div className="flex flex-row justify-center items-center space-x-2">
                      {countries.map((country) => (
                        <div key={country.name}>{country.name}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
          )}
          {gameState == "Lost" && (
            <div className="absolute h-full w-full bg-black bg-opacity-40 flex items-center justify-center text-white text-center text-2xl font-bold cursor-pointer opacity-0 hover:opacity-40 transition-opacity"
              // onClick={() => setShowResults(true)}
            >
              View Results
            </div>
          )}
        </div> 

      <div className="flex flex-col justify-center gap-y-4 items-center">
        {/* <h3 className="mt-4 text-xl">Incorrect guesses left: {guessesLeft}</h3> */}
      <p className="text-center font-bold text-lg">Guesses Left: {guessesLeft}</p>
        <div className="flex flex-row justify-center items-center gap-x-3">
        {gameState == "Playing" && <button
            className="border bg-green-500 opacity-100 text-white px-4 py-2 rounded"
            onClick={() => setCountries(shuffleArray([...initialEntities.filter(
              (country) => !foundGroups.includes(country.group)
            )]))}
          >
            Shuffle
          </button>}
            {(gameState == "Playing") && <button className={`border rounded-md px-4 py-2 ${selected.length !== 4 ? 'opacity-50 bg-white text-black' : 'opacity-100 bg-green-500 text-white cursor-pointer'}`}  onClick={checkSelection} disabled={selected.length !== 4}>
            Submit
          </button>}
        </div>
      </div>
    </div>
  );
};


export default App;
