// Native IndexedDB: jeden zapis transakcyjny stanu, brak zewnętrznych bibliotek i telemetrii.
const DB='moja-koszykowka-v1';
let dbPromise;
function database(){
  if(!('indexedDB' in globalThis))return Promise.reject(new Error('IndexedDB niedostępne'));
  if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB,1);
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('state'))req.result.createObjectStore('state');};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
  return dbPromise;
}
export async function load(){const db=await database();return new Promise((resolve,reject)=>{const t=db.transaction('state','readonly');const req=t.objectStore('state').get('app');req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);});}
export async function save(state){const db=await database();return new Promise((resolve,reject)=>{const t=db.transaction('state','readwrite');t.objectStore('state').put(state,'app');t.oncomplete=()=>resolve(true);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);});}
