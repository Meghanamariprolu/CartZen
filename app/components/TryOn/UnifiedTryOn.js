'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsX } from 'react-icons/bs';
import CameraFeed from './CameraFeed';
import ImageUploader from './ImageUploader';
import ModeSelector from './ui/ModeSelector';

const UnifiedTryOn = ({ isOpen, onClose, product }) => {
    const [mode, setMode] = useState(null); // 'camera', 'upload', null
    const [engineStatus, setEngineStatus] = useState('idle'); // 'loading', 'active', 'error'
    const [tryOnType, setTryOnType] = useState(product?.tryOnType || 'clothing');

    useEffect(() => {
        if (!isOpen) {
            setMode(null);
            setEngineStatus('idle');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black flex flex-col font-sans"
            >
                {/* Unified Header */}
                <div className="flex justify-between items-center p-6 bg-gradient-to-b from-black/90 to-transparent absolute top-0 w-full z-10 text-white">
                    <div>
                        <h2 className="font-black uppercase tracking-widest text-sm leading-tight">{product?.title}</h2>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                            {tryOnType} Try-On • {mode || 'Select Mode'}
                        </p>
                    </div>
                    <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/30 transition-colors">
                        <BsX size={28} />
                    </button>
                </div>

                {/* Main Viewport */}
                <div className="flex-1 flex items-center justify-center relative bg-[#0a0a0b] overflow-hidden">
                    {!mode && (
                        <ModeSelector
                            onSelect={setMode}
                            productType={tryOnType}
                        />
                    )}

                    {mode === 'camera' && (
                        <CameraFeed
                            product={product}
                            type={tryOnType}
                            onClose={() => setMode(null)}
                        />
                    )}

                    {mode === 'upload' && (
                        <ImageUploader
                            product={product}
                            type={tryOnType}
                            onClose={() => setMode(null)}
                        />
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UnifiedTryOn;
