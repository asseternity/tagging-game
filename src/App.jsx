import { useState, useRef, useEffect } from 'react';
import map from '/map.png';
import Popup from './Popup';

function App() {
  const [currentTask, setCurrentTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [winTexts, setWinTexts] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const mapContainerRef = useRef(null);
  const [isHighScore, setIsHighScore] = useState('playing');
  const [topFive, setTopFive] = useState([]);
  const [playerName, setPlayerName] = useState('');

  // fetch a message as soon as the page loads
  useEffect(() => {
    // function to fetch a random task
    const fetchRandomTask = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/random_task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ completedTasks: completedTasks }),
        });
        if (response.ok) {
          const data = await response.json();
          const newTask = {
            id: data.id,
            text: data.text,
            winText: data.winText,
            coords: { x: data.coordX, y: data.coordY },
            radius: data.radius,
          };
          setCurrentTask(newTask);
        } else if (response.status === 404) {
          const errorData = await response.json(); // Parse the JSON error response
          if (errorData.message === 'No tasks available') {
            setIsGameOver(true);
          }
        }
      } catch (err) {
        console.error('Error during fetch: ', err);
      }
    };

    fetchRandomTask();
  }, [completedTasks]);

  const handleMapClick = (e) => {
    const image = e.target;
    // get the bounding box of the map
    const rect = image.getBoundingClientRect();
    // calculate coords
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleNewMarker({ x, y });
    const correct = checkIfCorrect({ x, y });
    if (correct) {
      setCompletedTasks([...completedTasks, currentTask.id]);
      // should fetch a new task by setting completedTasks as a dependency
    }
  };

  const handleNewMarker = (coords) => {
    if (coords.x !== null && coords.y !== null) {
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        { x: coords.x, y: coords.y },
      ]);
    }
  };

  const checkIfCorrect = (coords) => {
    if (coords.x !== null && coords.y !== null) {
      // get coords and radius of the current task
      const centerX = currentTask.coords.x;
      const centerY = currentTask.coords.y;
      const radius = currentTask.radius;
      const distance = Math.sqrt(
        Math.pow(coords.x - centerX, 2) + Math.pow(coords.y - centerY, 2)
      );

      if (distance <= radius) {
        setWinTexts((prevWinTexts) => [
          ...prevWinTexts,
          { x: coords.x, y: coords.y, winText: currentTask.winText },
        ]);
        setScore(score + 1);
        return true;
      } else {
        setIsGameOver(true);
        return false;
      }
    }
    return false;
  };

  const restart = () => {
    // should fetch a new task by setting completedTasks as a dependency
    setCompletedTasks([]);
    setMarkers([]);
    setWinTexts([]);
    setScore(0);
    setPlayerName('');
    setIsHighScore('playing');
    setIsGameOver(false);
  };

  useEffect(() => {
    const checkIfHighScore = async () => {
      if (isGameOver) {
        // first, check if my score is in the top 5
        try {
          const response = await fetch(
            'http://localhost:3000/api/is_it_high_score',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ playerScore: score }),
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data === true) {
              // then show a congrats window and a form
              setIsHighScore('yes');
              // then post the new high score
              // then show the high scores window with a try again button
            } else {
              await getTopFive();
              setIsHighScore('no');
              // then show the high scores window with a try again button
            }
          }
        } catch (err) {
          console.error('Error during fetch: ', err);
        }
      }
    };

    checkIfHighScore();
  }, [isGameOver]);

  const getTopFive = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/top_five', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTopFive(data);
      }
    } catch (err) {
      console.error('Error during fetch: ', err);
    }
  };

  const postHighScore = async () => {
    if (playerName.trim()) {
      try {
        const response = await fetch(
          'http://localhost:3000/api/new_high_score',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerName, value: score }),
          }
        );
        if (response.ok) {
          // Reset high score state and reload top five
          await getTopFive(); // Fetch updated leaderboard
          setIsHighScore('no');
        }
      } catch (err) {
        console.error('Error during high score post: ', err);
      }
    } else {
      alert('Please enter a name!');
    }
  };

  return (
    currentTask && (
      <div className="main_container">
        {isGameOver && (
          <div className="game_over">
            {isHighScore === 'playing' && (
              <div>
                <h1>Loading...</h1>
              </div>
            )}
            {isHighScore === 'yes' && (
              <div>
                <h3>You're in the top 5!</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    postHighScore();
                  }}
                >
                  <label>
                    Your Name:
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      required
                    />
                  </label>
                  <button type="submit">Submit High Score</button>
                </form>
              </div>
            )}
            {isHighScore === 'no' && (
              <div>
                <h3>Game over</h3>
                <ol>
                  {topFive.map((score) => {
                    return (
                      <div key={score.playerName + score.value}>
                        {score.playerName}
                        {': '}
                        {score.value}
                        {' points'}
                      </div>
                    );
                  })}
                </ol>
                <button onClick={() => restart()}>Try again</button>
              </div>
            )}
          </div>
        )}
        <div className="top_container">
          <h3>Leordis map quiz</h3>
          <h4>
            {currentTask.text} | Score: {score}
          </h4>
        </div>
        <div className="map_container" ref={mapContainerRef}>
          <img src={map} onClick={(e) => handleMapClick(e)} />
          {markers.map((marker, index) => {
            return (
              <div
                key={index}
                className="marker"
                style={{
                  top: `${marker.y}px`,
                  left: `${marker.x}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              ></div>
            );
          })}
          {winTexts.map((marker, index) => {
            return (
              <div
                key={index}
                className="winText"
                style={{
                  top: `${marker.y}px`,
                  left: `${marker.x}px`,
                  transform: 'translate(-50%, -50%',
                }}
              >
                {marker.winText}
              </div>
            );
          })}
          <div
            className="task_marker"
            style={{
              top: `${currentTask.coords.y}px`,
              left: `${currentTask.coords.x}px`,
              position: 'absolute',
              width: `${currentTask.radius}px`,
              height: `${currentTask.radius}px`,
              borderRadius: '50%',
              backgroundColor: 'yellow',
              transform: 'translate(-50%, -50%)',
            }}
          ></div>
        </div>
        <div></div>
        <div className="bottom_container">
          <div>
            <Popup title={'High scores'}>High scores</Popup>
          </div>
          <div className="buttons_container">
            <button>Left</button>
            <button>Up</button>
            <button>Down</button>
            <button>Right</button>
          </div>
          <div className="rules_container">
            <Popup title="Rules">
              <h3>Rules</h3>
              <p>
                Read the task displayed at the top of the page. Scroll and
                explore the map of Leordis. Click on the location where you
                believe the task is pointing to.
              </p>
            </Popup>
          </div>
        </div>
      </div>
    )
  );
}

export default App;
