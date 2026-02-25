import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, User, Eye, EyeOff, Scissors, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoggingIn } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ username, password });
      window.location.href = "/admin/leads";
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="ghost" size="sm" data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Site
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-rose-500 text-white mb-4">
            <Scissors className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-semibold mb-1" data-testid="text-login-title">Admin Portal</h1>
          <p className="text-muted-foreground text-sm">Hair Artistry Full Service Salon</p>
        </div>

        <Card className="p-6 shadow-xl border-border/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="pl-10"
                  autoComplete="username"
                  data-testid="input-username"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10 pr-10"
                  autoComplete="current-password"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2"
                data-testid="text-login-error"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-rose-500 hover:from-primary/90 hover:to-rose-500/90"
              disabled={isLoggingIn || !username || !password}
              data-testid="button-login"
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Authorized personnel only. Contact Nakisha for access.
        </p>
      </motion.div>
    </div>
  );
}
