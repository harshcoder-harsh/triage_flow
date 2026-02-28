import { useState } from 'react';
import axios from 'axios';

// Login Component
export default function Login({ onLoginComplete, onNavigateRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Handles login flow
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password,
            });

            // On success
            const { token, role, name, hospitalId } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('name', name);
            localStorage.setItem('hospitalId', hospitalId);

            onLoginComplete(response.data);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">🏥 TriageFlow</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Healthcare Triage System</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {errorMsg && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200 font-medium text-center">
                            {errorMsg}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                            placeholder="doctor@clinic.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <button
                        onClick={onNavigateRegister}
                        className="text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
                    >
                        Register your hospital
                    </button>
                </div>
            </div>
        </div>
    );
}
