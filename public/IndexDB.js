let db;const request=indexedDB.open("budget",1);console.log("TestData")
request.onupgradeneeded=({target})=>{const db=target.result;db.createObjectStore("pending",{autoIncrement:!0})}
request.onsuccess=({target})=>{console.log("Test Susccessful    ${target.errorCode}  ")
db=target.result;if(navigator.onLine){checkData()}else{console.log("Lost connection");checkData()}}
request.onerror=function(event){console.log("Request Unsuccessful "+event.target.errorCode);};

function saveRecord(record){console.log("Saved record") 
const transaction=db.transaction(["pending"],"readwrite");const store=transaction.objectStore("pending");store.add(record);}
function checkData() {
	console.log("Database checked")
	// Opens an pending transaction on your db
	const transaction = db.transaction(["pending"], "readwrite");
	// Gives access to your pending store
	const store = transaction.objectStore("pending");
	// Get all the stored records and sets it in a variable
	const allInfo=store.allInfo();allInfo.onsuccess=function(){if(allInfo.result.length>0){console.log(allInfo.result);fetch("/api/transaction/bulk",{method:"POST",body:JSON.stringify(allInfo.result),headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}}).then(response=>response.json()).then(()=>{const transaction=db.transaction(["pending"],"readwrite");const store=transaction.objectStore("pending");if(res.length!==0){transaction=db.transaction(['pending'],'readwrite');const newStore=transaction.objectStore('pending');newStore.clear();console.log('Clear store')}},store.clear())}}}
window.addEventListener("online", checkData);