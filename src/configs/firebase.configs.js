import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FB_apiKey,
	authDomain: process.env.REACT_APP_FB_authDomain,
	projectId: process.env.REACT_APP_FB_projectId,
	storageBucket: process.env.REACT_APP_FB_storageBucket,
	messagingSenderId: process.env.REACT_APP_FB_messagingSenderId,
	appId: process.env.REACT_APP_FB_appId,
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };
