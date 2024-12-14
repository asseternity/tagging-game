import { useState, useRef, useEffect } from 'react';
import map from '/map.png';
import Popup from './Popup';

function App2() {
  const [currentTask, setCurrentTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [markers, setMarkers] = useState([]); // confirmed markers
  const [pendingMarker, setPendingMarker] = useState(null); // temporarily store new marker
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
        const response = await fetch(
          'https://tagging-game-api-production.up.railway.app/api/random_task',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completedTasks: completedTasks }),
          }
        );
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
    getTopFive();
  }, [completedTasks]);

  const handleMapClick = (e) => {
    const image = e.target;
    // get the bounding box of the map
    const rect = image.getBoundingClientRect();
    // calculate coords
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPendingMarker({ x, y }); // Store pending marker for confirmation
  };

  const handleConfirm = () => {
    if (pendingMarker) {
      const correct = checkIfCorrect(pendingMarker);
      if (correct) {
        setMarkers((prevMarkers) => [...prevMarkers, pendingMarker]);
        setCompletedTasks([...completedTasks, currentTask.id]);
      }
      setPendingMarker(null); // Reset the pending marker after confirmation
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
        try {
          const response = await fetch(
            'https://tagging-game-api-production.up.railway.app/api/is_it_high_score',
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
              setIsHighScore('yes');
            } else {
              await getTopFive();
              setIsHighScore('no');
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
      const response = await fetch(
        'https://tagging-game-api-production.up.railway.app/top_five',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
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
          'https://tagging-game-api-production.up.railway.app/new_high_score',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerName, value: score }),
          }
        );
        if (response.ok) {
          await getTopFive();
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <h3>Game over</h3>
                <ol>
                  {topFive.map((score, index) => {
                    return (
                      <li key={index}>
                        {score.playerName}
                        {': '}
                        {score.value}
                        {' points'}
                      </li>
                    );
                  })}
                </ol>
                <button onClick={() => restart()}>Try again</button>
              </div>
            )}
          </div>
        )}
        <div className="top_container">
          <h4>
            Leordis quiz | {currentTask.text} | Score: {score}
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
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {marker.winText}
              </div>
            );
          })}
          {pendingMarker && (
            <div
              className="pendingMarker"
              style={{
                top: `${pendingMarker.y}px`,
                left: `${pendingMarker.x}px`,
                transform: 'translate(-50%, -50%)',
              }}
            ></div>
          )}
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
        <div className="bottom_container">
          <div>
            <Popup title={'High scores'}>
              <h3>High scores</h3>
              <ol>
                {topFive.map((score, index) => {
                  return (
                    <li key={index}>
                      {score.playerName}
                      {': '}
                      {score.value}
                      {' points'}
                    </li>
                  );
                })}
              </ol>
            </Popup>
          </div>
          <div className="buttons_container">
            {pendingMarker && <button onClick={handleConfirm}>Confirm</button>}
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

export default App2;
