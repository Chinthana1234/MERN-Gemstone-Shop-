import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', { email, password });
            if (data.isAdmin) {
                localStorage.setItem('adminInfo', JSON.stringify(data));
                navigate('/dashboard');
            } else {
                setError('You do not have admin privileges.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-gemBgAlt flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gemCard p-8 rounded border border-gemBorder">
                <h1 className="text-3xl font-serif text-gemText text-center mb-6">Admin Login</h1>
                
                {error && (
                    <div className="bg-gemRed/10 border border-gemRed text-gemRed px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gemTextLight mb-1">Email</label>
                        <input 
                            type="email" 
                            required 
                            className="w-full bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gemTextLight mb-1">Password</label>
                        <input 
                            type="password" 
                            required 
                            className="w-full bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button type="submit" className="w-full bg-gemRed text-white p-3 uppercase tracking-widest font-semibold hover:bg-gemRedDark transition-colors">
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
