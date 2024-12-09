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
// [_] spawn a larger circle - the current task
// [_] check if a set coord is INSIDE the small square (this will be served as a random task from the api later)
// [_] animations of the popup broken
