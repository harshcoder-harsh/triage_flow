import { API_BASE_URL } from '../config';
import { useState, useEffect } from 'react'
import axios from 'axios'
import expertData from '../data/expertFlowcharts.json'
import { WifiOff, Star, HardDrive, FileText, CheckCircle2, Printer, ArrowLeft, ArrowRight, ClipboardList } from 'lucide-react'

export default function NavigateMode({ isOnline }) {
    const [flowcharts, setFlowcharts] = useState([])
    const [selected, setSelected] = useState(null)
    const [currentNode, setCurrentNode] = useState(null)
    const [history, setHistory] = useState([])
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notes, setNotes] = useState('')
    const [reportSubmitting, setReportSubmitting] = useState(false)
    const [reportSuccess, setReportSuccess] = useState(false)
    const [isOffline, setIsOffline] = useState(!navigator.onLine)
    const [lastSynced, setLastSynced] = useState('')

    const loadFromCache = () => {
        const cached = localStorage.getItem('cached_flowcharts')
        const lastSyncedCache = localStorage.getItem('last_synced')
        const parsed = cached ? JSON.parse(cached) : []

        // Deduplicate
        const mergedData = [...expertData, ...parsed]
        const uniqueData = Array.from(new Map(mergedData.map(item => [item._id, item])).values())
        setFlowcharts(uniqueData)
        setLastSynced(lastSyncedCache || 'Never')
        setIsOffline(true)
    }

    const loadFlowcharts = async () => {
        const token = localStorage.getItem('token')

        if (navigator.onLine) {
            try {
                // Fetch fresh data from API
                const res = await axios.get(`${API_BASE_URL}/api/flowcharts`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                // Save to cache immediately
                localStorage.setItem('cached_flowcharts', JSON.stringify(res.data))
                const dateSync = new Date().toLocaleString()
                localStorage.setItem('last_synced', dateSync)

                // Use fresh data
                const mergedData = [...expertData, ...res.data]
                const uniqueData = Array.from(new Map(mergedData.map(item => [item._id, item])).values())
                setFlowcharts(uniqueData)
                setLastSynced(dateSync)
                setIsOffline(false)
            } catch (err) {
                // Request failed — fall back to cache
                loadFromCache()
            }
        } else {
            // No internet — load from cache
            loadFromCache()
        }
        setLoading(false)
    }

    // Step 1 — On component load check internet
    useEffect(() => {
        loadFlowcharts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Step 4 — Listen for connectivity changes:
    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false)
            loadFlowcharts() // re-sync when internet returns
        }
        const handleOffline = () => {
            setIsOffline(true)
            loadFromCache()
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const startProtocol = (flowchart) => {
        setSelected(flowchart)
        setResult(null)
        setHistory([])
        setNotes('')
        setReportSuccess(false)
        const targetIds = flowchart.edges.map(e => e.target)
        const root = flowchart.nodes.find(n => !targetIds.includes(n.id))

        setCurrentNode(root || flowchart.nodes[0])
    }

    const handleAnswer = (edge) => {
        const nextNode = selected.nodes.find(n => n.id === edge.target)
        if (!nextNode) return;

        setHistory(h => [...h, { node: currentNode, question: currentNode.data.label, answer: edge.label || 'Yes' }])

        const nextOutgoingEdges = selected.edges.filter(e => e.source === nextNode.id)

        if (nextNode.data.priority || nextOutgoingEdges.length === 0) {
            setResult(nextNode)
            setCurrentNode(null)
        } else {
            setCurrentNode(nextNode)
        }
    }

    const getOutgoingEdges = (nodeId) =>
        selected.edges.filter(e => e.source === nodeId)

    const priorityStyle = {
        RED: 'bg-red-50 border-red-500 text-red-900 shadow-red-100',
        YELLOW: 'bg-yellow-50 border-yellow-500 text-yellow-900 shadow-yellow-100',
        GREEN: 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-emerald-100',
    }

    const badgeStyle = {
        RED: 'bg-red-500 text-white',
        YELLOW: 'bg-yellow-500 text-white',
        GREEN: 'bg-emerald-500 text-white',
    }

    const priorityEmoji = { RED: 'red', YELLOW: 'yellow', GREEN: 'green' }

    const outgoingEdges = selected?.edges?.filter(e => e.source === currentNode?.id) || [];

    // Initial check for a single-node or bugged protocol starting with no edges
    useEffect(() => {
        if (selected && currentNode && outgoingEdges.length === 0 && !result) {
            setResult(currentNode)
            setCurrentNode(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentNode, selected, result])

    if (loading) return (
        <div className="flex items-center justify-center h-full w-full">
            <p className="text-gray-400 font-medium">Loading protocols...</p>
        </div>
    )

    // List view
    if (!selected) {
        const cachedFlowcharts = flowcharts.filter(f => !f.isExpert)
        const expertFlowchartsList = flowcharts.filter(f => f.isExpert)

        return (
            <div className="flex justify-center w-full h-full p-8 overflow-y-auto">
                <div className="w-full max-w-2xl mt-8">
                    <h2 className="text-3xl font-extrabold text-[#0F172A] mb-2 tracking-tight">Triage Protocols</h2>
                    <p className="text-slate-500 mb-8 font-medium">Select a protocol from the list to start a patient assessment.</p>

                    {isOffline && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-700 flex items-center justify-between shadow-sm">
                            <span className="flex items-center gap-2 font-medium"><WifiOff className="w-4 h-4" /> Offline Mode — Showing Cached Data</span>
                            <span className="text-red-500 text-xs font-semibold bg-white px-2 py-1 rounded-md border border-red-100">Last synced: {lastSynced}</span>
                        </div>
                    )}

                    {isOffline ? (
                        <>
                            {/* Offline View: Separated Sections */}
                            <p className="font-semibold text-gray-500 text-sm mb-3 flex items-center gap-2 uppercase tracking-wide"><Star className="w-4 h-4 text-blue-500" /> Expert Protocols</p>
                            <div className="flex flex-col gap-4 mb-8">
                                {expertFlowchartsList.map(f => (
                                    <button
                                        key={f._id}
                                        onClick={() => startProtocol(f)}
                                        className="group bg-white border border-[#E2E8F0] rounded-xl p-6 text-left hover:border-slate-400 hover:shadow-md transition-all relative overflow-hidden flex items-center justify-between"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-[#0F172A] transition-colors flex items-center gap-2"><FileText className="w-5 h-5 text-slate-400" /> {f.name}</h3>
                                            <p className="text-sm text-slate-400 font-medium ml-7">Expert System • Built-in • Cached</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                                    </button>
                                ))}
                            </div>

                            <p className="font-semibold text-gray-500 text-sm mt-6 mb-3 flex items-center gap-2 uppercase tracking-wide"><HardDrive className="w-4 h-4 text-emerald-500" /> Cached Protocols</p>
                            <div className="flex flex-col gap-4">
                                {cachedFlowcharts.length === 0 && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 shadow-sm">
                                        No cached custom protocols found.
                                    </div>
                                )}
                                {cachedFlowcharts.map(f => (
                                    <button
                                        key={f._id}
                                        onClick={() => startProtocol(f)}
                                        className="group bg-white border border-[#E2E8F0] rounded-xl p-6 text-left hover:border-slate-400 hover:shadow-md transition-all relative overflow-hidden flex items-center justify-between"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-[#0F172A] transition-colors flex items-center gap-2"><FileText className="w-5 h-5 text-slate-400" /> {f.name}</h3>
                                            <p className="text-sm text-slate-400 font-medium ml-7">Contains {f.nodes?.length || 0} decision nodes • Cached</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Online View: Combined */}
                            <div className="flex flex-col gap-4">
                                {flowcharts.map(f => (
                                    <button
                                        key={f._id}
                                        onClick={() => startProtocol(f)}
                                        className="group bg-white border border-[#E2E8F0] rounded-xl p-6 text-left hover:border-slate-400 hover:shadow-md transition-all relative overflow-hidden flex items-center justify-between"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-[#0F172A] transition-colors flex items-center gap-2"><FileText className="w-5 h-5 text-slate-400" /> {f.name}</h3>
                                            <p className="text-sm text-slate-400 font-medium ml-7">
                                                {f.isExpert ? 'Expert System • Built-in' : `Contains ${f.nodes?.length || 0} decision nodes • Created ${new Date(f.createdAt).toLocaleDateString()}`}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }

    const submitReport = async () => {
        try {
            setReportSubmitting(true)
            const token = localStorage.getItem('token')
            const decoded = JSON.parse(atob(token.split('.')[1]))
            const nurseId = decoded.userId
            const hospitalId = decoded.hospitalId

            const reportData = {
                protocolName: selected.name,
                protocolId: selected._id,
                nurseId: nurseId,
                nurseName: decoded.name,
                hospitalId: hospitalId,
                date: new Date().toISOString(),
                questionHistory: history.map(h => ({ question: h.question, answer: h.answer })),
                outcome: result.data.priority,
                outcomeLabel: result.data.label,
                riskScore: result.data.priority === 'RED' ? 100 : result.data.priority === 'YELLOW' ? 50 : 10,
                notes: notes,
                createdAt: new Date().toISOString()
            }

            await axios.post(`${API_BASE_URL}/api/report`, reportData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setReportSuccess(true)
            alert('Report submitted successfully!')
        } catch (e) {
            console.error(e)
            alert('Failed to submit. Please try again.')
        } finally {
            setReportSubmitting(false)
        }
    }

    if (result) {
        const token = localStorage.getItem('token')
        const decoded = token ? JSON.parse(atob(token.split('.')[1])) : {}
        const nurseName = decoded.name || 'Unknown Nurse'
        const riskScore = result.data.priority === 'RED' ? 100 : result.data.priority === 'YELLOW' ? 50 : 10
        const recommendation = result.data.priority === 'RED' ? 'IMMEDIATE EMERGENCY RESPONSE REQUIRED. Page doctor on call.' : result.data.priority === 'YELLOW' ? 'Admit to ward for observation. Monitor vitals every 30 mins.' : 'Discharge with home care instructions.'

        return (
            <div className="flex justify-center w-full h-full p-4 md:p-8 overflow-y-auto bg-gray-50/50 absolute inset-0 print:static print:h-auto print:overflow-visible print:bg-white print:p-0">
                <div className="w-full max-w-3xl print:w-full print:max-w-none print:shadow-none bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden my-auto h-auto min-h-min mb-12 print:my-0 print:mb-0 print:border-none print:rounded-none">
                    <div className={`p-6 text-white ${badgeStyle[result.data.priority]} print:bg-transparent print:text-black print:border-b-2 print:border-black print:p-0 print:pb-4 print:mb-6`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">Patient Assessment Report</h1>
                                <p className="opacity-90 font-medium">{selected.name} Protocol</p>
                            </div>
                            <div className="text-right">
                                <span className="inline-block px-3 py-1 bg-white/20 rounded-lg text-sm font-bold tracking-wider uppercase backdrop-blur-sm print:border print:border-black print:text-black print:bg-white">
                                    {result.data.priority} OUTCOME
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 print:p-0">
                        <div className="grid grid-cols-2 text-sm text-gray-600 mb-8 border-b border-gray-100 pb-6 print:border-black/20">
                            <div>
                                <p><strong className="text-gray-900">Assessed by:</strong> {nurseName}</p>
                                <p className="mt-2"><strong className="text-gray-900">Date/Time:</strong> {new Date().toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p><strong className="text-gray-900">Risk Score:</strong> {riskScore}/100</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Assessment History</h3>
                            <ul className="space-y-3">
                                {history.map((h, i) => (
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

                        <div className={`mb-8 p-5 rounded-xl border-l-4 ${priorityStyle[result.data.priority]} pb-6`}>
                            <h3 className="font-bold mb-2">Final Outcome: {result.data.label}</h3>
                            <p className="text-sm opacity-90"><strong className="font-medium">Recommendation:</strong> {recommendation}</p>
                        </div>

                        {!reportSuccess ? (
                            <div className="mb-8 print:hidden">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nurse Notes & Observations</label>
                                <textarea
                                    className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] focus:outline-none"
                                    rows="4"
                                    placeholder="Add any additional patient details, symptoms, or actions taken..."
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                />
                            </div>
                        ) : (
                            <div className="mb-8 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-medium print:hidden flex items-center gap-2 shadow-sm">
                                <CheckCircle2 className="w-5 h-5" /> Report successfully saved to backend!
                            </div>
                        )}

                        <div className="flex gap-4 print:hidden pt-4 border-t border-gray-100">
                            <button
                                onClick={() => { setSelected(null); setResult(null) }}
                                className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                            >
                                Close
                            </button>
                            <div className="flex-1 flex gap-3 justify-end">
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold transition-colors border border-slate-200 shadow-sm"
                                >
                                    <Printer className="w-4 h-4" /> Print Report
                                </button>
                                {!reportSuccess && (
                                    <button
                                        onClick={submitReport}
                                        disabled={reportSubmitting}
                                        className="px-6 py-2.5 bg-[#0F172A] hover:opacity-90 text-white rounded-lg font-bold shadow-md transition-colors flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!currentNode) return null;

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4 overflow-y-auto">
            <div className="w-full max-w-xl">

                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                        <ClipboardList className="w-5 h-5" />
                        {selected.name}
                    </div>
                    <div className="text-xs font-bold text-gray-400 bg-gray-100 rounded-full px-3 py-1">
                        Step {history.length + 1}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 w-full mb-6 relative overflow-hidden">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-8 leading-snug">
                        {currentNode?.data.label}
                    </h2>

                    <div className="flex flex-col gap-3">
                        {outgoingEdges.map((edge, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(edge)}
                                className="w-full bg-[#0F172A] text-white hover:opacity-90 rounded-xl py-4 text-lg font-bold shadow-md transition-all flex items-center justify-between px-6"
                            >
                                <span>{edge.label}</span>
                                <ArrowRight className="w-5 h-5 opacity-70" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center px-2">
                    {history.length > 0 ? (
                        <button onClick={() => { setCurrentNode(history[history.length - 1].node); setHistory(h => h.slice(0, -1)) }}
                            className="text-sm font-semibold text-gray-500 hover:text-[#0F172A] flex items-center gap-1.5 transition-colors px-3 py-1.5 -ml-2 rounded-lg hover:bg-gray-100">
                            <ArrowLeft className="w-4 h-4" />
                            Step Back
                        </button>
                    ) : <div></div>}

                    <button onClick={() => setSelected(null)} className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors">
                        Cancel Assessment
                    </button>
                </div>
            </div>
        </div>
    )
}
