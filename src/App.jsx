import { useState, useRef } from 'react';
import map from '/map.png';
import Popup from './Popup';

function App() {
  const sampleTask = {
    text: 'Click on Trowulan',
    winText: 'Trowulan',
    coords: { x: 2052.2000732421875, y: 969.7999877929688 },
    radius: 35,
  };

  const [currentTask, setCurrentTask] = useState(sampleTask);
  const [markers, setMarkers] = useState([]);
  const [winTexts, setWinTexts] = useState([]);
  const [score, setScore] = useState(0);
  const mapContainerRef = useRef(null);

  const handleMapClick = (e) => {
    const image = e.target;
    // get the bounding box of the map
    const rect = image.getBoundingClientRect();
    // calculate coords
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleNewMarker({ x, y });
    console.log(checkIfCorrect({ x, y }));
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
        // [_] LOSE GAME AND RESTART SCREEN
        return false;
      }
    }
    return false;
  };

  return (
    <div className="main_container">
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
              Read the task displayed at the top of the page. Scroll and explore
              the map of Leordis. Click on the location where you believe the
              task is pointing to.
            </p>
          </Popup>
        </div>
      </div>
    </div>
  );
}

export default App;
