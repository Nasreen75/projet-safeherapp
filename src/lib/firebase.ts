import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get, remove, update, onValue } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://safeher-91f74-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, push, set, get, remove, update, onValue };
