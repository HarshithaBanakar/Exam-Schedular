import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Login failed');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px]" />

            <div className="glass-panel p-8 md:p-12 w-full max-w-md rounded-2xl relative z-10 transition-all duration-500 hover:shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-2xl mb-4 shadow-lg shadow-indigo-500/40">
                        <GraduationCap size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 mt-2">Faculty Examination Portal</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="faculty@university.edu"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                            <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            Remember me
                        </label>
                        <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Forgot Password?</a>
                    </div>

                    <button
                        type="button" // Change to submit later, using button to prevent refresh in some envs if wired wrong, but submit is standard
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full btn-primary flex items-center justify-center gap-2 group"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                        {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                        Register Faculty Access
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
