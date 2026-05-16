import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-gemBgAlt flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-gemText mb-2">Create Account</h2>
          <div className="h-0.5 w-16 bg-gemRed mx-auto mb-4"></div>
          <p className="text-gemTextLight text-sm">Join the world of rare gemstones</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-gemRed px-4 py-3 mb-6 text-sm text-center rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white p-8 border border-gemBorder rounded-lg shadow-sm space-y-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
              className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gemRed text-white font-semibold uppercase tracking-widest text-sm py-3 hover:bg-gemRedDark transition-all duration-300 rounded disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gemTextLight text-sm mt-6">
          Already have an account? <Link to="/login" className="text-gemRed hover:underline font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
