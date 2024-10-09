import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// Initialize Firebase (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyB9pvWKq8W26UzFk_wjqRSp_tLh8JnkSgw",
    authDomain: "ecom-project-5b6f8.firebaseapp.com",
    projectId: "ecom-project-5b6f8",
    storageBucket: "ecom-project-5b6f8.appspot.com",
    messagingSenderId: "383140090253",
    appId: "1:383140090253:web:492f88b6db8eabd6976dc4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const UserProfile = () => {
    const [email, setEmail] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFetchProfile = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Query Firestore for the user document with the given email
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError("No user found with this email address.");
            } else {
                // Assume email is unique, so we'll use the first document
                const userDoc = querySnapshot.docs[0];
                setUserDetails(userDoc.data());
            }
        } catch (error) {
            setError("Failed to fetch user details. Please try again.");
            console.error("Error:", error);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>

            {!userDetails ? (
                <form onSubmit={handleFetchProfile} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? 'Fetching...' : 'Fetch Profile'}
                    </button>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                </form>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Profile Details</h3>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Full Name:</strong> {userDetails.firstName} {userDetails.lastName}</p>
                    <p><strong>Phone Number:</strong> {userDetails.phoneNumber}</p>
                    <p><strong>Country:</strong> {userDetails.country}</p>
                    <p><strong>State:</strong> {userDetails.state}</p>
                    <p><strong>Parent Name:</strong> {userDetails.parentName}</p>
                    <p><strong>Parent Phone Number:</strong> {userDetails.parentPhoneNumber}</p>
                    <p><strong>Children:</strong> {userDetails.childrenNames.join(', ')}</p>
                    <p><strong>Membership Type:</strong> {userDetails.membershipType}</p>
                    {userDetails.photoUrl && (
                        <img src={userDetails.photoUrl} alt="Profile" className="w-32 h-32 rounded-full mx-auto" />
                    )}
                    <button
                        onClick={() => { setUserDetails(null); setEmail(''); }}
                        className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 mt-4"
                    >
                        Fetch Another Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;