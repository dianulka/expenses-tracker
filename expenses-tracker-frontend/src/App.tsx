import { Button } from './components/ui/button'
import './App.css'

import Login from './pages/Login'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import SubscribtionList from './pages/SubscribtionList'
import Navbar from './pages/Navbar'
import { useLocation } from 'react-router-dom'
import RequireAuth from './pages/RequireAuth'
import { useState } from 'react'
import { type Subscription } from './pages/SubscribtionList'
function App() {


  const location = useLocation()
  const hideNavbarOn = ['/login', '/register']
  

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  return (
    <>
    
     {!hideNavbarOn.includes(location.pathname) && <Navbar setSubscriptions={setSubscriptions}/>}
     <main className="max-w-5xl mx-auto px-4 py-6 w-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<RequireAuth/>}>
            <Route path="/" element={<SubscribtionList
             subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}/>} />
          </Route>
        </Routes>
      </main>
    </>
  )
}

export default App
