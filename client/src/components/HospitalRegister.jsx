import { useState } from 'react';
import axios from 'axios';

// HospitalRegister Component
export default function HospitalRegister({ onNavigateLogin }) {
    const [hospitalName, setHospitalName] = useState('');
    const [location, setLocation] = useState('');
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle hospital registration form submission
    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setLoading(true);

        try {
            await axios.post('http://localhost:5001/api/hospital/register', {
                hospitalName,
                location,
                adminName,
                adminEmail,
                adminPassword,
            });

            setSuccessMsg('Registration successful! Please login.');
            setHospitalName('');
            setLocation('');
            setAdminName('');
            setAdminEmail('');
            setAdminPassword('');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to register hospital.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Register Your Hospital</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Create your administrative account to manage protocols and staff.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Hospital Name</label>
                            <input type="text" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors" placeholder="City General" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                            <input type="text" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors" placeholder="New York, NY" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Name</label>
                        <input type="text" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors" placeholder="Dr. John Smith" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Email</label>
                        <input type="email" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors" placeholder="admin@hospital.com" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Password</label>
                        <input type="password" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors" placeholder="••••••••" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
                    </div>

                    <button type="submit" disabled={loading} className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? 'Registering...' : 'Register Hospital'}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-gray-100 pt-6">
                    <button onClick={onNavigateLogin} className="text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors">
                        Already registered? Login
                    </button>
                </div>
            </div>
        </div>
    );
}
