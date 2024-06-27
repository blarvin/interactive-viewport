import React from 'react';
import './RibbonComponent.css';

const RibbonComponent = () => {
  const buttons = [
    { id: 1, label: 'Component 1', color: '#FF0000' }, // Red
    { id: 2, label: 'Component 2', color: '#00FF00' }, // Green
    { id: 3, label: 'Component 3', color: '#0000FF' }, // Blue
    { id: 4, label: 'Component 4', color: '#FFFF00' }, // Yellow
    { id: 5, label: 'Component 5', color: '#FF00FF' }, // Magenta
    { id: 6, label: 'Component 6', color: '#00FFFF' }, // Cyan
    { id: 7, label: 'Component 7', color: '#FFA500' }, // Orange
    { id: 8, label: 'Component 8', color: '#800080' }, // Purple
  ];

  return (
    <div className="ribbon">
      {buttons.map((button) => (
        <div
          key={button.id}
          className="ribbon-button"
          style={{ borderColor: button.color }}
        >
          {button.label}
        </div>
      ))}
    </div>
  );
};

export default RibbonComponent;
