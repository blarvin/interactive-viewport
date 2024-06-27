// indexedDB.js
import { defaultKollection, defaultKards } from './defaultData';

const DB_NAME = 'PinterestCloneDB';
const DB_VERSION = 1;
const KARD_STORE = 'kards';
const KOLLECTION_STORE = 'kollections';

let db;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => reject("IndexedDB error: " + event.target.error);

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      
      if (!db.objectStoreNames.contains(KARD_STORE)) {
        const kardStore = db.createObjectStore(KARD_STORE, { keyPath: 'uuid' });
        kardStore.createIndex('kollectionUUID', 'kollectionUUID', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(KOLLECTION_STORE)) {
        db.createObjectStore(KOLLECTION_STORE, { keyPath: 'uuid' });
      }
    };
  });
};

export const initDBWithDefaultData = async () => {
    await initDB();
  
    const kollectionExists = await getKollection(defaultKollection.uuid);
    if (!kollectionExists) {
      console.log('Default kollection does not exist, creating it...');
      await addKollection(defaultKollection);
    } else {
      console.log('Default kollection already exists');
    }
  
    // Check if kards exist for the default kollection
    const existingKards = await getKardsForKollection(defaultKollection.uuid);
    console.log('Existing kards:', existingKards);
  
    if (existingKards.length === 0) {
      console.log('No kards found for default kollection, adding default kards...');
      for (const kard of defaultKards) {
        await addKard(kard);
      }
    } else {
      console.log('Kards already exist for default kollection');
    }
  
    // Verify kards were added
    const kards = await getKardsForKollection(defaultKollection.uuid);
    console.log('Kards in default kollection after initialization:', kards);
  
    return defaultKollection.uuid;
};
  
export const getKollection = (uuid) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([KOLLECTION_STORE], 'readonly');
      const store = transaction.objectStore(KOLLECTION_STORE);
      const request = store.get(uuid);
  
      request.onerror = (event) => reject("Error getting kollection: " + event.target.error);
      request.onsuccess = (event) => resolve(event.target.result);
    });
};
  
export const addKollection = (kollection) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([KOLLECTION_STORE], 'readwrite');
      const store = transaction.objectStore(KOLLECTION_STORE);
      const request = store.add(kollection);
  
      request.onerror = (event) => reject("Error adding kollection: " + event.target.error);
      request.onsuccess = (event) => resolve(kollection);
    });
};

export const addKard = (kard) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([KARD_STORE], 'readwrite');
      const store = transaction.objectStore(KARD_STORE);
      const request = store.add(kard);
  
      request.onerror = (event) => {
        console.error("Error adding kard:", event.target.error);
        reject("Error adding kard: " + event.target.error);
      };
      request.onsuccess = (event) => {
        console.log('Kard added successfully:', kard);
        resolve(event.target.result);
      };
    });
};

export const getKard = (uuid) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([KARD_STORE], 'readonly');
    const store = transaction.objectStore(KARD_STORE);
    const request = store.get(uuid);

    request.onerror = (event) => reject("Error getting kard: " + event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);
  });
};

export const updateKard = (kard) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([KARD_STORE], 'readwrite');
    const store = transaction.objectStore(KARD_STORE);
    const request = store.put(kard);

    request.onerror = (event) => reject("Error updating kard: " + event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);
  });
};

export const deleteKard = (uuid) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([KARD_STORE], 'readwrite');
    const store = transaction.objectStore(KARD_STORE);
    const request = store.delete(uuid);

    request.onerror = (event) => reject("Error deleting kard: " + event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);
  });
};

export const getKardsForKollection = (kollectionUUID) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([KARD_STORE], 'readonly');
      const store = transaction.objectStore(KARD_STORE);
      const index = store.index('kollectionUUID');
      const request = index.getAll(kollectionUUID);
  
      request.onerror = (event) => {
        console.error("Error getting kards for kollection:", event.target.error);
        reject("Error getting kards for kollection: " + event.target.error);
      };
      request.onsuccess = (event) => {
        console.log('Kards retrieved for kollection:', event.target.result);
        resolve(event.target.result);
      };
    });
};

// Similar functions for kollections (addKollection, getKollection, updateKollection, deleteKollection)
// ...


export const updateKollection = (kollection) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([KOLLECTION_STORE], 'readwrite');
      const store = transaction.objectStore(KOLLECTION_STORE);
      const request = store.put(kollection);

      request.onerror = (event) => reject("Error updating kollection: " + event.target.error);
      request.onsuccess = (event) => resolve(event.target.result);
    });
};

export const deleteKollection = (uuid) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([KOLLECTION_STORE], 'readwrite');
      const store = transaction.objectStore(KOLLECTION_STORE);
      const request = store.delete(uuid);

      request.onerror = (event) => reject("Error deleting kollection: " + event.target.error);
      request.onsuccess = (event) => resolve(event.target.result);
    });
};
