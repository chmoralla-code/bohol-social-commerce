"use client"

import Navbar from "@/components/Navbar"
import { useState, Suspense } from "react"
import { Github, Mail, Loader2, AlertCircle } from "lucide-react"
import { login, signup, signInWithGithub } from "./actions"
import { useSearchParams } from "next/navigation"

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const message = searchParams.get("message")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    if (isLogin) {
      await login(formData)
    } else {
      await signup(formData)
    }
    setLoading(false)
  }

  return (
    <div className="premium-card p-8 rounded-2xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {isLogin ? "Welcome back" : "Create seller account"}
        </h1>
        <p className="text-muted text-sm font-light">
          {isLogin ? "Login to manage your storefront" : "Start selling your products in Bohol"}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-500 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {message && (
        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-center gap-3 text-green-500 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{message}</p>
        </div>
      )}

      {!showEmailForm ? (
        <div className="space-y-4">
          <button 
            onClick={() => setShowEmailForm(true)}
            className="w-full py-3 bg-white text-black rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors"
          >
            <Mail className="w-5 h-5" />
            Continue with Email
          </button>
          <button 
            onClick={() => signInWithGithub()}
            className="w-full py-3 border border-border rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-accent transition-colors"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
        </div>
      ) : (
        <form action={handleSubmit as any} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted font-bold ml-1">Email</label>
            <input 
              name="email"
              type="email" 
              required
              className="w-full bg-accent border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-white/30 transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted font-bold ml-1">Password</label>
            <input 
              name="password"
              type="password" 
              required
              className="w-full bg-accent border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-white/30 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-3 bg-white text-black rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLogin ? "Sign In" : "Create Account"}
          </button>
          <button 
            type="button"
            onClick={() => setShowEmailForm(false)}
            className="w-full text-xs text-muted hover:text-white transition-colors"
          >
            Go back to social login
          </button>
        </form>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-[#0a0a0a] px-4 text-muted">Or</span>
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={() => {
            setIsLogin(!isLogin)
            setShowEmailForm(false)
          }}
          className="text-sm text-muted hover:text-white transition-colors underline underline-offset-4"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <main className="min-h-screen pt-16 bg-black">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-24">
        <Suspense fallback={
          <div className="premium-card p-8 rounded-2xl flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-muted" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
