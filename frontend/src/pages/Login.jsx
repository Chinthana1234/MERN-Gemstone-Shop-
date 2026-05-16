import React from 'react';

function Login() {
    return (
        <div className="p-10 text-center flex flex-col items-center">
            <h2 className="text-4xl font-bold text-gemPurple mb-8">Login to Aura Gems</h2>
            <form className="bg-gemCard p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full bg-black border border-gray-700 p-3 rounded-lg mb-4 text-white focus:outline-none focus:border-gemPurple"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full bg-black border border-gray-700 p-3 rounded-lg mb-6 text-white focus:outline-none focus:border-gemPurple"
                />
                <button className="w-full bg-gemPurple hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all">
                    Sign In
                </button>
            </form>
        </div>
    );
}

export default Login;
