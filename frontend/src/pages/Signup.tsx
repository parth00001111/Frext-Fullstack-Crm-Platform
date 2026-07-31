import React, { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { type Role } from "../types";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Sales");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await signup(name, email, password, role);
    setLoading(false);
    if (success) navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-glow">
            <Zap size={22} className="text-navy-950" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-slate-100">
            Create your account
          </h1>
          <p className="text-sm text-slate-500">Join the Frext workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 flex flex-col gap-4">
          <Input
            label="Full name"
            placeholder="Parth Mahajan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={3}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="glass-input rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
            >
              <option value="Sales">Sales</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <Button type="submit" loading={loading} className="w-full mt-2">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
