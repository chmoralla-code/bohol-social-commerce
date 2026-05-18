"use client"

import Navbar from "@/components/Navbar"
import { useState } from "react"
import { Github, Mail } from "lucide-react"

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <main className="min-h-screen pt-16 bg-black">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="premium-card p-8 rounded-2xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {isLogin ? "Welcome back" : "Create seller account"}
            </h1>
            <p className="text-muted text-sm font-light">
              {isLogin ? "Login to manage your storefront" : "Start selling your products in Bohol"}
            </p>
          </div>

          <div className="space-y-4">
            <button className="w-full py-3 bg-white text-black rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors">
              <Mail className="w-5 h-5" />
              Continue with Email
            </button>
            <button className="w-full py-3 border border-border rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-accent transition-colors">
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-[#0a0a0a] px-4 text-muted">Or</span>
            </div>
          </div>

          <div className="text-center text-white">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted hover:text-white transition-colors underline underline-offset-4"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
