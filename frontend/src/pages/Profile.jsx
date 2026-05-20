import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Mail, Key } from 'lucide-react';

function Profile() {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setMessage('');
      await updateProfile(name, email, password);
      setMessage('Profile Updated Successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-gemBgAlt flex justify-center items-center">
      <div className="max-w-md w-full px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gemCard border border-gemBorder text-gemRed mb-4">
            <User size={32} />
          </div>
          <h1 className="text-3xl font-serif text-gemText mb-2">User Profile</h1>
          <p className="text-gemTextLight">Update your account details and password.</p>
        </div>

        <div className="bg-gemCard border border-gemBorder rounded-lg p-8 shadow-lg">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 mb-6 rounded text-center">{error}</div>}
          {message && <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-sm p-3 mb-6 rounded text-center">{message}</div>}

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 flex items-center gap-2">
                <User size={14} /> Name
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 flex items-center gap-2">
                <Mail size={14} /> Email Address
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors"
                required
              />
            </div>

            <div className="pt-4 border-t border-gemBorder">
              <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 flex items-center gap-2">
                <Key size={14} /> New Password
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 flex items-center gap-2">
                <Shield size={14} /> Confirm New Password
              </label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gemRed text-white py-3.5 uppercase tracking-widest text-sm font-semibold hover:bg-gemRedDark transition-colors rounded shadow-md mt-4 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
