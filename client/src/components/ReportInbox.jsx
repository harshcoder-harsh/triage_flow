import { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'

export default function ReportInbox({ doctorHospitalId }) {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('All')
    const [selectedReport, setSelectedReport] = useState(null)

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token')
                const r = await axios.get(`http://localhost:5001/api/reports?hospitalId=${doctorHospitalId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setReports(r.data)
            } catch (e) {
                console.error("Failed to load reports", e)
            } finally {
                setLoading(false)
            }
        }
        if (doctorHospitalId) fetchReports()
    }, [doctorHospitalId])

    const badgeStyle = {
        RED: 'bg-red-100 text-red-800 border-red-200',
        YELLOW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        GREEN: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    }

    if (loading) return <div className="flex h-full items-center justify-center text-gray-400 font-medium">Loading reports...</div>

    if (selectedReport) {
        return (
            <div className="flex justify-center w-full h-full p-4 md:p-8 overflow-y-auto bg-gray-50/50">
                <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-slate-50">
                        <button onClick={() => setSelectedReport(null)} className="text-sm font-bold text-slate-500 flex items-center gap-1.5 hover:text-slate-800 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Inbox
                        </button>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${badgeStyle[selectedReport.outcome]}`}>
                            {selectedReport.outcome} Outcome
                        </span>
                    </div>

                    <div className="p-6 md:p-8">
                        <h1 className="text-2xl font-bold text-slate-800 mb-6">{selectedReport.protocolName} Assessment</h1>

                        <div className="grid grid-cols-2 text-sm text-gray-600 mb-8 border-b border-gray-100 pb-6 gap-4">
                            <div>
                                <p><strong className="text-gray-900">Nurse:</strong> {selectedReport.nurseName}</p>
                                <p className="mt-2"><strong className="text-gray-900">Date/Time:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p><strong className="text-gray-900">Risk Score:</strong> {selectedReport.riskScore}/100</p>
                                <p className="mt-2"><strong className="text-gray-900">Outcome Label:</strong> {selectedReport.outcomeLabel}</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Assessment History</h3>
                            <ul className="space-y-3">
                                {selectedReport.questionHistory?.map((h, i) => (
                                    <li key={i} className="flex gap-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="font-bold text-gray-400 w-6">{(i + 1).toString().padStart(2, '0')}</span>
                                        <div className="flex-1">
                                            <p className="text-gray-700">{h.question}</p>
                                            <p className="font-bold text-slate-800 mt-1">↳ {h.answer}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {selectedReport.notes && (
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Nurse Notes</h3>
                                <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-lg text-sm text-gray-800 whitespace-pre-wrap">
                                    {selectedReport.notes}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    const filteredReports = reports.filter(r => filter === 'All' || r.outcome === filter)

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-hidden bg-gray-50">
            <div className="w-full max-w-5xl mx-auto flex flex-col h-full">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Report Inbox</h2>
                        <p className="text-slate-500 font-medium mt-1">Review patient assessments submitted by nurses.</p>
                    </div>
                    <div className="flex gap-2">
                        {['All', 'RED', 'YELLOW', 'GREEN'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${filter === f ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md' : 'bg-white text-slate-600 border-[#E2E8F0] hover:bg-slate-50'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 pb-8">
                    {filteredReports.length === 0 ? (
                        <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center text-slate-500 shadow-sm font-medium mt-4">
                            No {filter !== 'All' ? filter : ''} reports found.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 mt-4">
                            {filteredReports.map(r => (
                                <div
                                    key={r._id}
                                    onClick={() => setSelectedReport(r)}
                                    className="bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                            {r.nurseName?.charAt(0) || 'N'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{r.nurseName || 'Unknown Nurse'}</h3>
                                            <p className="text-sm text-slate-500 font-medium mt-0.5">{r.protocolName} • {new Date(r.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${badgeStyle[r.outcome]}`}>
                                            {r.outcome} Outcome
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
