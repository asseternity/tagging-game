import { useState } from 'react';
import ReactDOM from 'react-dom';
import './Popup.css';

const Popup = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const togglePopup = () => {
    setIsVisible(!isVisible);
  };

  const popupContent = (
    <div className={`popup_content ${isVisible ? 'show' : ''}`}>
      {children}
      <button onClick={() => togglePopup()}>X</button>
    </div>
  );

  return (
    <div className="popup_container">
      <button onClick={() => togglePopup()}>Show popup!</button>
      {isVisible &&
        ReactDOM.createPortal(popupContent, document.getElementById('portal'))}
    </div>
  );
};

export default Popup;
