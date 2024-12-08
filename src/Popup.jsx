import { useState } from 'react';
import './Popup.css';

const Popup = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);

  const togglePopup = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="popup_container">
      <button onClick={() => togglePopup()}>Show popup!</button>
      {isVisible && (
        <div className={`popup_content ${isVisible ? 'show' : ''}`}>
          {content}
          <button onClick={() => togglePopup()}></button>
        </div>
      )}
    </div>
  );
};

export default Popup;
