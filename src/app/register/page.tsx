"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, Eye, EyeOff, Lock, Mail, User, Building2, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { signUp } from "@/lib/auth-client"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [workspaceName, setWorkspaceName] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Please fill out all required fields.")
      return
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.")
      return
    }

    setIsLoading(true)

    try {
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      if (result.error) {
        setErrorMessage(result.error.message || "Failed to create account. Please check your information.")
        setIsLoading(false)
        return
      }

      // If user supplied a custom workspace name, trigger workspace create or update
      if (workspaceName.trim()) {
        try {
          await fetch("/api/workspaces", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: workspaceName.trim() }),
          })
        } catch {
          // Non-blocking
        }
      }

      router.push("/")
      router.refresh()
    } catch (err: unknown) {
      console.error("Sign up error:", err)
      const msg = err instanceof Error ? err.message : "Failed to create account. Please ensure database is connected."
      setErrorMessage(msg)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

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
            Start managing client deliverables, approvals, and invoices in one place
          </p>
        </div>

        {/* Register Form Card */}
        <Card className="border border-border bg-card shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-bold text-foreground">Create your Agency Workspace</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Sign up with your work email to start inviting clients
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs leading-relaxed animate-in fade-in">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="size-3.5 text-muted-foreground" />
                  Full Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-10 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-muted-foreground" />
                  Agency / Workspace Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Acme Creative Agency"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  disabled={isLoading}
                  className="h-10 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                  Work Email Address *
                </label>
                <Input
                  type="email"
                  placeholder="alex@acmecreative.agency"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-10 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="size-3.5 text-muted-foreground" />
                  Password (min. 8 characters) *
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    minLength={8}
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
                    <span>Creating workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Workspace</span>
                    <ArrowRight className="size-4 ml-1.5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="border-t border-border bg-muted/30 py-3.5 flex justify-center text-xs text-muted-foreground">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="ml-1.5 font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

