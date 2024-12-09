import { useState, useRef } from 'react';
import map from '/map.png';
import Popup from './Popup';

function App() {
  // there is a title on top, rules in a small box to the right,
  // and a window in the middle that resizes in accordance with the screen size, but has a maximum
  // arrow buttons on the bottom of the window let you scroll the map in the window
  // if you click on a point of interest on the map, a small square appears around the point of interest
  // a selector popup appears what you think this is
  // if you get it correct, the small square gets a title with the text and score on the bottom updates
  // once you get it wrong, game ends, and if your score is in the all time top 5, a popup shows up where you can write your username
  // a button on the side that brings up a popup with the top 5 all time scores

  const sampleTask = {
    text: 'Click on Trowulan',
    coords: { x: 2036.4000244140625, y: 949.600036621093 },
  };

  const [scrollPosition, setScrollPosition] = useState({
    scrollX: 0,
    scrollY: 0,
  });

  const [currentTask, setCurrentTask] = useState(sampleTask);

  const [markers, setMarkers] = useState([]);

  const mapContainerRef = useRef(null);

  const handleMapClick = (e) => {
    const image = e.target;
    // get the bounding box of the map
    const rect = image.getBoundingClientRect();
    // calculate coords
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log({ x, y });
    console.log(scrollPosition);
    handleNewMarker({ x, y });
  };

  const handleMapScroll = () => {
    if (mapContainerRef.current) {
      const scrollX = mapContainerRef.current.scrollLeft;
      const scrollY = mapContainerRef.current.scrollTop;
      setScrollPosition({ scrollX, scrollY });
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

  return (
    <div className="main_container">
      <div className="top_container">
        <h3>Leordis map quiz</h3>
        <h4>{currentTask.text}</h4>
      </div>
      <div
        className="map_container"
        ref={mapContainerRef}
        onScroll={() => handleMapScroll()}
      >
        <img src={map} onClick={(e) => handleMapClick(e)} />
        {markers.map((marker, index) => {
          return (
            <div
              key={index}
              className="marker"
              style={{ top: `${marker.y}px`, left: `${marker.x}px` }}
            ></div>
          );
        })}
        <div
          style={{
            top: `${currentTask.coords.y}px`,
            left: `${currentTask.coords.x}px`,
            position: 'absolute',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            backgroundColor: 'yellow',
          }}
        ></div>
      </div>
      <div className="rules_container">
        <h3>Rules</h3>
        <p>
          Read the task displayed at the top of the page. Scroll and explore the
          map of Leordis. Click on the location where you believe the task is
          pointing to.
        </p>
      </div>
      <div className="bottom_container">
        <div>
          <Popup>High scores</Popup>
        </div>
        <div className="buttons_container">
          <button>Left</button>
          <button>Up</button>
          <button>Down</button>
          <button>Right</button>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default App;
