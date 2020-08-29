import * as firebase from 'firebase';
import 'firebase/firestore';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyBTPuTehIrIK5tNnMDLjajvPqQfjidTbK0',
  authDomain: 'simply-hockey-app.firebaseapp.com',
  databaseURL: 'https://simply-hockey-app.firebaseio.com',
  projectId: 'simply-hockey-app',
  storageBucket: 'simply-hockey-app.appspot.com',
  messagingSenderId: '1095122689594',
  appId: '1:1095122689594:web:719aa95e8ee71080f85f03',
});

const db = firebaseApp.firestore();

// eslint-disable-next-line import/prefer-default-export
export { db };
