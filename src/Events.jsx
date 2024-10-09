import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Event = () => {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setMessage('You must be logged in to create an event.');
            return;
        }

        const db = getFirestore();
        try {
            const docRef = await addDoc(collection(db, 'events'), {
                name: eventName,
                date: eventDate,
                description: eventDescription,
                userId: user.uid,
                createdAt: new Date()
            });
            setMessage('Event created successfully!');
            setEventName('');
            setEventDate('');
            setEventDescription('');
        } catch (error) {
            setMessage('Error creating event: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create a New Event
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="event-name" className="sr-only">
                                Event Name
                            </label>
                            <input
                                id="event-name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Event Name"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="event-date" className="sr-only">
                                Event Date
                            </label>
                            <input
                                id="event-date"
                                name="date"
                                type="date"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="event-description" className="sr-only">
                                Event Description
                            </label>
                            <textarea
                                id="event-description"
                                name="description"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Event Description"
                                value={eventDescription}
                                onChange={(e) => setEventDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Event;