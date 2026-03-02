'use client';

import React, { useState, useEffect } from 'react';
import { BsPerson, BsEnvelope, BsPhone, BsGeoAlt, BsPencilSquare, BsCheckCircleFill, BsCamera } from 'react-icons/bs';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ProfilePage = () => {
    const { data: session, update } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        image: null
    });
    const [tempProfile, setTempProfile] = useState({ ...profile });
    const fileInputRef = React.useRef(null);

    const [showSavedToast, setShowSavedToast] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', zip: '', phone: '' });

    useEffect(() => {
        if (session) {
            fetchUserProfile();
        }
    }, [session]);

    const fetchUserProfile = async () => {
        try {
            const res = await axios.get('/api/user/profile');
            setProfile(res.data);
            setTempProfile(res.data);
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await axios.put('/api/user/profile', tempProfile);
            setProfile(tempProfile);
            // Update the next-auth session client-side
            await update({ name: tempProfile.name, image: tempProfile.image });
            setIsEditing(false);
            setShowSavedToast(true);
            setTimeout(() => setShowSavedToast(false), 3000);
        } catch (err) {
            console.error("Failed to save profile:", err);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('/api/user/profile', {
                action: 'addAddress',
                address: { ...newAddress, isDefault: profile.savedAddresses.length === 0 }
            });
            setProfile(res.data.user);
            setNewAddress({ name: '', street: '', city: '', zip: '', phone: '' });
            setShowAddressForm(false);
        } catch (err) {
            console.error("Failed to add address:", err);
        }
    };

    const handleRemoveAddress = async (addressId) => {
        try {
            const res = await axios.put('/api/user/profile', {
                action: 'removeAddress',
                addressId
            });
            setProfile(res.data.user);
        } catch (err) {
            console.error("Failed to remove address:", err);
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            const res = await axios.put('/api/user/profile', {
                action: 'setDefaultAddress',
                addressId
            });
            setProfile(res.data.user);
        } catch (err) {
            console.error("Failed to set default address:", err);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                const newProfile = { ...profile, image: base64String };
                setTempProfile(newProfile);
                setProfile(newProfile); // Show preview immediately

                try {
                    // Auto-save the image to backend
                    await axios.put('/api/user/profile', newProfile);
                    await update({ image: base64String });
                    setShowSavedToast(true);
                    setTimeout(() => setShowSavedToast(false), 3000);
                } catch (err) {
                    console.error("Failed to save image:", err);
                }
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div className="bg-background min-h-screen py-10 px-4">
            <div className="max-w-screen-md mx-auto">
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-8 text-center md:text-left border-b border-gray-200 pb-4">Account Details</h1>

                <div className="bg-white rounded shadow-sm overflow-hidden mb-8">
                    {/* Header/Cover aspect */}
                    <div className="h-32 bg-gradient-to-r from-primary to-purple-600"></div>

                    <div className="px-8 pb-10 relative">
                        {/* Profile Picture Placeholder */}
                        <div className="absolute -top-16 left-8 md:left-12 group">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg relative">
                                {profile.image && !profile.image.includes('pravatar.cc') ? (
                                    <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <BsPerson className="text-6xl text-gray-300" />
                                )}

                                {/* Edit Overlay */}
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <BsCamera className="text-white text-2xl" />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className="mt-20 flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{profile.name || 'Member'}</h2>
                                <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">Platinum Member</p>
                            </div>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className={`mt-4 md:mt-0 flex items-center space-x-2 px-6 py-2 rounded font-bold uppercase tracking-wider text-sm transition-all
                  ${isEditing ? 'bg-primary text-white hover:bg-primary-hover' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                {isEditing ? <><BsCheckCircleFill /> <span>Save Changes</span></> : <><BsPencilSquare /> <span>Edit Profile</span></>}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Info */}
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-gray-50 rounded-full text-gray-400 mt-1"><BsPerson /></div>
                                    <div className="flex-grow">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full border-b border-gray-200 focus:border-primary focus:ring-0 text-sm font-bold p-0 pb-1 outline-none"
                                                value={tempProfile.name}
                                                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-bold text-sm">{profile.name}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-gray-50 rounded-full text-gray-400 mt-1"><BsEnvelope /></div>
                                    <div className="flex-grow">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email ID</label>
                                        <p className="text-gray-900 font-bold text-sm">{profile.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-gray-50 rounded-full text-gray-400 mt-1"><BsPhone /></div>
                                    <div className="flex-grow">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mobile Number</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full border-b border-gray-200 focus:border-primary focus:ring-0 text-sm font-bold p-0 pb-1 outline-none"
                                                value={tempProfile.phone}
                                                onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-bold text-sm">{profile.phone || 'Not provided'}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-gray-50 rounded-full text-gray-400 mt-1"><BsGeoAlt /></div>
                                    <div className="flex-grow">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Default Address</label>
                                        {isEditing ? (
                                            <textarea
                                                className="w-full border-b border-gray-200 focus:border-primary focus:ring-0 text-sm font-bold p-0 pb-1 outline-none min-h-[60px]"
                                                value={tempProfile.address}
                                                onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-bold text-sm leading-relaxed">{profile.address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-4 bg-gray-50 rounded group hover:bg-white hover:myntra-shadow transition-all cursor-pointer">
                                <p className="text-xl font-black text-gray-900 italic">24</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Orders</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded group hover:bg-white hover:myntra-shadow transition-all cursor-pointer">
                                <p className="text-xl font-black text-gray-900 italic">05</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Payments</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded group hover:bg-white hover:myntra-shadow transition-all cursor-pointer">
                                <p className="text-xl font-black text-gray-900 italic">02</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Coupons</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded group hover:bg-white hover:myntra-shadow transition-all cursor-pointer">
                                <p className="text-xl font-black text-gray-900 italic">11</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Whishlist</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Book Section */}
                <div className="bg-white rounded shadow-sm p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Address Book</h3>
                        <button
                            onClick={() => setShowAddressForm(!showAddressForm)}
                            className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
                        >
                            {showAddressForm ? 'Cancel' : '+ Add New Address'}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showAddressForm && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={handleAddAddress}
                                className="mb-8 p-6 bg-gray-50 rounded-sm space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Receiver Name"
                                        required
                                        className="w-full border border-gray-200 p-2 text-sm font-bold outline-none focus:border-primary"
                                        value={newAddress.name}
                                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        required
                                        className="w-full border border-gray-200 p-2 text-sm font-bold outline-none focus:border-primary"
                                        value={newAddress.phone}
                                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Street / Locality"
                                    required
                                    className="w-full border border-gray-200 p-2 text-sm font-bold outline-none focus:border-primary"
                                    value={newAddress.street}
                                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        required
                                        className="w-full border border-gray-200 p-2 text-sm font-bold outline-none focus:border-primary"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Zip Code"
                                        required
                                        className="w-full border border-gray-200 p-2 text-sm font-bold outline-none focus:border-primary"
                                        value={newAddress.zip}
                                        onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="w-full bg-primary text-white py-3 font-black uppercase text-xs tracking-widest rounded-sm">Save Address</button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        {profile.savedAddresses?.map((addr) => (
                            <div key={addr._id} className={`p-4 border rounded flex justify-between items-start ${addr.isDefault ? 'border-primary bg-primary/5' : 'border-gray-100'}`}>
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <p className="font-black text-sm uppercase">{addr.name}</p>
                                        {addr.isDefault && <span className="text-[8px] font-black bg-primary text-white px-2 py-0.5 rounded-full uppercase">Default</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">{addr.street}</p>
                                    <p className="text-xs text-gray-500 font-bold uppercase">{addr.city}, {addr.zip}</p>
                                    <p className="text-[10px] text-gray-400 font-bold mt-2">MOBILE: {addr.phone}</p>
                                </div>
                                <div className="flex flex-col space-y-2 text-right">
                                    {!addr.isDefault && (
                                        <button onClick={() => handleSetDefault(addr._id)} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Set as Default</button>
                                    )}
                                    <button onClick={() => handleRemoveAddress(addr._id)} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Remove</button>
                                </div>
                            </div>
                        ))}

                        {(!profile.savedAddresses || profile.savedAddresses.length === 0) && (
                            <p className="text-center py-10 text-gray-400 font-bold text-sm">No saved addresses yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Persistence Toast */}
            {showSavedToast && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-2xl flex items-center space-x-3 z-50"
                >
                    <BsCheckCircleFill className="text-green-500" />
                    <span>Profile updated successfully!</span>
                </motion.div>
            )}
        </div>
    );
};

export default ProfilePage;
