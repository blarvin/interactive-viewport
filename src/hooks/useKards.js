// src/hooks/useKards.js
import { useState, useCallback } from 'react';
import { getKardsForKollection } from '../data/indexedDB';

const useKards = (initialKollectionUUID) => {
  const [kards, setKards] = useState([]);

  const loadKards = useCallback((kollectionUUID) => {
    getKardsForKollection(kollectionUUID)
      .then(loadedKards => {
        console.log('Loaded kards:', loadedKards);
        setKards(loadedKards);
      })
      .catch(error => console.error("Error loading kards:", error));
  }, []);

  return { kards, loadKards };
};

export default useKards;
