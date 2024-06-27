// src/contexts/KollectionContext.js
import React, { createContext, useState, useContext } from 'react';

const KollectionContext = createContext();

export const KollectionProvider = ({ children }) => {
  const [activeKollectionUUID, setActiveKollectionUUID] = useState(null);

  return (
    <KollectionContext.Provider value={{ activeKollectionUUID, setActiveKollectionUUID }}>
      {children}
    </KollectionContext.Provider>
  );
};

export const useKollection = () => useContext(KollectionContext);
