import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User } from 'lucide-react';
import registerBg from '../assets/images/login register pages/gpt-image-2_Prompt_Macro_product_photography_of_a_loose_sparkling_insert_gemstone_e.g._ruby_-0.jpg';

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
    <div className="min-h-screen flex flex-col-reverse md:flex-row bg-white">
      
      {/* Image Side (Left) */}
      <div 
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url("${registerBg}")` }}
      >
      </div>

      {/* Form Side (Right) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          
          <div className="mb-10 text-left relative">
            <h1 className="text-xl font-serif text-black absolute top-0 right-0 tracking-wide">Aura Gems</h1>
            <h2 className="text-4xl font-serif text-black mb-3 mt-12">Join Aura</h2>
            <p className="text-gray-500 text-sm">Create your account to experience the art of luxury gemstones.</p>
          </div>

          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Split Name into First and Last for the UI look, but bind both to name state for backend compatibility */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2 block">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input type="text" onChange={(e) => setName(e.target.value)} required
                    className="w-full bg-gray-50 border-none rounded-lg pl-10 pr-3 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition-all" 
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2 block">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input type="text" onChange={(e) => setName(name.split(' ')[0] + ' ' + e.target.value)} required
                    className="w-full bg-gray-50 border-none rounded-lg pl-10 pr-3 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition-all" 
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

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
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2 block">Password</label>
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
              <div>
                <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2 block">Verify</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                    className="w-full bg-gray-50 border-none rounded-lg pl-10 pr-3 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition-all" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
            
            <button type="submit" disabled={loading}
              className="w-full bg-black text-white font-bold tracking-widest text-sm py-4 rounded-lg hover:bg-gray-800 transition-all duration-300 mt-4 disabled:opacity-70">
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
