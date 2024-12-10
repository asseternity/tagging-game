import { useState } from 'react';
import ReactDOM from 'react-dom';
import './Popup.css';

const Popup = ({ title, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const togglePopup = () => {
    setIsVisible(!isVisible);
  };

  const popupContent = (
    <div className={`popup_content ${isVisible ? 'show' : 'hide'}`}>
      <div className="popup_top">
        <button onClick={() => togglePopup()}>X</button>
      </div>
      <div className="popup_main">{children}</div>
    </div>
  );

  return (
    <div className="popup_container">
      <button onClick={() => togglePopup()}>{title}</button>
      {ReactDOM.createPortal(popupContent, document.getElementById('portal'))}
    </div>
  );
};

export default Popup;
