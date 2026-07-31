import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllDealsApi,
  createDealApi,
  updateDealApi,
  deleteDealApi,
} from "../api/dealApi";
import { getAllCustomersApi } from "../api/customerApi";
import { type IDeal, type ICustomer, type DealStage } from "../types";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Modal from "../components/UI/Modal";
import Loader from "../components/UI/Loader";

const stages: DealStage[] = ["Lead", "Qualified", "Proposal", "Won", "Lost"];

const stageAccent: Record<DealStage, string> = {
  Lead: "#94a3b8",
  Qualified: "#60a5fa",
  Proposal: "#fbbf24",
  Won: "#2dd4bf",
  Lost: "#f87171",
};

const emptyForm = { title: "", value: "", stage: "Lead" as DealStage, customerId: "" };

const Deals = () => {
  const [deals, setDeals] = useState<IDeal[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IDeal | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dealsRes, customersRes] = await Promise.all([
        getAllDealsApi(),
        getAllCustomersApi(),
      ]);
      setDeals((dealsRes.data.value as IDeal[]) || []);
      const custData = (customersRes.data as any).data || customersRes.data.value || [];
      setCustomers(custData);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not load deals");
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

  const openEdit = (deal: IDeal) => {
    setEditing(deal);
    setForm({
      title: deal.title,
      value: String(deal.value),
      stage: deal.stage,
      customerId: deal.customerId,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, value: Number(form.value) };
      if (editing) {
        await updateDealApi(editing._id, payload);
        toast.success("Deal updated");
      } else {
        await createDealApi(payload);
        toast.success("Deal created");
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
    if (!confirm("Delete this deal?")) return;
    try {
      await deleteDealApi(id);
      toast.success("Deal deleted");
      setDeals((prev) => prev.filter((d) => d._id !== id));
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not delete deal");
    }
  };

  const quickStageChange = async (deal: IDeal, stage: DealStage) => {
    try {
      await updateDealApi(deal._id, { stage });
      setDeals((prev) => prev.map((d) => (d._id === deal._id ? { ...d, stage } : d)));
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not update stage");
    }
  };

  if (loading) return <Loader label="Loading deals" />;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {deals.length} deal{deals.length !== 1 && "s"} across the pipeline
        </p>
        <Button onClick={openCreate}>
          <Plus size={16} /> Add Deal
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage);
          const totalValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
          return (
            <div key={stage} className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: stageAccent[stage] }}
                  />
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {stage}
                  </span>
                </div>
                <span className="text-xs text-slate-600">{stageDeals.length}</span>
              </div>
              <p className="px-1 -mt-2 text-[11px] text-slate-600 font-mono">
                ₹{totalValue.toLocaleString("en-IN")}
              </p>

              <div className="flex flex-col gap-2 min-h-[60px]">
                {stageDeals.map((deal) => (
                  <Card key={deal._id} className="p-3.5 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-200 leading-snug">
                        {deal.title}
                      </p>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => openEdit(deal)}
                          className="rounded p-1 text-slate-500 hover:bg-white/5 hover:text-teal-300"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(deal._id)}
                          className="rounded p-1 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="flex items-center gap-1 text-xs font-mono text-teal-400">
                      <IndianRupee size={11} />
                      {deal.value?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {customerName(deal.customerId)}
                    </p>
                    <select
                      value={deal.stage}
                      onChange={(e) => quickStageChange(deal, e.target.value as DealStage)}
                      className="mt-1 w-full rounded-md border border-white/10 bg-navy-800/80 px-2 py-1 text-[11px] text-slate-300"
                    >
                      {stages.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Deal" : "Add Deal"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            label="Value (₹)"
            type="number"
            min={0}
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
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
              Stage
            </label>
            <select
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value as DealStage })}
              className="glass-input rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
            >
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" loading={saving} className="w-full mt-1">
            {editing ? "Save changes" : "Create deal"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Deals;
