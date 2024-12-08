import { useState } from 'react';
import map from '/map.png';

function App() {
  const [someState, setSomeState] = useState();

  // there is a title on top, rules in a small box to the right,
  // and a window in the middle that resizes in accordance with the screen size, but has a maximum
  // arrow buttons on the bottom of the window let you scroll the map in the window
  // if you click on a point of interest on the map, a small square appears around the point of interest
  // a selector popup appears what you think this is
  // if you get it correct, the small square gets a title with the text and score on the bottom updates
  // once you get it wrong, game ends, and if your score is in the all time top 5, a popup shows up where you can write your username
  // a button on the side that brings up a popup with the top 5 all time scores

  return (
    <div className="main_container">
      <div className="top_container">
        <h1>Leordis map quiz</h1>
      </div>
      <div className="map_container">
        <img src={map} />
      </div>
      <div className="rules_container">
        <h3>Rules</h3>
        <p>
          Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
          ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
          lorem ipsum lorem ipsum lorem ipsum lorem ipsum.
        </p>
      </div>
      <div className="bottom_container">
        <div>
          <button>High Scores</button>
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
