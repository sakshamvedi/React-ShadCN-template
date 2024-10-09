import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyB9pvWKq8W26UzFk_wjqRSp_tLh8JnkSgw",
    authDomain: "ecom-project-5b6f8.firebaseapp.com",
    projectId: "ecom-project-5b6f8",
    storageBucket: "ecom-project-5b6f8.appspot.com",
    messagingSenderId: "383140090253",
    appId: "1:383140090253:web:492f88b6db8eabd6976dc4"
};

const app = initializeApp(firebaseConfig);

export default app;