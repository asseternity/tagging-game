import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// [v] click on the map coords functionality - regardless of scroll or device
// [v] track the scroll of the map
// [v] place a marker on the image at the click
// [v] spawn a square on the clicked area - THIS WORKS BECAUSE MARKERS ARE ABSOLUTE AND  PARENT IS MAP_CONTAINER WHICH IS RELATIVE
// [v] spawn a larger circle - the current task - and make the circle's size vary based on the task
// [v] make the circles spawn in the middle of the coords, not in the corner
// [v] check if a set coord is INSIDE the small square (this will be served as a random task from the api later)
// [v] improve design for PC: map maybe in the middle of the page and rules in another popup
// [v] animations of the popup broken
// [v] add "wintext' to the task, which stays above the marker if correct
// [v] keep score - 1 per every correct answer
// [v] gameover screen and a try again button
// [_] start on the backend for serving tasks and keeping high scores
