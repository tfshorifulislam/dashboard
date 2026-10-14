"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { signIn } from "@/lib/auth-client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both your email address and password.")
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn.email({
        email: email.trim(),
        password,
      })

      if (result.error) {
        setErrorMessage(result.error.message || "Invalid credentials. Please check your email and password.")
        setIsLoading(false)
        return
      }

      router.push("/")
      router.refresh()
    } catch (err: unknown) {
      console.error("Sign in error:", err)
      const msg = err instanceof Error ? err.message : "Failed to connect to authentication service."
      setErrorMessage(msg)
      setIsLoading(false)
    }
  }

  const handleFillDemo = () => {
    setEmail("alex@clientspace.design")
    setPassword("AgencyPro2026!")
    setErrorMessage(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#14265C] via-[#2447A8] to-[#4778F5] text-white shadow-lg shadow-blue-950/30 border border-white/20">
            <Sparkles className="size-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            ClientSpace
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
            Client portal platform for modern freelancers and design agencies
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="border border-border bg-card shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-bold text-foreground">Sign in to your account</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Enter your credentials to access your client projects and deliverables
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs leading-relaxed animate-in fade-in">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="alex@clientspace.design"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-10 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Lock className="size-3.5 text-muted-foreground" />
                    Password
                  </label>
                  <span className="text-[11px] text-muted-foreground hover:text-primary cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-10 text-xs sm:text-sm pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-gradient-to-r from-[#14265C] via-[#2447A8] to-[#3B66D4] hover:from-[#0E1B42] hover:to-[#2F55B8] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="size-4 ml-1.5" />
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Fill Helper */}
            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full text-center py-2 px-3 rounded-lg border border-dashed border-border hover:bg-muted/60 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                <span>Fill Development Credentials (Alex Morgan)</span>
              </button>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border bg-muted/30 py-3.5 flex justify-center text-xs text-muted-foreground">
            <span>Don&apos;t have an account yet?</span>
            <Link
              href="/register"
              className="ml-1.5 font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Create Agency Workspace
            </Link>
          </CardFooter>
        </Card>

        {/* Back to Home / Guest Preview */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Dashboard Overview
          </Link>
        </div>
      </div>
    </div>
  )
}

