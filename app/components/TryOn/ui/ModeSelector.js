'use client';

import React from 'react';
import { BsCamera } from 'react-icons/bs';

const ModeSelector = ({ onSelect, productType }) => {
    return (
        <div className="text-center p-10 max-w-sm bg-black/40 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
                <BsCamera className="text-primary text-4xl animate-pulse" />
            </div>
            <h3 className="text-white font-black text-2xl mb-3 tracking-tight">Adaptive Try-On</h3>
            <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium">
                Try this {productType} on in real-time or using a photo.
            </p>

            <div className="space-y-4">
                <button
                    onClick={() => onSelect('camera')}
                    className="w-full bg-primary text-white py-4 font-black uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center space-x-3 shadow-[0_10px_30px_rgba(255,107,0,0.3)] group"
                >
                    <BsCamera /> <span>Live Camera</span>
                </button>

                <button
                    onClick={() => onSelect('upload')}
                    className="w-full bg-white/5 text-white py-4 font-black uppercase tracking-widest rounded-xl hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center space-x-3"
                >
                    <BsCamera className="rotate-180" /> <span>Upload Photo</span>
                </button>
            </div>
        </div>
    );
};

export default ModeSelector;
