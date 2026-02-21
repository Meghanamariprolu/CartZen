'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsCamera, BsX, BsInfoCircle, BsCheckCircle } from 'react-icons/bs';

const ARTryOn = ({ isOpen, onClose, product }) => {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isLoadingModel, setIsLoadingModel] = useState(false);
    const [userImage, setUserImage] = useState(null);
    const [overlayPos, setOverlayPos] = useState({ x: 0, y: 0, scale: 0.8, rotate: 0, flipX: 1 });
    const [blendMode, setBlendMode] = useState('normal');
    const [isBgRemoved, setIsBgRemoved] = useState(false);
    const [processedProductImg, setProcessedProductImg] = useState(null);
    const fileInputRef = React.useRef(null);

    // Background Removal Logic (Magic Wand simulation)
    useEffect(() => {
        if (isBgRemoved && product?.image) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = product.image;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Sample corners for background color (often white or light gray)
                const targetR = data[0];
                const targetG = data[1];
                const targetB = data[2];
                const tolerance = 40;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    if (Math.abs(r - targetR) < tolerance &&
                        Math.abs(g - targetG) < tolerance &&
                        Math.abs(b - targetB) < tolerance) {
                        data[i + 3] = 0;
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                setProcessedProductImg(canvas.toDataURL());
            };
        } else {
            setProcessedProductImg(product?.image || product?.images?.[0]);
        }
    }, [isBgRemoved, product]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUserImage(event.target.result);
                setIsCameraActive(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const startAR = () => {
        setIsLoadingModel(true);
        setTimeout(() => {
            setIsLoadingModel(false);
            setIsCameraActive(true);
            setUserImage(null);
        }, 2000);
    };

    const resetTryOn = () => {
        setUserImage(null);
        setIsCameraActive(false);
        setOverlayPos({ x: 0, y: 0, scale: 0.8, rotate: 0, flipX: 1 });
        setIsBgRemoved(false);
        setBlendMode('normal');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black flex flex-col font-sans"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 bg-gradient-to-b from-black/90 to-transparent absolute top-0 w-full z-10">
                    <div className="text-white">
                        <h2 className="font-black uppercase tracking-widest text-sm leading-tight">{product?.title || 'Virtual Try-On'}</h2>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                            {userImage ? 'Dynamic Fit Mode' : isCameraActive ? 'Real-time Mode' : 'Awaiting Selection'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        {(userImage || isCameraActive) && (
                            <button onClick={resetTryOn} className="text-white text-[10px] font-black uppercase tracking-widest border border-white/20 px-4 py-2 rounded shadow-lg hover:bg-white/10 transition-all">
                                Change Mode
                            </button>
                        )}
                        <button onClick={onClose} className="text-white bg-white/10 p-2 rounded-full hover:bg-white/30 transition-colors shadow-xl">
                            <BsX size={28} />
                        </button>
                    </div>
                </div>

                {/* Main Viewport */}
                <div className="flex-1 flex items-center justify-center relative bg-[#0a0a0b] overflow-hidden">
                    {/* Welcome / Mode Selection */}
                    {!isCameraActive && !isLoadingModel && !userImage && (
                        <div className="text-center p-10 max-w-sm bg-black/40 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
                                <BsCamera className="text-primary text-4xl animate-pulse" />
                            </div>
                            <h3 className="text-white font-black text-2xl mb-3 tracking-tight">Virtual Fitting Room</h3>
                            <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium">Experience the perfect fit. Mirror your style with a live feed or upload a photo.</p>

                            <div className="space-y-4">
                                <button onClick={startAR} className="w-full bg-primary text-white py-4 font-black uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center space-x-3 shadow-[0_10px_30px_rgba(255,107,0,0.3)] group">
                                    <BsCamera className="group-hover:scale-110 transition-transform" /> <span>Start Live AR</span>
                                </button>

                                <button onClick={() => fileInputRef.current.click()} className="w-full bg-white/5 text-white py-4 font-black uppercase tracking-widest rounded-xl hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center space-x-3 group">
                                    <BsCamera className="rotate-180 group-hover:scale-110 transition-transform" /> <span>Upload Your Photo</span>
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                            </div>
                        </div>
                    )}

                    {isLoadingModel && (
                        <div className="text-center bg-black/50 p-12 rounded-full backdrop-blur-xl border border-white/10">
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                            <p className="text-white text-xs font-black uppercase tracking-[0.3em] animate-pulse">Initializing AI Engine...</p>
                        </div>
                    )}

                    {/* Image-Based Try-On Rendering */}
                    {userImage && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <img src={userImage} alt="User Profile" className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] select-none" />
                            </div>

                            {/* Product Overlay */}
                            <motion.div
                                drag
                                dragMomentum={false}
                                style={{
                                    zIndex: 5,
                                    rotate: overlayPos.rotate,
                                    scale: overlayPos.scale,
                                    scaleX: overlayPos.scale * overlayPos.flipX,
                                    mixBlendMode: blendMode
                                }}
                                className="absolute cursor-move active:cursor-grabbing group"
                            >
                                <img
                                    src={processedProductImg || product?.image}
                                    alt="Product Overlay"
                                    className={`w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] transition-all pointer-events-none ${isBgRemoved ? 'contrast-125 brightness-105' : ''}`}
                                />
                                <div className="absolute inset-0 border-2 border-primary/40 opacity-0 group-hover:opacity-100 rounded-lg pointer-events-none transition-opacity ring-8 ring-primary/5"></div>

                                {/* Helper text for dragging */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] font-black uppercase px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                                    Drag to Position
                                </div>
                            </motion.div>

                            {/* Pro-Adjustment Floating Console */}
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-5 bg-[#121214]/90 backdrop-blur-2xl px-10 py-5 rounded-[2.5rem] border border-white/10 shadow-[-20px_-20px_60px_rgba(255,255,255,0.01),20px_20px_60px_rgba(0,0,0,0.8)] z-20">
                                {/* Auto-Fit Features */}
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setIsBgRemoved(!isBgRemoved)}
                                        className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center space-x-2
                                            ${isBgRemoved ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${isBgRemoved ? 'bg-white animate-pulse' : 'bg-gray-600'}`}></div>
                                        <span>{isBgRemoved ? 'Background Removed' : 'Remove BG Box'}</span>
                                    </button>

                                    <button
                                        onClick={() => setBlendMode(blendMode === 'normal' ? 'multiply' : 'normal')}
                                        className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center space-x-2
                                            ${blendMode === 'multiply' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
                                    >
                                        <span>Texture Blend</span>
                                    </button>
                                </div>

                                <div className="w-[1px] h-10 bg-white/10"></div>

                                {/* Transform: Scale & Rotate */}
                                <div className="flex items-center space-x-8">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 opacity-60">Scale</span>
                                        <div className="flex items-center bg-black/50 rounded-full border border-white/5 shadow-inner">
                                            <button onClick={() => setOverlayPos(p => ({ ...p, scale: Math.max(0.1, p.scale - 0.1) }))} className="text-white hover:text-primary px-3 py-1.5 transition-colors font-black text-lg">—</button>
                                            <span className="text-primary font-black text-[11px] min-w-[3rem] text-center">{Math.round(overlayPos.scale * 100)}%</span>
                                            <button onClick={() => setOverlayPos(p => ({ ...p, scale: p.scale + 0.1 }))} className="text-white hover:text-primary px-3 py-1.5 transition-colors font-black text-lg">+</button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 opacity-60">Angle</span>
                                        <div className="flex items-center bg-black/50 rounded-full border border-white/5 shadow-inner">
                                            <button onClick={() => setOverlayPos(p => ({ ...p, rotate: p.rotate - 5 }))} className="text-white hover:text-primary px-3 py-1.5 transition-colors text-xl">↺</button>
                                            <span className="text-primary font-black text-[11px] min-w-[3rem] text-center">{overlayPos.rotate}°</span>
                                            <button onClick={() => setOverlayPos(p => ({ ...p, rotate: p.rotate + 5 }))} className="text-white hover:text-primary px-3 py-1.5 transition-colors text-xl">↻</button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 opacity-60">Flip</span>
                                        <button onClick={() => setOverlayPos(p => ({ ...p, flipX: p.flipX * -1 }))} className="bg-black/50 p-2 rounded-full border border-white/5 text-white hover:text-primary transition-all shadow-inner">
                                            <div className="transform scale-x-[-1] font-bold text-lg">⇄</div>
                                        </button>
                                    </div>
                                </div>

                                <div className="w-[1px] h-10 bg-white/10"></div>

                                <button className="bg-primary text-white p-5 rounded-full shadow-[0_15px_40px_rgba(255,107,0,0.4)] hover:scale-110 active:scale-95 transition-all group">
                                    <BsCheckCircle size={28} className="group-hover:rotate-12 transition-transform" />
                                </button>
                            </div>

                            {/* HUD Instructions */}
                            <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 pointer-events-none opacity-80">
                                <BsInfoCircle size={10} className="text-primary" />
                                <span className="text-[9px] font-black text-white uppercase tracking-[0.25em]">Manual Fitting Active: Use controls below to align</span>
                            </div>
                        </div>
                    )}

                    {isCameraActive && (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                                <p className="text-gray-600 text-xs italic font-bold">Camera Feed Simulated (Live tracking requires HTTPS)</p>
                            </div>

                            <div className="absolute bottom-10 flex space-x-4">
                                <button className="bg-white/90 p-4 rounded-full shadow-lg"><BsInfoCircle /></button>
                                <button className="bg-primary text-white px-8 py-3 rounded-full font-black uppercase tracking-widest flex items-center space-x-2">
                                    <BsCheckCircle /> <span>Add to Bag</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="p-4 bg-white/5 border-t border-white/10 flex justify-center">
                    <div className="flex space-x-6">
                        <div className="text-center">
                            <p className="text-[8px] font-black text-primary uppercase">Lighting</p>
                            <p className="text-[10px] text-white font-bold">OPTIMAL</p>
                        </div>
                        <div className="h-4 w-[1px] bg-white/20 self-center"></div>
                        <div className="text-center">
                            <p className="text-[8px] font-black text-primary uppercase">Stability</p>
                            <p className="text-[10px] text-white font-bold">STEADY</p>
                        </div>
                        <div className="h-4 w-[1px] bg-white/20 self-center"></div>
                        <div className="text-center">
                            <p className="text-[8px] font-black text-primary uppercase">Resolution</p>
                            <p className="text-[10px] text-white font-bold">1080P</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ARTryOn;
