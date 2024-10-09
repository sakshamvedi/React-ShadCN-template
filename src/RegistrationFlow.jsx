import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Initialize Firebase (Use environment variables for security)
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
const storage = getStorage(app);

const RegistrationFlow = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        country: 'United States',
        state: 'Delaware',
        phoneNumber: '',
        password: '',
        parentName: '',
        parentPhoneNumber: '',
        childrenNames: [''],
        photo: null,
        membershipType: '',
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleMembershipChange = (membershipType) => {
        setFormData({ ...formData, membershipType });
    };

    const handleChildrenChange = (e, index) => {
        const updatedChildrenNames = formData.childrenNames.map((name, i) =>
            i === index ? e.target.value : name
        );
        setFormData({ ...formData, childrenNames: updatedChildrenNames });
    };

    const addChild = () => {
        setFormData({ ...formData, childrenNames: [...formData.childrenNames, ''] });
    };

    const removeChild = (index) => {
        const updatedChildrenNames = formData.childrenNames.filter((_, i) => i !== index);
        setFormData({ ...formData, childrenNames: updatedChildrenNames });
    };

    const handlePhotoUpload = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    const handleSubmit = async () => {
        try {
            let photoUrl = '';
            if (formData.photo) {
                const storageRef = ref(storage, 'images/' + formData.photo.name);
                await uploadBytes(storageRef, formData.photo);
                photoUrl = await getDownloadURL(storageRef);
            }

            // Remove password and photo from formData before saving to Firestore
            const { password, photo, ...dataToStore } = formData;
            dataToStore.photoUrl = photoUrl;

            // Save the formData to Firestore
            const storedUserProfile = localStorage.getItem('userProfile');
            if (storedUserProfile) {
                const userProfile = JSON.parse(storedUserProfile);

                const docRef = await addDoc(collection(db, userProfile.email), dataToStore);
                console.log('Document written with ID: ', docRef.id);

                localStorage.setItem('userId', docRef.id);
                navigate('/profile');
            }
        } catch (e) {
            console.error('Error during registration: ', e);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Register onNext={nextStep} formData={formData} handleChange={handleChange} />;
            case 2:
                return <ParentsInformation onNext={nextStep} onPrev={prevStep} formData={formData} handleChange={handleChange} />;
            case 3:
                return <ChildrensInformation onNext={nextStep} onPrev={prevStep} formData={formData} handleChildrenChange={handleChildrenChange} addChild={addChild} removeChild={removeChild} />;
            case 4:
                return <PhotoUpload onNext={nextStep} onPrev={prevStep} formData={formData} handlePhotoUpload={handlePhotoUpload} />;
            case 5:
                return <MembershipSelection onNext={handleSubmit} onPrev={prevStep} formData={formData} handleMembershipChange={handleMembershipChange} />;
            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <div className="h-[100%] flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg">
                <div className="flex">
                    <div className="w-1/2 bg-blue-600 p-8 text-white">
                        <h1 className="text-3xl font-bold mb-4">Let's we learn more about you !!</h1>
                        <p className="mb-4">
                            Please fill out the form to get started with our platform.
                        </p>
                    </div>
                    <div className="w-1/2 p-8">
                        <div className="mb-6">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(step / 5) * 100}%` }}></div>
                            </div>
                        </div>
                        {renderStep()}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export componen

const Register = ({ onNext, formData, handleChange }) => (
    <div>
        <h2 className="text-2xl font-semibold mb-6">Let’s get started</h2>
        <form>
            <div className="mb-4">
                <label className="block text-gray-700">First name</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Last name</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Country of residence</label>
                <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option>United States</option>
                    {/* Add more countries if necessary */}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">State</label>
                <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option>Delaware</option>
                    {/* Add more states if necessary */}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Phone number</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                type="button"
                onClick={onNext}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Get Started
            </button>
        </form>
    </div>
);


const ParentsInformation = ({ onNext, onPrev, formData, handleChange }) => (
    <div>
        <h2 className="text-2xl font-semibold mb-6">Parents Information</h2>
        <form>
            <div className="mb-4">
                <label className="block text-gray-700">Parent Name</label>
                <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Parent Phone Number</label>
                <input
                    type="text"
                    name="parentPhoneNumber"
                    value={formData.parentPhoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <button onClick={onPrev} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Previous</button>
            <button onClick={onNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
        </form>
    </div>
);

const ChildrensInformation = ({ onNext, onPrev, formData, handleChildrenChange, addChild, removeChild }) => (
    <div>
        <h2 className="text-2xl font-semibold mb-6">Children's Information</h2>
        <form>
            {formData.childrenNames.map((child, index) => (
                <div key={index} className="mb-4">
                    <label className="block text-gray-700">Child Name {index + 1}</label>
                    <input
                        type="text"
                        value={child}
                        onChange={(e) => handleChildrenChange(e, index)}
                        className="w-full p-2 border rounded"
                    />
                    {formData.childrenNames.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeChild(index)}
                            className="text-red-500 mt-2"
                        >
                            Remove Child
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={addChild}
                className="bg-gray-300 text-black px-4 py-2 rounded mb-4"
            >
                Add Child
            </button>
            <button onClick={onPrev} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Previous</button>
            <button onClick={onNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
        </form>
    </div>
);

const PhotoUpload = ({ onNext, onPrev, formData, handlePhotoUpload }) => (
    <div>
        <h2 className="text-2xl font-semibold mb-6">Photo Release Agreement</h2>
        <form>
            <div className="mb-4">
                <label className="block text-gray-700">Upload Photo</label>
                <input
                    type="file"
                    name="photo"
                    onChange={handlePhotoUpload}
                    className="w-full p-2 border rounded"
                />
                {formData.photo && <p className="mt-2">Selected file: {formData.photo.name}</p>}
            </div>
            <button onClick={onPrev} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Previous</button>
            <button onClick={onNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
        </form>
    </div>
);

const MembershipSelection = ({ onNext, onPrev, formData, handleMembershipChange }) => (
    <div>
        <h2 className="text-2xl font-semibold mb-6">Membership Selection</h2>
        <div className="mb-4">
            <button
                onClick={() => handleMembershipChange('free')}
                className={`w-full p-4 text-left border rounded mb-2 ${formData.membershipType === 'free' ? 'bg-blue-100 border-blue-500' : ''}`}
            >
                <h3 className="font-semibold">Free Membership</h3>
                <p>Access to basic features</p>
            </button>
            <button
                onClick={() => handleMembershipChange('paid')}
                className={`w-full p-4 text-left border rounded ${formData.membershipType === 'paid' ? 'bg-blue-100 border-blue-500' : ''}`}
            >
                <h3 className="font-semibold">Paid Membership</h3>
                <p>Full access to all features</p>
            </button>
        </div>
        <div className="flex justify-between">
            <button onClick={onPrev} className="bg-gray-500 text-white px-4 py-2 rounded">Previous</button>
            <button
                onClick={onNext}
                className={`bg-blue-600 text-white px-4 py-2 rounded ${!formData.membershipType ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!formData.membershipType}
            >
                Complete Registration
            </button>
        </div>
    </div>
);

export default RegistrationFlow;
