import React, { useEffect, useState } from "react";
import {
  Users,
  Handshake,
  CheckSquare,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { getDashboardApi } from "../api/dashboardApi";
import { type IDashboardStats } from "../types";
import Card from "../components/UI/Card";
import Loader from "../components/UI/Loader";
import toast from "react-hot-toast";

const StatCard = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) => (
  <Card className="flex items-center gap-4">
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
      style={{ backgroundColor: `${accent}1a`, color: accent }}
    >
      <Icon size={20} />
    </div>
    <div>
      <p className="text-2xl font-display font-semibold text-slate-100">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  </Card>
);

const COLORS = ["#2dd4bf", "#f87171"];

const Dashboard = () => {
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getDashboardApi();
        if (res.data.success) setStats(res.data.value as IDashboardStats);
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Could not load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader label="Loading dashboard" />;
  if (!stats) return <p className="text-slate-500">No dashboard data available.</p>;

  const dealsPie = [
    { name: "Won", value: stats.wonDeals },
    { name: "Lost", value: stats.lostDeals },
  ];

  const taskBar = [
    { name: "Pending", value: stats.pendingTask },
    { name: "Completed", value: stats.completedTask },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Customers" value={stats.totalCustomers} accent="#2dd4bf" />
        <StatCard icon={Handshake} label="Total Deals" value={stats.totalDeals} accent="#60a5fa" />
        <StatCard icon={CheckSquare} label="Total Tasks" value={stats.totalTasks} accent="#fbbf24" />
        <StatCard icon={Users} label="Team Members" value={stats.totalUsers} accent="#c084fc" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Won Deals" value={stats.wonDeals} accent="#2dd4bf" />
        <StatCard icon={TrendingDown} label="Lost Deals" value={stats.lostDeals} accent="#f87171" />
        <StatCard icon={Clock} label="Pending Tasks" value={stats.pendingTask} accent="#fbbf24" />
        <StatCard icon={CheckCircle2} label="Completed Tasks" value={stats.completedTask} accent="#2dd4bf" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="mb-4 font-display text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Deals Won vs Lost
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={dealsPie}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
              >
                {dealsPie.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#0f1524",
                  border: "1px solid rgba(45,212,191,0.2)",
                  borderRadius: 8,
                  color: "#e6ebf5",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Task Status
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={taskBar}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2740" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "#0f1524",
                  border: "1px solid rgba(45,212,191,0.2)",
                  borderRadius: 8,
                  color: "#e6ebf5",
                }}
              />
              <Bar dataKey="value" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
