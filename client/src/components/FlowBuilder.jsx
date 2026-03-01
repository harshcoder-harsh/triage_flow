import { useCallback, useState } from 'react'
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
} from 'reactflow'
import 'reactflow/dist/style.css'
import axios from 'axios'
import { Plus, CircleAlert, Activity, HeartPulse, Lock, Unlock, HardDriveDownload } from 'lucide-react'

const nodeTypes = {}
const edgeTypes = {}

const defaultNodeStyle = {
    background: '#ffffff',
    border: '2px solid #E2E8F0',
    borderRadius: '16px',
    padding: '24px',
    width: '240px',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
    fontFamily: '"Outfit", sans-serif',
    color: '#0F172A',
    fontWeight: '600',
    fontSize: '15px',
}

const initialNodes = [
    {
        id: 'root-1',
        position: { x: 300, y: 50 },
        data: { label: 'New Question?' },
        type: 'default',
        style: { ...defaultNodeStyle }
    }
]

export default function FlowBuilder({ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange }) {
    const [selectedNode, setSelectedNode] = useState(null)
    const [labelInput, setLabelInput] = useState('')
    const [priority, setPriority] = useState('NONE')
    const [flowchartName, setFlowchartName] = useState('New Triage Protocol')
    const [categorySelect, setCategorySelect] = useState('General')
    const [customCategory, setCustomCategory] = useState('')
    const [isLocked, setIsLocked] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [pendingEdge, setPendingEdge] = useState(null)
    const [edgeLabelInput, setEdgeLabelInput] = useState('')
    const [showGuide, setShowGuide] = useState(true)

    const onConnect = useCallback(
        (params) => {
            setPendingEdge(params)
            setEdgeLabelInput('')
        },
        []
    )

    const confirmEdgeConnection = () => {
        if (!pendingEdge) return;
        setEdges((eds) => addEdge({ ...pendingEdge, label: edgeLabelInput || 'Yes', animated: false, style: { strokeWidth: 2 } }, eds))
        setPendingEdge(null)
    }

    const cancelEdgeConnection = () => {
        setPendingEdge(null)
    }

    const addQuestionNode = () => {
        const newNode = {
            id: `q-${Date.now()}`,
            position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
            data: { label: 'New Question' },
            style: { ...defaultNodeStyle }
        }
        setNodes((nds) => [...nds, newNode])
    }

    const addOutcomeNode = (priorityType) => {
        const styles = {
            RED: { bg: '#FEF2F2', border: '#EF4444', text: 'Emergency' },
            YELLOW: { bg: '#FFFBEB', border: '#F59E0B', text: 'Monitor' },
            GREEN: { bg: '#F0FDF4', border: '#10B981', text: 'Home Care' },
        }
        const c = styles[priorityType]
        const newNode = {
            id: `outcome-${Date.now()}`,
            position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 300 },
            data: { label: c.text, priority: priorityType },
            style: { ...defaultNodeStyle, background: c.bg, border: `3px solid ${c.border}`, fontWeight: 'bold' }
        }
        setNodes((nds) => [...nds, newNode])
    }

    const onNodeClick = (_, node) => {
        setSelectedNode(node)
        setLabelInput(node.data.label)
        setPriority(node.data.priority || 'NONE')
    }

    const updateNodeLabel = () => {
        if (!selectedNode) return;
        setNodes((nds) =>
            nds.map((n) =>
                n.id === selectedNode.id
                    ? { ...n, data: { ...n.data, label: labelInput, priority } }
                    : n
            )
        )
        setSelectedNode(null)
    }

    const saveFlowchart = async (status) => {
        setErrorMsg('')
        setSuccessMsg('')
        try {
            const token = localStorage.getItem('token');
            if (nodes.length === 0) throw new Error("Add at least one node");
            await axios.post('http://localhost:5001/api/flowchart', {
                name: flowchartName,
                category: customCategory.trim() || categorySelect,
                status,
                nodes,
                edges,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setSuccessMsg('Flowchart saved successfully!')
            setTimeout(() => setSuccessMsg(''), 3000)
        } catch (e) {
            setErrorMsg(e.message || 'Save failed. Is the backend running?')
            setTimeout(() => setErrorMsg(''), 4000)
        }
    }

    return (
        <div className="absolute inset-0 flex bg-gray-50">
            <div className="w-72 bg-white border-r border-gray-200 p-5 flex flex-col overflow-y-auto shadow-sm z-10">

                <div className="flex justify-between items-center mb-6">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Protocol Name</label>
                    <button onClick={() => setShowGuide(!showGuide)} className="text-xs text-gray-400 hover:text-gray-600 underline">
                        {showGuide ? 'Hide Guide' : 'Show Guide'}
                    </button>
                </div>

                {showGuide && (
                    <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-lg p-3 text-xs text-slate-600 mb-6 space-y-1">
                        <p><strong className="text-slate-700">Step 1:</strong> Add a Question node</p>
                        <p><strong className="text-slate-700">Step 2:</strong> Add an Outcome node</p>
                        <p><strong className="text-slate-700">Step 3:</strong> Connect them with arrows</p>
                        <p><strong className="text-slate-700">Step 4:</strong> Label the connection</p>
                        <p><strong className="text-slate-700">Step 5:</strong> Save your protocol</p>
                    </div>
                )}

                <div className="mb-6">
                    <input
                        className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-[#0F172A] focus:ring-[#0F172A] transition-shadow"
                        value={flowchartName}
                        onChange={(e) => setFlowchartName(e.target.value)}
                        placeholder="E.g., Fever Triage Protocol"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Add Components</label>
                    <div className="flex flex-col gap-2">
                        <button onClick={addQuestionNode} className="flex items-center justify-center gap-2 bg-[#0F172A] text-white hover:opacity-90 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all w-full">
                            <Plus className="w-4 h-4" />
                            Standard Question
                        </button>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                            <button onClick={() => addOutcomeNode('RED')} className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all text-left flex items-center gap-2 w-full">
                                <CircleAlert className="w-4 h-4" /> Emergency Outcome
                            </button>
                            <button onClick={() => addOutcomeNode('YELLOW')} className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all text-left flex items-center gap-2 w-full">
                                <Activity className="w-4 h-4" /> Monitor Outcome
                            </button>
                            <button onClick={() => addOutcomeNode('GREEN')} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all text-left flex items-center gap-2 w-full">
                                <HeartPulse className="w-4 h-4" /> Home Care Outcome
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Category</label>
                    <div className="flex flex-col gap-2">
                        <select
                            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-[#0F172A] focus:ring-[#0F172A] bg-white"
                            value={categorySelect}
                            onChange={(e) => setCategorySelect(e.target.value)}
                        >
                            <option value="General">General</option>
                            <option value="Fever">Fever</option>
                            <option value="Cardiac">Cardiac</option>
                            <option value="Pediatric">Pediatric</option>
                            <option value="Respiratory">Respiratory</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Or type custom category..."
                            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-[#0F172A] focus:ring-[#0F172A] transition-shadow"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                        />
                    </div>
                </div>

                {selectedNode && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide flex justify-between">
                            <span>Edit Node</span>
                            <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-gray-600">×</button>
                        </label>
                        <textarea
                            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-[#0F172A] focus:ring-[#0F172A] mb-3 resize-none"
                            rows={3}
                            value={labelInput}
                            onChange={(e) => setLabelInput(e.target.value)}
                            placeholder="Question text..."
                        />
                        <button onClick={updateNodeLabel} className="w-full bg-[#0F172A] hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                            Save Changes
                        </button>
                    </div>
                )}

                <div className="mt-auto pt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-sm font-medium text-slate-700">Protocol Status</span>
                        <button
                            onClick={() => setIsLocked(!isLocked)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${isLocked ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}
                        >
                            {isLocked ? <><Lock className="w-3.5 h-3.5" /> Published</> : <><Unlock className="w-3.5 h-3.5" /> Draft</>}
                        </button>
                    </div>
                    <button onClick={() => saveFlowchart(isLocked ? 'published' : 'draft')} className="w-full bg-[#0F172A] hover:opacity-90 text-white px-4 py-3 rounded-lg text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2">
                        <HardDriveDownload className="w-5 h-5" />
                        Save Protocol
                    </button>

                    {errorMsg && <p className="text-red-500 text-xs text-center font-medium bg-red-50 p-2 rounded border border-red-100">{errorMsg}</p>}
                    {successMsg && <p className="text-emerald-600 text-xs mt-3 text-center font-medium bg-emerald-50 p-2 rounded border border-emerald-100">{successMsg}</p>}
                </div>
            </div>

            <div className="flex-1 h-full w-full relative">

                {pendingEdge && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 w-96 transform transition-all">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Label this connection</h3>
                            <p className="text-sm text-gray-500 mb-5">What is the label for this connection? (e.g., Yes, No, Maybe)</p>
                            <input
                                autoFocus
                                className="w-full border-2 border-slate-100 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 mb-6 transition-colors font-medium text-gray-800 placeholder-gray-300"
                                placeholder="Connection label..."
                                value={edgeLabelInput}
                                onChange={e => setEdgeLabelInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && confirmEdgeConnection()}
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <button onClick={cancelEdgeConnection} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
                                <button onClick={confirmEdgeConnection} className="px-5 py-2.5 text-sm font-bold text-white bg-[#0F172A] hover:opacity-90 rounded-lg transition-colors shadow-sm">Connect</button>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
                    .react-flow__node:hover::after {
                        content: 'Drag from the handle to connect';
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #1e1b4b;
                        color: white;
                        padding: 6px 10px;
                        border-radius: 6px;
                        font-size: 12px;
                        font-weight: 500;
                        white-space: nowrap;
                        pointer-events: none;
                        z-index: 1000;
                        margin-bottom: 10px;
                        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    }
                    .react-flow__node:hover::before {
                        content: '';
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        border-width: 6px;
                        border-style: solid;
                        border-color: #1e1b4b transparent transparent transparent;
                        pointer-events: none;
                        z-index: 1000;
                        margin-bottom: -2px;
                    }
                `}</style>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                >
                    <Background color="#ccc" gap={16} size={1} />
                    <MiniMap
                        nodeColor={(n) => {
                            if (n.data?.priority === 'RED') return '#EF4444';
                            if (n.data?.priority === 'YELLOW') return '#F59E0B';
                            if (n.data?.priority === 'GREEN') return '#10B981';
                            return '#1e293b';
                        }}
                    />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    )
}
