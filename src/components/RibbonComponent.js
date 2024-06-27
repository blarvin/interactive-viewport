// src/components/RibbonComponent.js
import React from 'react';
import './RibbonComponent.css';
import ResetToDefault from './ResetToDefault';

const RibbonComponent = () => {
  return (
    <div className="ribbon">
      <ResetToDefault />
      <div className="ribbon-button" style={{ borderColor: '#00FF00' }}>Component 2</div>
      <div className="ribbon-button" style={{ borderColor: '#0000FF' }}>Component 3</div>
      <div className="ribbon-button" style={{ borderColor: '#FFFF00' }}>Component 4</div>
      <div className="ribbon-button" style={{ borderColor: '#FF00FF' }}>Component 5</div>
      <div className="ribbon-button" style={{ borderColor: '#00FFFF' }}>Component 6</div>
      <div className="ribbon-button" style={{ borderColor: '#FFA500' }}>Component 7</div>
      <div className="ribbon-button" style={{ borderColor: '#800080' }}>Component 8</div>
    </div>
  );
};

export default RibbonComponent;
