import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-white mb-2">Welcome Back</h2>
          <div className="h-0.5 w-16 bg-gemGold mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Sign in to your Aura Gems account</p>
        </div>

        {error && <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-gemCard p-8 border border-gemBorder space-y-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full bg-gemDark border border-gemBorder p-3 text-white focus:outline-none focus:border-gemGold transition-colors" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full bg-gemDark border border-gemBorder p-3 text-white focus:outline-none focus:border-gemGold transition-colors" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gemGold text-black font-semibold uppercase tracking-widest text-sm py-3 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:opacity-50">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account? <Link to="/register" className="text-gemGold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
