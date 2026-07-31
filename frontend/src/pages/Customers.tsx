import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllCustomersApi,
  createCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
} from "../api/customerApi";
import { type ICustomer } from "../types";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Modal from "../components/UI/Modal";
import Loader from "../components/UI/Loader";
import Badge from "../components/UI/Badge";

const emptyForm = { name: "", email: "", phone: "", company: "", status: "Active" };

const Customers = () => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ICustomer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getAllCustomersApi();
      const data = (res.data as any).data || res.data.value || [];
      setCustomers(data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (customer: ICustomer) => {
    setEditing(customer);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      status: customer.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateCustomerApi(editing._id, form);
        toast.success("Customer updated");
      } else {
        await createCustomerApi(form);
        toast.success("Customer created");
      }
      setModalOpen(false);
      fetchCustomers();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this customer?")) return;
    try {
      await deleteCustomerApi(id);
      toast.success("Customer deleted");
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not delete customer");
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full rounded-lg py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Add Customer
        </Button>
      </div>

      {loading ? (
        <Loader label="Loading customers" />
      ) : filtered.length === 0 ? (
        <Card className="text-center text-slate-500 py-12">No customers found.</Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3.5 font-medium">Name</th>
                <th className="px-5 py-3.5 font-medium">Email</th>
                <th className="px-5 py-3.5 font-medium">Phone</th>
                <th className="px-5 py-3.5 font-medium">Company</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c._id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5 text-slate-200 font-medium">{c.name}</td>
                  <td className="px-5 py-3.5 text-slate-400">{c.email}</td>
                  <td className="px-5 py-3.5 text-slate-400">{c.phone}</td>
                  <td className="px-5 py-3.5 text-slate-400">{c.company}</td>
                  <td className="px-5 py-3.5">
                    <Badge label={c.status || "Active"} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-teal-300 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Customer" : "Add Customer"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="glass-input rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <Button type="submit" loading={saving} className="w-full mt-1">
            {editing ? "Save changes" : "Create customer"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
