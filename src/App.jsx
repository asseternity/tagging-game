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
          console.log(data);
          const newTask = {
            id: data.id,
            text: data.text,
            winText: data.winText,
            coords: { x: data.coordX, y: data.coordY },
            radius: data.radius,
          };
          setCurrentTask(newTask);
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
    console.log({ x, y });
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
    setIsGameOver(false);
  };

  return (
    currentTask && (
      <div className="main_container">
        {isGameOver && (
          <div className="game_over">
            <h3>Game over</h3>
            <button onClick={() => restart()}>Try again</button>
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
