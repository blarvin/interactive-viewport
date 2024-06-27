// src/hooks/useKardActions.js
import { useCallback } from 'react';
import { updateKard as updateKardInDB, deleteKard as deleteKardFromDB } from '../data/indexedDB';

const useKardActions = () => {
  const updateKard = useCallback((updatedKard) => {
    updateKardInDB(updatedKard)
      .then(() => {
        console.log("Kard updated:", updatedKard);
        // You might want to implement a way to refresh the kard list in the parent component
      })
      .catch(error => console.error("Error updating kard:", error));
  }, []);

  const deleteKard = useCallback((kardUUID) => {
    deleteKardFromDB(kardUUID)
      .then(() => {
        console.log("Kard deleted:", kardUUID);
        // You might want to implement a way to refresh the kard list in the parent component
      })
      .catch(error => console.error("Error deleting kard:", error));
  }, []);

  return { updateKard, deleteKard };
};

export default useKardActions;
