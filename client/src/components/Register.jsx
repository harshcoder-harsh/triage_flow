import { API_BASE_URL } from '../config';
import { useState } from 'react';
import axios from 'axios';

export default function Register({ onBackToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('nurse'); // doctor or nurse
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Handles admin registration submission (only accessible if they are logged in as admin/doctor, handled outside)
    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/api/auth/register`, {
                name,
                email,
                password,
                role,
            });

            setSuccessMsg('Account created successfully.');
            setName('');
            setEmail('');
            setPassword('');
            setRole('nurse');
        } catch (err) {
            setErrorMsg(err.response?.data?.error || 'Failed to register account. (Are you logged in as a Doctor?)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Portal</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Create New Medical Account</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    {errorMsg && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200 font-medium text-center">
                            {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-md text-sm border border-emerald-200 font-medium text-center">
                            {successMsg}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                            placeholder="Dr. Smith"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                            placeholder="smith@clinic.com"
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

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors bg-white"
                        >
                            <option value="nurse">Nurse</option>
                            <option value="doctor">Doctor (Admin)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <button
                        onClick={onBackToLogin}
                        className="text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
                    >
                        Back to Dashboard / Login
                    </button>
                </div>
            </div>
        </div>
    );
}
