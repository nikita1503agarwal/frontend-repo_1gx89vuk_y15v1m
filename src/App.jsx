import { useState } from 'react'
import Hero from './components/Hero'
import LinkForm from './components/LinkForm'
import LinkList from './components/LinkList'
import Account from './components/Account'

function App() {
  const [refreshToken, setRefreshToken] = useState(0)

  const onAdded = () => setRefreshToken(t => t + 1)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Hero />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-100">Your account</h2>
              <Account onChange={() => setRefreshToken(t => t + 1)} />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-100">Add a new link</h2>
              <LinkForm onAdded={onAdded} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-3 text-blue-100">Your links</h2>
            <LinkList refresh={refreshToken} />
          </div>
        </div>
        <footer className="pt-6 text-center text-blue-200/60 text-sm">
          Built for developers. Labels, clicks, popularity — all in one place.
        </footer>
      </div>
    </div>
  )
}

export default App
