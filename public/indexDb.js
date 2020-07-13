function getRequest() {
  return new Promise((resolve, reject) => {
    const request = self.indexedDB.open("budget");
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      console.log("Error in getting Request");
      reject(new Error("Error in getting Request."));
    };
  });
}

function createStore() {
  return new Promise((resolve, reject) => {
    const request = self.indexedDB.open("budget");

    request.onupgradeneeded = event => {
      const db = event.target.result;
      //Create store
      const store = db.createObjectStore("pending", {
        keyPath: "date",
        autoIncrement: true
      });
      store.createIndex("name", "name");
      store.createIndex("value", "value");
      resolve();
    };

    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      reject(new Error("Error in creating store"));
    };
  });
}

async function addRecord(transaction) {
  try {
    const store = await getStore("readwrite");
    const result = store.add(transaction);
    result.onsuccess = () => {
      Promise.resolve(result);
    };
    result.onerror = () => {
      Promise.reject("Error in add store.");
    };
  } catch (err) {
    console.log(err);
    throw new Error("Error in Adding Record");
  }
}

function getStore(type) {
  return new Promise((resolve, reject) => {
    getRequest().then(db => {
      const transaction = db.transaction(["pending"], type);
      const pendingStore = transaction.objectStore("pending");
      pendingStore.onsuccess = () => {
        resolve(pendingStore);
      };
      pendingStore.onerror = () => {
        reject(new Error("Error in getStore()"));
      };
      resolve(pendingStore);
    });
  });
}

function getIndexDbData() {
  return new Promise((resolve, reject) => {
    getStore("readonly").then(store => {
      const request = store.getAll();
      request.onsuccess = () => {
        resolve(request);
      };
      request.onerror = () => {
        reject("Error");
      };
    });
  });
}

function clearIndexDb() {
  return new Promise((resolve, reject) => {
    getStore("readwrite").then(store => {
      const request = store.clear();
      request.onsuccess = () => {
        resolve(request);
      };
      request.onerror = () => {
        reject("error in clearIndexDb.");
      };
    });
  });
}
