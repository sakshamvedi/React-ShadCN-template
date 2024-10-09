import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const EventDetails = () => {
    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();
    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        const fetchEventAndParticipants = async () => {
            try {
                const eventDoc = await getDoc(doc(db, 'events', id));
                if (eventDoc.exists()) {
                    const eventData = { id: eventDoc.id, ...eventDoc.data() };
                    setEvent(eventData);

                    // Fetch participant details
                    const participantPromises = eventData.participants?.map(async (uid) => {
                        const userDoc = await getDoc(doc(db, 'users', uid));
                        return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
                    }) || [];

                    const participantDetails = await Promise.all(participantPromises);
                    setParticipants(participantDetails.filter(p => p !== null));
                } else {
                    setError('Event not found');
                }
            } catch (err) {
                setError('Error fetching event details: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEventAndParticipants();
    }, [db, id]);

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
    if (!event) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">{event.name}</h2>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
                <p className="text-gray-600 mb-4">Date: {new Date(event.date).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-6">{event.description}</p>

                <h3 className="text-xl font-semibold mb-4">Participants</h3>
                {participants.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {participants.map((participant) => (
                            <li key={participant.id} className="mb-2">
                                {participant.displayName || participant.email}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No participants yet.</p>
                )}
            </div>
        </div>
    );
};

export default EventDetails;