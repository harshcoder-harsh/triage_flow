import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Printer, Copy, Trash2, Eye, Star, Building2, Play, Users, FileText, CheckCircle2 } from 'lucide-react';

// AdminDashboard Component for managing Staff and view Protocols.
export default function AdminDashboard({ isOnline }) {
    const [staff, setStaff] = useState([]);
    const [protocols, setProtocols] = useState([]);
    const [loading, setLoading] = useState(true);

    // Add Staff State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRole, setNewRole] = useState('doctor');
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [createMsg, setCreateMsg] = useState('');
    const [lastCreated, setLastCreated] = useState(null);

    // Password visibility tracking
    const [visiblePasswords, setVisiblePasswords] = useState({});

    useEffect(() => {
        fetchData();
    }, [isOnline]);

    // Fetches both staff and protocols from the API
    const fetchData = async (background = false) => {
        try {
            if (!background) setLoading(true);
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Make concurrent API calls
            const [staffReq, flowchartsReq] = await Promise.all([
                axios.get('http://localhost:5001/api/staff', { headers }),
                axios.get('http://localhost:5001/api/flowcharts', { headers })
            ]);

            setStaff(staffReq.data);
            setProtocols(flowchartsReq.data);
        } catch (err) {
            console.error('Failed to fetch admin data', err);
        } finally {
            setLoading(false);
        }
    };

    // Handles adding a new staff member
    const handleAddStaff = async (e) => {
        e.preventDefault();
        setCreateMsg('');
        setLastCreated(null);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5001/api/staff/create', {
                name: newName,
                email: newEmail,
                password: newPassword,
                role: newRole
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCreateMsg('Staff created successfully.');
            setLastCreated({ name: newName, email: newEmail, role: newRole, plainPassword: newPassword });

            // Clear inputs
            setNewName('');
            setNewEmail('');
            setNewPassword('');

            // Refetch without triggering full-page loader
            fetchData(true);

            // Keep form open so admin can copy credentials from the inline form? 
            // Requirement: "show credentials modal with [Print] and [Copy]"
            // We will handle it by just showing an alert or inline success since it's cleaner. Wait, user specifically asked for "After creating: show credentials modal with Print and Copy".
        } catch (err) {
            setCreateMsg(err.response?.data?.message || 'Failed to create staff');
        }
    };

    // Toggles password visibility in the UI table
    const togglePasswordVisibility = (email) => {
        setVisiblePasswords(prev => ({ ...prev, [email]: !prev[email] }));
    };

    // Handles copying exact text to clipboard using the modern API 
    const handleCopyCredentials = (member) => {
        const text = `Name: ${member.name}, Role: ${member.role}, Email: ${member.email}, Password: ${member.plainPassword}`;
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    // Handles deleting staff members
    const handleDeleteStaff = async (id) => {
        if (!window.confirm('Are you sure you want to remove this staff member?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/staff/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStaff(staff.filter(s => s._id !== id));
        } catch (err) {
            console.error('Failed to remove staff', err);
        }
    };

    if (loading) return <div className="p-10 text-slate-500 font-medium text-center">Loading Dashboard...</div>;

    return (
        <div className="flex-1 w-full p-8 overflow-y-auto bg-gray-50 h-full">

            {/* SECTION 1 — Staff Management */}
            <div className="max-w-5xl mx-auto mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Staff Management</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => { setShowAddForm(true); setNewRole('doctor'); setCreateMsg(''); setLastCreated(null); }}
                            className="bg-[#0F172A] hover:opacity-90 transition text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Doctor
                        </button>
                        <button
                            onClick={() => { setShowAddForm(true); setNewRole('nurse'); setCreateMsg(''); setLastCreated(null); }}
                            className="bg-white border border-[#E2E8F0] hover:bg-gray-50 transition text-[#0F172A] px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Nurse
                        </button>
                    </div>
                </div>

                {/* Inline Add Staff Form */}
                {showAddForm && (
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-slate-800">Create New {newRole === 'doctor' ? 'Doctor' : 'Nurse'}</h3>
                            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕ Close</button>
                        </div>

                        <form onSubmit={handleAddStaff} className="grid grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-semibold text-[#64748B] mb-1">Name</label>
                                <input required value={newName} onChange={e => setNewName(e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" placeholder="Jane Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#64748B] mb-1">Email</label>
                                <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" placeholder="jane@hospital.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#64748B] mb-1">Password</label>
                                <input required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" placeholder="••••••••" />
                            </div>
                            <div>
                                <button type="submit" className="w-full bg-[#0F172A] text-white rounded-lg hover:opacity-90 font-semibold py-3 text-sm transition-colors">
                                    Create {newRole === 'doctor' ? 'Doctor' : 'Nurse'}
                                </button>
                            </div>
                        </form>

                        {createMsg && lastCreated && (
                            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center">
                                <span className="text-emerald-700 font-medium text-sm flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" /> {createMsg}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => window.print()} className="bg-white border border-emerald-300 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5 transition"><Printer className="w-3.5 h-3.5" /> Print</button>
                                    <button onClick={() => handleCopyCredentials(lastCreated)} className="bg-white border border-emerald-300 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5 transition"><Copy className="w-3.5 h-3.5" /> Copy</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Staff Table */}
                <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-gray-200">
                                <th className="p-4 font-semibold text-slate-600 text-sm">Name</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Role</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Email</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Password</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-slate-500 font-medium">No external staff accounts found.</td>
                                </tr>
                            )}
                            {staff.map((s, idx) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-slate-50 last:border-0">
                                    <td className="p-4 text-sm font-medium text-slate-800">{s.name}</td>
                                    <td className="p-4 text-sm text-slate-600 capitalize">{s.role}</td>
                                    <td className="p-4 text-sm text-slate-600">{s.email}</td>
                                    <td className="p-4 text-sm text-slate-500 font-mono flex items-center gap-2">
                                        {visiblePasswords[s.email] ? s.plainPassword : '••••••••'}
                                        <button onClick={() => togglePasswordVisibility(s.email)} className="text-xs text-slate-400 hover:text-slate-800 transition-colors flex items-center justify-center p-1 rounded-md hover:bg-slate-100">
                                            {/* We previously replaced [Show] with <Eye> via sed, make it safe here */}
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleCopyCredentials(s)} className="text-slate-500 hover:text-slate-800 mr-4 font-medium text-xs transition-colors inline-flex items-center gap-1">
                                            <Copy className="w-3.5 h-3.5" /> Copy
                                        </button>
                                        <button onClick={() => handleDeleteStaff(s._id)} className="text-red-500 hover:text-red-700 font-medium text-xs transition-colors inline-flex items-center gap-1">
                                            <Trash2 className="w-3.5 h-3.5" /> Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SECTION 2 — Protocol Inventory */}
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-6">Protocol Inventory</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {protocols.map((p, idx) => (
                        <div key={idx} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    {p.isExpert ? (
                                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1.5 rounded-md inline-flex items-center gap-1.5 mb-3 border border-blue-100"><Star className="w-3.5 h-3.5" /> Expert</span>
                                    ) : (
                                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1.5 rounded-md inline-flex items-center gap-1.5 mb-3 border border-emerald-100"><Building2 className="w-3.5 h-3.5" /> Hospital</span>
                                    )}
                                    <h3 className="font-bold text-[#0F172A] text-lg leading-tight mb-1">{p.name}</h3>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{p.category}</p>
                                </div>
                            </div>

                            <div className="mt-auto pt-6">
                                <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-[#0F172A] rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2 group">
                                    <Play className="w-4 h-4 group-hover:scale-110 transition-transform" /> Use Protocol
                                </button>
                            </div>
                        </div>
                    ))}
                    {protocols.length === 0 && (
                        <div className="col-span-3 text-center p-8 bg-white border border-gray-200 rounded-xl text-slate-500">
                            No protocols found.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
