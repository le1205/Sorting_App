import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
// firebase init - add your own config here

//import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAh5lwi4HMwnfjnaw-xwYfu5g3unZFjPXc",
  authDomain: "sorting-parts.firebaseapp.com",
  databaseURL: "https://sorting-parts.firebaseio.com",
  projectId: "sorting-parts",
  storageBucket: "sorting-parts.appspot.com",
  messagingSenderId: "428324764369",
  appId: "1:428324764369:web:41c734e2ae67435d0ae3f0"
};

firebase.initializeApp(firebaseConfig)

// utils
const functions = firebase.functions()
const fs = firebase.firestore
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const cartsCollection = db.collection('carts')
const binsCollection = db.collection('bins')
const ordersCollection = db.collection('orders')
const partsCollection = db.collection('parts')


//functions.useFunctionsEmulator('http://localhost:5001');
// export utils/refs
export 
{
  functions,
  fs,
  db,
  auth,
  cartsCollection,
  binsCollection,
  ordersCollection,
  partsCollection

}