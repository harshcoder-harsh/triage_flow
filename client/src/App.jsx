import { useState, useEffect } from 'react'
import FlowBuilder from './components/FlowBuilder'
import NavigateMode from './components/NavigateMode'
import Login from './components/Login'
import HospitalRegister from './components/HospitalRegister'
import AdminDashboard from './components/AdminDashboard'
import axios from 'axios'
export default function App() {
  const [mode, setMode] = useState('login')
  const [user, setUser] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Check authentication on startup and handle online/offline events
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const r = await axios.get('http://localhost:5001/api/flowcharts', {
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

  if (mode === 'login') return <Login onLoginComplete={handleLoginComplete} onNavigateRegister={() => setMode('register')} />
  if (mode === 'register') return <HospitalRegister onNavigateLogin={() => setMode('login')} />

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50">
      <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
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
              className={`px-4 py-1.5 rounded-md font-medium transition-colors ${mode === 'builder' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              Builder Mode
            </button>
          )}

          {/* Navigate Tab - All Roles */}
          <button
            onClick={() => setMode('navigate')}
            className={`px-4 py-1.5 rounded-md font-medium transition-colors ${mode === 'navigate' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-300 hover:bg-slate-700'}`}
          >
            Navigate Protocol
          </button>

          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-1.5 border border-slate-600 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:border-slate-400 hover:bg-slate-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        {mode === 'admin' && <AdminDashboard isOnline={isOnline} />}
        {mode === 'builder' && <FlowBuilder />}
        {mode === 'navigate' && <NavigateMode isOnline={isOnline} />}
      </div>
    </div>
  )
}
