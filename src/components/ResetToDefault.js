// src/components/ResetToDefault.js
import React from 'react';
import { initDBWithDefaultData } from '../data/indexedDB';
import { defaultKollection } from '../data/defaultData';
import { useKollection } from '../contexts/KollectionContext';

const ResetToDefault = () => {
  const { setActiveKollectionUUID } = useKollection();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default? This will delete all existing kards.')) {
      initDBWithDefaultData()
        .then(() => {
          setActiveKollectionUUID(defaultKollection.uuid);
        })
        .catch(error => console.error("Failed to reset to default:", error));
    }
  };

  return (
    <button onClick={handleReset} className="reset-button ribbon-button" style={{ borderColor: '#FF0000' }}>
      Reset to Default
    </button>
  );
};

export default ResetToDefault;
