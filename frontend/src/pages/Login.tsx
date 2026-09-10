import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { FrextBrand } from "./Landing";
import "./landing.css";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true);
    try { if (await login(email, password)) navigate("/dashboard", { replace: true }); }
    finally { setBusy(false); }
  }
  return <div className="frext-public"><header className="frext-header frext-wrap"><FrextBrand/><Link className="frext-nav-login" to="/"><ArrowLeft size={14}/> Back to overview</Link></header><main className="frext-login"><div className="frext-login-card"><p className="frext-eyebrow">WORKSPACE ACCESS</p><h1>Welcome back.</h1><p>Sign in to manage your customers, deals, and team activity.</p><form onSubmit={submit}><label>Email address<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required /></label><button className="frext-button" disabled={busy} type="submit">{busy ? "Signing in�" : "Sign in"}<ArrowRight size={16}/></button></form><p className="frext-login-help">Need access? Contact your workspace administrator for an account.</p></div></main></div>;
}
