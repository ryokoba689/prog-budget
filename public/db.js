let db;
const request = indexedDB.open("budget", 1);

console.log("TestData")

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
  console.log("Test Susccessful")

  db = event.target.result;

  // checks if the application is online
  if (navigator.onLine) {
    checkData();
  }else {

      // If offline console logs
    console.log("Lost connection");
    checkData();
}
};

request.onerror = function (event) {

  console.log("Request Unsuccessful " + event.target.errorCode);
};

function saveRecord(record) {

  console.log("Saved record")
// creates a transaction variable on the db thats pending for read and write
  const transaction = db.transaction(["pending"], "readwrite");

  // Gives access to the store
  const store = transaction.objectStore("pending");
// adds record fo your storing of object
  store.add(record);
}

function checkData() {
  console.log("Database checked")
  // Opens an pending transaction on your db
  const transaction = db.transaction(["pending"], "readwrite");

  // Gives access to your pending store

  const store = transaction.objectStore("pending");

  // Get all the stored records and sets it in a variable
  const allInfo = store.allInfo();

  allInfo.onsuccess = function () {

    if (allInfo.result.length > 0) {
      console.log(allInfo.result);
      
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(allInfo.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }


      })
        .then(response => response.json())
        .then(() => {
       
// When successful, opens an transaction on your db
          const transaction = db.transaction(["pending"], "readwrite");


        // Help access your pending object stored
          const store = transaction.objectStore("pending");

    // Cleasrs everything in your store
          store.clear();
        });
    }
  };
}
    // function to deletee pending transactions
function deletePending() {
    // Deletes itens 
  const transaction = db.transaction(["pending"], "readwrite");

  const store = transaction.objectStore("pending");

  store.clear();
}


window.addEventListener("online", checkData);
