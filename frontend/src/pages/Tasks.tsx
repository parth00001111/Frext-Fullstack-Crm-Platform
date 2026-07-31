import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "../api/taskApi";
import { getAllCustomersApi } from "../api/customerApi";
import { type ITask, type ICustomer, type TaskStatus } from "../types";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Modal from "../components/UI/Modal";
import Loader from "../components/UI/Loader";
import Badge from "../components/UI/Badge";

const emptyForm = { title: "", dueDate: "", status: "Pending" as TaskStatus, customerId: "" };

const Tasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ITask | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"All" | TaskStatus>("All");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, customersRes] = await Promise.all([
        getAllTasksApi(),
        getAllCustomersApi(),
      ]);
      setTasks((tasksRes.data.value as ITask[]) || []);
      const custData = (customersRes.data as any).data || customersRes.data.value || [];
      setCustomers(custData);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const customerName = (id: string) =>
    customers.find((c) => c._id === id)?.name || "Unknown";

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (task: ITask) => {
    setEditing(task);
    setForm({
      title: task.title,
      dueDate: task.dueDate?.slice(0, 10) || "",
      status: task.status,
      customerId: task.customerId,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateTaskApi(editing._id, form);
        toast.success("Task updated");
      } else {
        await createTaskApi(form);
        toast.success("Task created");
      }
      setModalOpen(false);
      fetchData();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTaskApi(id);
      toast.success("Task deleted");
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not delete task");
    }
  };

  const toggleStatus = async (task: ITask) => {
    const newStatus: TaskStatus = task.status === "Pending" ? "Completed" : "Pending";
    try {
      await updateTaskApi(task._id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not update task");
    }
  };

  const filtered = tasks.filter((t) => filter === "All" || t.status === filter);

  if (loading) return <Loader label="Loading tasks" />;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["All", "Pending", "Completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
                filter === f
                  ? "bg-teal-500/15 text-teal-300 border-teal-500/30"
                  : "text-slate-400 border-white/10 hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Add Task
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center text-slate-500 py-12">No tasks found.</Card>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((task) => (
            <Card key={task._id} className="flex items-center gap-4 p-4">
              <button
                onClick={() => toggleStatus(task)}
                className={task.status === "Completed" ? "text-teal-400" : "text-slate-500 hover:text-teal-300"}
              >
                {task.status === "Completed" ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    task.status === "Completed" ? "text-slate-500 line-through" : "text-slate-200"
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-xs text-slate-500">
                  {customerName(task.customerId)} &middot; Due{" "}
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-IN") : "—"}
                </p>
              </div>

              <Badge label={task.status} />

              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(task)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-teal-300 transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Task" : "Add Task"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            label="Due date"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              Customer
            </label>
            <select
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              className="glass-input rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
              required
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
              className="glass-input rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <Button type="submit" loading={saving} className="w-full mt-1">
            {editing ? "Save changes" : "Create task"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
