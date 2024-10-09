import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc, arrayUnion, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

const EventsDetailsUser = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [participatingEvents, setParticipatingEvents] = useState([]);
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'participating'
    const [message, setMessage] = useState('');
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsCollection = collection(db, 'events');
            const eventSnapshot = await getDocs(eventsCollection);
            const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllEvents(eventList);

            if (auth.currentUser) {
                const participatingEventsList = eventList.filter(event =>
                    event.participants && event.participants.includes(auth.currentUser.uid)
                );
                setParticipatingEvents(participatingEventsList);
            }
        };

        fetchEvents();
    }, [db, auth.currentUser]);

    const handleParticipate = async (eventId) => {
        if (!auth.currentUser) {
            setMessage('You must be logged in to participate.');
            return;
        }

        try {
            const eventRef = doc(db, 'events', eventId);
            await updateDoc(eventRef, {
                participants: arrayUnion(auth.currentUser.uid)
            });
            setMessage('You have successfully joined the event!');

            // Update both all events and participating events lists
            const updatedAllEvents = allEvents.map(event =>
                event.id === eventId
                    ? { ...event, participants: [...(event.participants || []), auth.currentUser.uid] }
                    : event
            );
            setAllEvents(updatedAllEvents);

            const updatedEvent = updatedAllEvents.find(event => event.id === eventId);
            setParticipatingEvents([...participatingEvents, updatedEvent]);
        } catch (error) {
            setMessage('Error joining event: ' + error.message);
        }
    };

    const renderEventCard = (event) => (
        <div key={event.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                <p className="text-gray-600 mb-4">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-4">{event.description}</p>
                <div className="flex justify-between items-center">
                    {!event.participants?.includes(auth.currentUser?.uid) && (
                        <button
                            onClick={() => handleParticipate(event.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Participate
                        </button>
                    )}
                    <Link
                        to={`/event/${event.id}`}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Events</h2>
            {message && <p className="mb-4 text-green-600">{message}</p>}

            <div className="mb-6">
                <button
                    className={`mr-4 px-4 py-2 rounded ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Events
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'participating' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('participating')}
                >
                    My Events
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'all'
                    ? allEvents.map(renderEventCard)
                    : participatingEvents.map(renderEventCard)
                }
            </div>

            {activeTab === 'participating' && participatingEvents.length === 0 && (
                <p className="text-center text-gray-600">You are not participating in any events yet.</p>
            )}
        </div>
    );
};

export default EventsDetailsUser;