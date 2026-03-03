'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BsEnvelope, BsLock, BsPerson, BsPhone, BsGoogle, BsGithub, BsArrowRight, BsCheckCircleFill, BsExclamationCircle, BsBag, BsCart3, BsTag, BsGift, BsTruck, BsCreditCard } from 'react-icons/bs';

const BackgroundAnimation = () => {
    const iconData = React.useMemo(() => [
        { icon: <BsBag />, color: 'text-fuchsia-400/30', size: 'text-7xl', x: '10%', y: '15%', d: 40 },
        { icon: <BsCart3 />, color: 'text-blue-300/30', size: 'text-8xl', x: '85%', y: '10%', d: 50 },
        { icon: <BsTag />, color: 'text-cyan-300/30', size: 'text-6xl', x: '75%', y: '80%', d: 45 },
        { icon: <BsGift />, color: 'text-primary/40', size: 'text-9xl', x: '15%', y: '75%', d: 60 },
        { icon: <BsTruck />, color: 'text-purple-400/30', size: 'text-7xl', x: '45%', y: '5%', d: 55 },
        { icon: <BsCreditCard />, color: 'text-blue-400/30', size: 'text-6xl', x: '90%', y: '50%', d: 42 },
    ], []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#0a0f1d]">
            {/* Ambient Glows */}
            <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[120px]"></div>

            {iconData.map((item, idx) => (
                <motion.div
                    key={idx}
                    className={`absolute ${item.size} ${item.color} will-change-transform`}
                    style={{ left: item.x, top: item.y }}
                    animate={{
                        x: [0, 40, -40, 0],
                        y: [0, -40, 40, 0],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: item.d,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {item.icon}
                </motion.div>
            ))}
            <div className="absolute inset-0 bg-[#0a0f1d]/30 backdrop-blur-[0.5px]"></div>
        </div>
    );
};

const LoginPage = ({ defaultIsLogin = true }) => {
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'mobile'
    const [isLogin, setIsLogin] = useState(defaultIsLogin);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });

    const handleSocialSignIn = async (provider) => {
        setLoading(true);
        await signIn(provider, { callbackUrl: '/shop' });
    };

    const handleSendOtp = () => {
        if (!formData.mobile) {
            setError('Please enter a mobile number');
            return;
        }
        setLoading(true);
        // Simulate OTP send
        setTimeout(() => {
            setOtpSent(true);
            setLoading(false);
            setSuccess('OTP sent to ' + formData.mobile + ' (Hint: 123456)');
        }, 300);
    };

    const handleVerifyOtp = () => {
        if (otp === '123456') {
            setSuccess('OTP verified! Logging in...');
            setLoading(true);
            router.push('/shop');
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');
        setSuccess('');

        if (isLogin && loginMethod === 'mobile') {
            otpSent ? handleVerifyOtp() : handleSendOtp();
            return;
        }

        if (isLogin) {
            // LOGIN logic
            const res = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (res.error) {
                // If it's a specific auth error, show a better message
                if (res.error === 'CredentialsSignin') {
                    setError('Invalid email or password');
                } else {
                    setError(res.error || 'Login failed. Please check your connection.');
                }
                setLoading(false);
            } else {
                setSuccess('Logged in successfully! Redirecting...');
                router.push('/shop');
            }
        } else {
            // REGISTER logic
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }

            try {
                console.log('Frontend: Starting registration fetch for', formData.email);

                // Add a timeout to prevent indefinite hanging
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                console.log('Frontend: Registration response status:', res.status);

                const data = await res.json();
                console.log('Frontend: Registration response data:', data);

                if (res.ok) {
                    setSuccess('Account created! Please login.');
                    setIsLogin(true);
                    setFormData({ ...formData, password: '', confirmPassword: '' });
                } else {
                    setError(data.message || 'Registration failed');
                }
            } catch (err) {
                console.error('Frontend: Registration error:', err);
                if (err.name === 'AbortError') {
                    setError('Registration timed out. The server might be busy.');
                } else {
                    setError('Something went wrong. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
            <BackgroundAnimation />
            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href="/">
                    <h1 className="text-center text-3xl font-black tracking-tighter bg-gradient-to-r from-fuchsia-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent inline-block w-full">
                        <span className="italic">CART</span><span className="NOT-italic">ZEN</span>
                    </h1>
                </Link>
                <h2 className="mt-6 text-center text-xl font-black text-white uppercase tracking-widest">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <div className="mt-4 bg-primary/20 border-l-4 border-primary p-4 mx-4 sm:mx-0 backdrop-blur-sm">
                    <p className="text-sm text-primary font-bold">
                        Access Restricted: You must login or register an account to enter the website.
                    </p>
                </div>
                {isLogin && (
                    <div className="mt-4 flex justify-center space-x-4 border-b border-white/10">
                        <button
                            onClick={() => {
                                setLoginMethod('email');
                                setOtpSent(false);
                                setOtp('');
                                setError('');
                                setSuccess('');
                            }}
                            className={`pb-2 px-4 text-xs font-black uppercase tracking-widest transition-all ${loginMethod === 'email' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-gray-300'}`}
                        >
                            Email
                        </button>
                        <button
                            onClick={() => {
                                setLoginMethod('mobile');
                                setOtpSent(false);
                                setOtp('');
                                setError('');
                                setSuccess('');
                            }}
                            className={`pb-2 px-4 text-xs font-black uppercase tracking-widest transition-all ${loginMethod === 'mobile' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-gray-300'}`}
                        >
                            Mobile (OTP)
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? (isLogin && loginMethod === 'mobile' ? 'mobile' : 'email') : 'register'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                {!isLogin && (
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                                        <div className="relative">
                                            <BsPerson className="absolute left-3 top-3.5 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-bold"
                                                placeholder="Enter your name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {loginMethod === 'email' || !isLogin ? (
                                    <>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
                                            <div className="relative">
                                                <BsEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    required
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-bold"
                                                    placeholder="me@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Password</label>
                                            <div className="relative">
                                                <BsLock className="absolute left-3 top-3.5 text-gray-400" />
                                                <input
                                                    type="password"
                                                    required
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-bold"
                                                    placeholder="••••••••"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Mobile Number</label>
                                        <div className="relative">
                                            <BsPhone className="absolute left-3 top-3.5 text-gray-400" />
                                            <input
                                                type="tel"
                                                required
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-bold"
                                                placeholder="+91-XXXXXXXXXX"
                                                value={formData.mobile}
                                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                            />
                                        </div>
                                        {otpSent && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">OTP (check hint)</label>
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    className="block w-full px-3 py-3 border border-gray-200 rounded-md shadow-sm text-center text-lg font-black tracking-[0.5em] focus:outline-none focus:ring-primary focus:border-primary"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                )}

                                {!isLogin && (
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Confirm Password</label>
                                        <div className="relative">
                                            <BsLock className="absolute left-3 top-3.5 text-gray-400" />
                                            <input
                                                type="password"
                                                required
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-bold"
                                                placeholder="••••••••"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-2 text-center text-sm text-gray-500 font-medium">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setLoginMethod('email');
                                    setOtpSent(false);
                                    setOtp('');
                                    setError('');
                                    setSuccess('');
                                }}
                                className="font-bold text-primary hover:text-primary-hover underline"
                            >
                                {isLogin ? 'Register here' : 'Login here'}
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 p-3 rounded-md flex items-center space-x-2 text-red-600">
                                <BsExclamationCircle />
                                <span className="text-xs font-bold">{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 p-3 rounded-md flex items-center space-x-2 text-green-600">
                                <BsCheckCircleFill />
                                <span className="text-xs font-bold">{success}</span>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-black text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : (loginMethod === 'mobile' && !otpSent) ? 'Send OTP' : (loginMethod === 'mobile' && otpSent) ? 'Verify & Login' : isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-400 font-bold uppercase text-[10px] tracking-widest">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleSocialSignIn('google')}
                                className="w-full inline-flex justify-center py-3 px-4 border border-gray-200 rounded-md shadow-sm bg-white text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all flex items-center space-x-2"
                            >
                                <BsGoogle className="text-red-500" />
                                <span>Google</span>
                            </button>
                            <button
                                onClick={() => handleSocialSignIn('github')}
                                className="w-full inline-flex justify-center py-3 px-4 border border-gray-200 rounded-md shadow-sm bg-white text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all flex items-center space-x-2"
                            >
                                <BsGithub className="text-gray-900" />
                                <span>GitHub</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
