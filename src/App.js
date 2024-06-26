import React from "react";
import InteractiveViewport from "./InteractiveViewport";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* <div className="top-section">
        <p>This is the top 14% area</p>
      </div> */}
      <div className="viewport-container">
        <div className="interactive-viewport-wrapper">
          <InteractiveViewport />
        </div>
      </div>
    </div>
  );
}

export default App;
