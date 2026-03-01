import { API_BASE_URL } from '../config';
import { useState } from 'react';
import axios from 'axios';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';


export default function HospitalRegister({ onNavigateLogin, onBack }) {
    const [hospitalName, setHospitalName] = useState('');
    const [location, setLocation] = useState('');
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (adminPassword !== confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/api/hospital/register`, {
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
            setConfirmPassword('');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to register hospital.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#0F172A] overflow-hidden">
            {/* LEFT SIDE */}
            <div className="w-1/2 h-full hidden lg:block">
                <iframe src="https://my.spline.design/pillanddnaanimation-qU0rf7pHGYAgMw62TPgjJoRK/" frameBorder="0" width="100%" height="100%"></iframe>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/2 h-full bg-white relative flex justify-center items-center overflow-y-auto">
                <button onClick={onBack} className="absolute top-8 left-8 text-sm text-gray-400 hover:text-[#0F172A] transition flex items-center gap-1.5 font-medium">
                    <ArrowLeft className="w-4 h-4" /> Login
                </button>

                <div className="w-full max-w-sm px-8 py-12">
                    {successMsg ? (
                        <div className="text-center">
                            <div className="text-green-600 mb-4 flex justify-center">
                                <CheckCircle2 className="w-16 h-16" />
                            </div>
                            <h2 className="text-xl font-bold text-green-600">Hospital Registered!</h2>
                            <p className="text-sm text-gray-500 mt-2">Your admin account has been created</p>

                            <div className="bg-gray-50 rounded-lg p-4 mt-4 text-left border border-gray-200">
                                <p className="text-sm text-[#0F172A]"><strong>Email:</strong> {adminEmail || 'admin@hospital.com'}</p>
                                <p className="text-sm text-[#0F172A] mt-1"><strong>Password:</strong> ********</p>
                                <p className="text-xs text-gray-500 mt-3">Save these credentials safely</p>
                            </div>

                            <button onClick={onNavigateLogin} className="w-full mt-6 bg-[#0F172A] text-white py-3 rounded-lg font-medium hover:opacity-90 transition flex justify-center items-center gap-2">
                                Go to Login <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <h1 className="text-2xl font-bold text-[#0F172A]">Register Your Hospital</h1>
                                <p className="text-sm text-[#64748B] mt-1">Get your clinic on TriageFlow</p>
                            </div>

                            <form onSubmit={handleRegister} className="mt-6 space-y-4">
                                {errorMsg && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                                        {errorMsg}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-[#374151] mb-1">Hospital Name</label>
                                        <input type="text" required className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-[#374151] mb-1">Location</label>
                                        <input type="text" required className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" value={location} onChange={(e) => setLocation(e.target.value)} />
                                    </div>
                                    <div className="col-span-2 mt-2 border-t border-gray-100 pt-2">
                                        <label className="block text-sm font-medium text-[#374151] mb-1">Your Full Name</label>
                                        <input type="text" required className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-[#374151] mb-1">Email Address</label>
                                        <input type="email" required className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
                                    </div>
                                    <div className="col-span-2 relative">
                                        <label className="block text-sm font-medium text-[#374151] mb-1">Password</label>
                                        <input type={showPassword ? "text" : "password"} required className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
                                        <button type="button" className="absolute right-3 top-[34px] text-sm text-gray-400 hover:text-[#0F172A]" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-[#374151] mb-1">Confirm Password</label>
                                        <input type="password" required className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-[#0F172A] hover:opacity-90 text-white py-3 rounded-lg font-medium transition-colors mt-2">
                                    {loading ? 'Registering...' : 'Register Hospital'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
