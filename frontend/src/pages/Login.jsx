import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import API from '../utils/api';
import loginBg from '../assets/images/login register pages/gpt-image-2_Prompt_Macro_product_photography_of_a_loose_sparkling_insert_gemstone_e.g._ruby_-0.jpg';

const getAdminUrl = () => {
  if (import.meta.env.VITE_ADMIN_URL) return import.meta.env.VITE_ADMIN_URL;
  const hostname = window.location.hostname;
  if (hostname.includes('vercel.app')) {
    if (hostname.includes('-client')) return `https://${hostname.replace('-client', '-admin')}`;
    if (hostname.includes('-frontend')) return `https://${hostname.replace('-frontend', '-admin')}`;
    return 'https://auragems-admin.vercel.app';
  }
  return 'http://localhost:5174';
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, syncLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const adminDataParam = params.get('adminData');
    const redirectParam = params.get('redirect');
    if (adminDataParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(adminDataParam));
        syncLogin(userData);
        if (redirectParam) {
          window.location.href = redirectParam;
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Failed to sync login data', err);
      }
    }
  }, [syncLogin, navigate]);

  const handleGoogleCallback = async (response) => {
    try {
      setLoading(true);
      const { data } = await API.post('/auth/google', { token: response.credential });
      syncLogin(data);
      if (data.isAdmin) {
        const adminUrl = getAdminUrl();
        window.location.href = `${adminUrl}/login?adminData=${encodeURIComponent(JSON.stringify(data))}`;
      } else {
        navigate('/');
      }
    } catch (err) {
      const serverError = err.response?.data;
      if (serverError?.debug) {
        console.error("Google Auth Mismatch Debug Info:", serverError.debug);
      }
      setError(serverError?.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '260721950691-l4ngko1fh1jrrjcln5k94bbb5beqike.apps.googleusercontent.com',
        callback: handleGoogleCallback
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", width: 384 }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const userData = await login(email, password);
      if (userData && userData.isAdmin) {
        const adminUrl = getAdminUrl();
        window.location.href = `${adminUrl}/login?adminData=${encodeURIComponent(JSON.stringify(userData))}`;
      } else {
        navigate('/');
      }
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 font-semibold tracking-wider">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div id="googleSignInDiv" className="w-full max-w-sm"></div>
          </div>

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
