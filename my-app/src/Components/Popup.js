import './Popup.css'
import React from 'react'
function Popup(props) {
  return (props.trigger) ? (
    <div className="popup">
        <div className="popup-inner">
<button className="close-btn1" onClick={() => { 
  props.setTrigger(false);
  if (props.onClose) props.onClose(); 
}}>Comfirm</button>

        {props.children}
    </div>
    </div>
  ): "";
}

export default Popup

