// src/App.js
import React from 'react';
import RibbonComponent from './components/RibbonComponent';
import WorkspaceComponent from './components/WorkspaceComponent';
import { KollectionProvider } from './contexts/KollectionContext';
import './App.css';

function App() {
  return (
    <KollectionProvider>
      <div className="App">
        <RibbonComponent />
        <div className="workspace">
          <WorkspaceComponent />
        </div>
      </div>
    </KollectionProvider>
  );
}

export default App;
