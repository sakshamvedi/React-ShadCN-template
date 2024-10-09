import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { UserCircle, Mail, Phone, MapPin, Users, CreditCard } from 'lucide-react';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchUserData(currentUser.email);
            } else {
                setUser(null);
                setUserData(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchUserData = async (email) => {
        setLoading(true);
        setError('');
        const db = getFirestore();
        try {
            const userCollectionRef = collection(db, email);
            const querySnapshot = await getDocs(userCollectionRef);
            if (querySnapshot.empty) {
                setError('No data found for this user.');
            } else {
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUserData(data[0]); // Assuming we're only using the first document
            }
        } catch (err) {
            setError('Failed to fetch user data. Please try again.');
            console.error('Error fetching user data:', err);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>;
    }

    if (!user) {
        return <div className="text-center mt-8 text-xl">Please log in to view your profile.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {userData && (
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 mb-6 md:mb-0">
                        <div className="text-center">
                            {userData.photoUrl ? (
                                <img src={userData.photoUrl} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4" />
                            ) : (
                                <UserCircle size={128} className="mx-auto mb-4 text-gray-400" />
                            )}
                            <h2 className="text-2xl font-bold">{userData.firstName} {userData.lastName}</h2>
                            <p className="text-gray-500">{userData.membershipType || 'Free'} Member</p>
                        </div>
                    </div>
                    <div className="md:w-2/3 md:pl-8">
                        <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
                        <div className="space-y-3">
                            <p className="flex items-center">
                                <Mail className="mr-2" /> {user.email}
                            </p>
                            <p className="flex items-center">
                                <Phone className="mr-2" /> {userData.phoneNumber}
                            </p>
                            <p className="flex items-center">
                                <MapPin className="mr-2" /> {userData.state}, {userData.country}
                            </p>
                            <div className="flex items-center">
                                <Users className="mr-2" />
                                <span>Children: {userData.childrenNames.map((data) => {
                                    return data + ', '
                                })}</span>
                            </div>
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold mb-2">Parent Information</h4>
                                <p>Name: {userData.parentName}</p>
                                <p>Phone: {userData.parentPhoneNumber}</p>
                            </div>
                            <div className="mt-6 flex items-center">
                                <CreditCard className="mr-2" />
                                <span>Membership: {userData.membershipType}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;