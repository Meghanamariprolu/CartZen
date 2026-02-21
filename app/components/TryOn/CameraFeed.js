'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BsInfoCircle, BsCheckCircle } from 'react-icons/bs';

const CameraFeed = ({ product, type, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        // Simulate engine activation
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative bg-[#0a0a0b]">
            {isLoading ? (
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-white text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Setting up AI Lens...</p>
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    {/* Camera Mock */}
                    <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                        <p className="text-gray-500 text-xs italic font-bold">Live Stream Mock (Requires HTTPS & MediaPipe Integration)</p>
                    </div>

                    {/* HUD Overlay */}
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5 pointer-events-none">
                        <p className="text-white text-[9px] font-black uppercase tracking-widest flex items-center space-x-2">
                            <BsInfoCircle className="text-primary" />
                            <span>Place your {type === 'glasses' ? 'face' : 'body'} in the frame</span>
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-10 flex space-x-4">
                        <button onClick={onClose} className="bg-white/10 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10">Back</button>
                        <button className="bg-primary text-white px-8 py-3 rounded-full font-black uppercase tracking-widest flex items-center space-x-2 shadow-xl hover:bg-primary-hover active:scale-95 transition-all">
                            <BsCheckCircle /> <span>Snapshot</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraFeed;
