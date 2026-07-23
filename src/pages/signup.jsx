import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeContext'



const Signup = () => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  

  const handleChange = (e) => {
    const { name, value } = e.target
    const nextForm = { ...form, [name]: value }
    
    setForm(nextForm)
  }

  const handleSubmit =  async (e) => {
    e.preventDefault()
    console.log('Signup form values:', form)
    const { name, email, password } = form;
    if (!form.name || !form.email || !form.password) {
      setMessage('Please fill in all required fields.')
      return
    }
    try {
        const url = 'http://localhost:8080/auth/signup'
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        })
        const result = await response.json()
        const { message: responseMessage, success } = result

        if (success) {
          setMessage('Account created successfully! Please log in.')
          setTimeout(() => navigate('/login'), 1000)
        } else {
          setMessage(responseMessage || 'Signup failed. Please try again.')
        }

        console.log('Signup response:', result)
    } catch (err) {
      console.error('Error during signup:', err)
      setMessage('An error occurred during signup. Please try again.')
    }
  }
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-insta-bg">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '-3s' }}></div>

      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => toggleTheme()}
          className="p-3 rounded-full glass-panel hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="w-full max-w-[400px] p-8 glass-panel rounded-2xl shadow-2xl relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 italic">
            Prev
          </h1>
          <p className="text-xs text-insta-muted mt-2 font-medium">Join us today! Create a new account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold tracking-wider uppercase text-insta-muted pl-1">Full Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="USER 1"
              className="w-full px-4 py-2.5 text-xs rounded-xl input-insta outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold tracking-wider uppercase text-insta-muted pl-1">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 text-xs rounded-xl input-insta outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold tracking-wider uppercase text-insta-muted pl-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 text-xs rounded-xl input-insta outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 px-4 rounded-xl text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] insta-gradient shadow-lg hover:shadow-indigo-500/20"
          >
            Get Started
          </button>
        </form>

        {message && (
          <div className={`mt-4 text-center text-xs font-semibold p-3 rounded-xl ${message.includes('successfully') ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="w-full max-w-[400px] p-5 glass-panel rounded-2xl mt-4 relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <p className="text-xs font-medium text-insta-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-insta-blue font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-12 text-[10px] flex flex-wrap justify-center gap-x-6 gap-y-2 uppercase font-semibold text-insta-muted tracking-wider relative z-10">
        <span className="hover:text-insta-strong cursor-pointer transition-colors">About</span>
        <span className="hover:text-insta-strong cursor-pointer transition-colors">Blog</span>
        <span className="hover:text-insta-strong cursor-pointer transition-colors">Jobs</span>
        <span className="hover:text-insta-strong cursor-pointer transition-colors">Help</span>
        <span className="hover:text-insta-strong cursor-pointer transition-colors">API</span>
        <span className="hover:text-insta-strong cursor-pointer transition-colors">Privacy</span>
        <span className="hover:text-insta-strong cursor-pointer transition-colors">Terms</span>
      </div>
      <p className="mt-4 text-[9px] uppercase tracking-widest text-insta-muted font-bold relative z-10">
        © 2026 APPLOGO FROM METAVERSO
      </p>
    </div>
  )
}

export default Signup;
