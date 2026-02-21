'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { BsCheckCircle, BsInfoCircle, BsCamera } from 'react-icons/bs';

const ImageUploader = ({ product, type, onClose }) => {
    const [userImage, setUserImage] = useState(null);
    const [overlayPos, setOverlayPos] = useState({ x: 0, y: 0, scale: 0.8, rotate: 0, flipX: 1 });
    const [isBgRemoved, setIsBgRemoved] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setUserImage(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            {!userImage ? (
                <div className="text-center">
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest shadow-xl hover:bg-primary-hover transition-all"
                    >
                        Pick a Photo
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    <p className="text-gray-500 text-[10px] mt-4 uppercase font-bold tracking-widest">Supports JPG, PNG, WEBP</p>
                </div>
            ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                    <img src={userImage} className="max-w-full max-h-[80vh] object-contain rounded-lg" alt="User" />

                    {/* Product Overlay */}
                    <motion.div
                        drag
                        dragMomentum={false}
                        style={{
                            zIndex: 5,
                            rotate: overlayPos.rotate,
                            scale: overlayPos.scale,
                            scaleX: overlayPos.scale * overlayPos.flipX,
                        }}
                        className="absolute cursor-move group"
                    >
                        <img
                            src={product?.image || product?.images?.[0]}
                            className="w-64 h-64 object-contain drop-shadow-2xl"
                            alt="Overlay"
                        />
                    </motion.div>

                    {/* Bottom Console */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-black/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setOverlayPos(p => ({ ...p, scale: p.scale + 0.1 }))} className="text-white bg-white/10 p-2 rounded-full hover:bg-white/20">+</button>
                            <button onClick={() => setOverlayPos(p => ({ ...p, scale: Math.max(0.1, p.scale - 0.1) }))} className="text-white bg-white/10 p-2 rounded-full hover:bg-white/20">-</button>
                        </div>
                        <div className="w-[1px] h-6 bg-white/20"></div>
                        <button onClick={() => setOverlayPos(p => ({ ...p, flipX: p.flipX * -1 }))} className="text-white bg-white/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase">Flip</button>
                        <button onClick={onClose} className="bg-primary text-white p-3 rounded-full"><BsCheckCircle /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
