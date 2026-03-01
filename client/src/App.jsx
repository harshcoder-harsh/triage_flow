import { API_BASE_URL } from './config';
import { useState, useEffect } from 'react'
import { FileText, Stethoscope } from 'lucide-react'
import { useNodesState, useEdgesState } from 'reactflow'
import FlowBuilder from './components/FlowBuilder'
import NavigateMode from './components/NavigateMode'
import Landing from './pages/Landing'
import Login from './components/Login'
import HospitalRegister from './components/HospitalRegister'
import AdminDashboard from './components/AdminDashboard'
import ReportInbox from './components/ReportInbox'
import axios from 'axios'

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
export default function App() {
  const [mode, setMode] = useState('landing')
  const [user, setUser] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Check authentication on startup and handle online/offline events
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const r = await axios.get(`${API_BASE_URL}/api/flowcharts`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          localStorage.setItem('cached_flowcharts', JSON.stringify(r.data));
          localStorage.setItem('last_synced', new Date().toISOString());
        } catch (e) {
          console.error("Background sync failed", e);
        }
      }
    };
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]))
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded)
          setMode(decoded.role === 'admin' ? 'admin' : (decoded.role === 'doctor' ? 'builder' : 'navigate'))
        } else {
          localStorage.removeItem('token')
        }
      } catch (e) {
        localStorage.removeItem('token')
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Call this after a successful login
  const handleLoginComplete = (userData) => {
    try {
      const decoded = JSON.parse(atob(userData.token.split('.')[1]))
      setUser(decoded)
      setMode(decoded.role === 'admin' ? 'admin' : (decoded.role === 'doctor' ? 'builder' : 'navigate'))
    } catch (e) {
      console.error(e)
    }
  }

  // Clear session and return to login
  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setMode('login')
  }

  if (mode === 'landing') return <Landing onLogin={() => setMode('login')} onRegister={() => setMode('register')} />
  if (mode === 'login') return <Login onLoginComplete={handleLoginComplete} onNavigateRegister={() => setMode('register')} onBack={() => setMode('landing')} />
  if (mode === 'register') return <HospitalRegister onNavigateLogin={() => setMode('login')} onBack={() => setMode('login')} />

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-wide">TriageFlow</h1>
          </div>

          {/* Online/Offline Indicator */}
          <div className="flex items-center gap-1.5 bg-slate-700/50 px-3 py-1 rounded-full text-xs font-medium border border-slate-600">
            {isOnline ? (
              <><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Network Online</>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-red-400"></span> Offline Mode</>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-slate-300 text-sm font-medium mr-2 hidden md:block">
            {user?.role === 'doctor' ? 'Dr. ' : ''}{user?.name || 'User'}
          </div>

          {/* Builder Tab - Doctor Only */}
          {user?.role === 'doctor' && (
            <button
              onClick={() => setMode('builder')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'builder' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              Builder Mode
            </button>
          )}

          {/* Navigate Tab - All Roles */}
          <button
            onClick={() => setMode('navigate')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'navigate' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
          >
            Navigate Protocol
          </button>

          {/* Reports Tab - Doctor Only */}
          {user?.role === 'doctor' && (
            <button
              onClick={() => setMode('reports')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'reports' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <FileText className="w-4 h-4 inline mr-1" /> Reports
            </button>
          )}

          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-2 border border-white/20 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        {mode === 'admin' && <AdminDashboard isOnline={isOnline} />}
        {mode === 'builder' && <FlowBuilder nodes={nodes} setNodes={setNodes} onNodesChange={onNodesChange} edges={edges} setEdges={setEdges} onEdgesChange={onEdgesChange} />}
        {mode === 'navigate' && <NavigateMode isOnline={isOnline} />}
        {mode === 'reports' && <ReportInbox doctorHospitalId={user?.hospitalId} doctorId={user?.id} />}
      </div>
    </div>
  )
}
