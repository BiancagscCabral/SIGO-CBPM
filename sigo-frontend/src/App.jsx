import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Register from './components/Register'
import Login from './components/Login'

function App() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <>
      <Header/>
      {isLogin ? (
        <Login onRegister={() => setIsLogin(false)} />
      ) : (
        <Register onBackToLogin={() => setIsLogin(true)} />
      )}
    </>
  )
}

export default App
