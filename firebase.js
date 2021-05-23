import firebase from 'firebase';
const firebaseConfig = {
	apiKey: 'AIzaSyAeszPCawNLv3VD468wTh8Az9Z_5Iqmi7M',
	authDomain: 'fir-ddeda.firebaseapp.com',
	projectId: 'fir-ddeda',
	storageBucket: 'fir-ddeda.appspot.com',
	messagingSenderId: '520987270245',
	appId: '1:520987270245:web:86b9f5fdaf9af95bc27a8c',
};

const app = !firebase.apps.length
	? firebase.initializeApp(firebaseConfig)
	: firebase.app();

const db = app.firestore();

export default db;
