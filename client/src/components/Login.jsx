import { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, ArrowRight } from 'lucide-react';


export default function Login({ onLoginComplete, onNavigateRegister, onBack }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password,
            });

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
        <div className="flex h-screen w-full bg-[#0F172A] overflow-hidden">
            {/* LEFT SIDE */}
            <div className="w-1/2 h-full hidden lg:block opacity-80">
                <iframe src="https://my.spline.design/pillanddnaanimation-qU0rf7pHGYAgMw62TPgjJoRK/" frameBorder="0" width="100%" height="100%"></iframe>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/2 h-full bg-white relative flex flex-col justify-center items-center">
                <button
                    onClick={onBack}
                    className="absolute top-8 left-8 text-sm text-gray-400 hover:text-[#0F172A] transition flex items-center gap-1.5 font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="w-full max-w-sm px-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0F172A]">Welcome back</h1>
                        <p className="text-sm text-[#64748B] mt-1">Sign in to TriageFlow</p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-4">
                        {errorMsg && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                                {errorMsg}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]"
                                placeholder="doctor@clinic.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F172A]"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0F172A] hover:opacity-90 text-white font-medium py-3 rounded-lg transition-colors mt-6"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="text-sm text-gray-400 mt-8 text-center flex items-center justify-center gap-1.5">
                        Not registered? <button onClick={onNavigateRegister} className="text-[#0F172A] font-bold hover:underline flex items-center gap-1">Register Clinic <ArrowRight className="w-4 h-4" /></button>
                    </p>
                </div>
            </div>
        </div>
    );
}
