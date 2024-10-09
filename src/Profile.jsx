import React, { useEffect, useState } from 'react';

const Profile = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Fetch the user profile data from localStorage
        const data = localStorage.getItem('userProfile');
        if (data) {
            setUserData(JSON.parse(data));
        }
    }, []);

    if (!userData) {
        return <div>Loading profile...</div>;
    }

    // Check if userData.photo is a valid File object or a URL string
    const profileImageSrc = (userData.photo instanceof File)
        ? URL.createObjectURL(userData.photo)  // Create object URL if it's a File
        : userData.photo || '/default-avatar.png';  // Otherwise, use URL or default avatar

    const logoImageSrc = (userData.logo instanceof File)
        ? URL.createObjectURL(userData.logo)
        : userData.logo || '/default-logo.png';  // Default logo if not provided

    return (
        <div className="bg-gray-100 flex justify-center">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg mt-12 p-8">
                {/* Profile header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">

                        <div>
                            <h1 className="text-2xl font-bold">{userData.firstName} {userData.lastName}</h1>
                            <p className="text-gray-500">untitledui.com/{userData.firstName.toLowerCase()}</p>
                        </div>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
                        View Profile
                    </button>
                </div>

                {/* Editable profile section */}
                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-xl font-bold mb-4">User Profile</h2>
                    <div className="grid grid-cols-2">
                        {/* Company name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Public Profile</label>
                            <input
                                type="text"
                                defaultValue={`${userData.firstName} ${userData.lastName}`}
                                className="border-gray-300 rounded-lg w-full p-2"
                            />
                        </div>
                        {/* URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                            <input
                                type="text"
                                defaultValue="untitledui.com"
                                className="border-gray-300 rounded-lg w-full p-2"
                            />
                        </div>
                    </div>


                    {/* Children’s Information Section */}
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-4">Children's Information</h2>

                        {/* Display each child */}
                        {userData.children && userData.children.map((child, index) => (
                            <div key={index} className="mb-4 border border-gray-300 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Child Name</label>
                                        <input
                                            type="text"
                                            defaultValue={child.name}
                                            className="border-gray-300 rounded-lg w-full p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Child Age</label>
                                        <input
                                            type="text"
                                            defaultValue={child.age}
                                            className="border-gray-300 rounded-lg w-full p-2"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Hobbies</label>
                                    <input
                                        type="text"
                                        defaultValue={child.hobbies}
                                        className="border-gray-300 rounded-lg w-full p-2"
                                    />
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* Save changes */}
                    <div className="flex justify-end mt-8">
                        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-4">Cancel</button>
                        <button className="bg-black text-white px-4 py-2 rounded-lg">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
