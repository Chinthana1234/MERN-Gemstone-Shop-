import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import loginBg from '../assets/images/login register pages/gpt-image-2_Prompt_Macro_product_photography_of_a_loose_sparkling_insert_gemstone_e.g._ruby_-0.jpg';

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
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      
      {/* Form Side (Left) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          
          <div className="mb-10 text-left">
            <h1 className="text-xl font-serif text-black mb-12 tracking-wide">Aura Gems</h1>
            <h2 className="text-4xl font-serif text-black mb-3">Welcome Back</h2>
            <p className="text-gray-500 text-sm">Please enter your details to sign in to your account.</p>
          </div>

          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full bg-blue-50/50 border-none rounded-lg pl-10 pr-3 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition-all" 
                  placeholder="name@example.com"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Password</label>
                <a href="#" className="text-xs text-gray-400 hover:text-black transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full bg-blue-50/50 border-none rounded-lg pl-10 pr-3 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition-all" 
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button type="submit" disabled={loading}
              className="w-full bg-black text-white font-bold tracking-widest text-sm py-4 rounded-lg hover:bg-gray-800 transition-all duration-300 mt-4 disabled:opacity-70">
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            New to Aura Gems? <Link to="/register" className="text-black font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>

      {/* Image Side (Right) */}
      <div 
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url("${loginBg}")` }}
      >
      </div>

    </div>
  );
}

export default Login;
