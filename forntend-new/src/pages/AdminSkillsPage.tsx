import { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { adminApi } from "../services/api.ts";
import type { SkillCategory } from "../types/index.ts";
import ConfirmModal from "../components/ui/ConfirmModal.tsx";

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SkillCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.getSkillCategories().then((res) => setCategories(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!name || !description) return;
    setCreating(true);
    try {
      const res = await adminApi.createSkillCategory({ name, description });
      setCategories((prev) => [...prev, res.data]);
      setName("");
      setDescription("");
      setShowForm(false);
    } catch {
      alert("Failed to create skill category.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteSkillCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    } catch {
      alert("Failed to delete skill category.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[800px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeftIcon size={20} className="text-primary cursor-pointer" onClick={() => window.history.back()} />
          <h1 className="text-[2rem] font-bold text-primary">Manage Skill Categories</h1>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white border-none px-5 py-3 rounded-lg font-semibold flex items-center gap-2 text-[0.9rem] cursor-pointer mb-7"
        >
          <PlusIcon size={18} /> Add Skill Category
        </button>

        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f0] mb-7">
            <h3 className="text-[1rem] font-bold text-primary mb-5">New Skill Category</h3>
            <div className="mb-4">
              <label className="block text-[0.75rem] font-bold text-[#333] mb-2">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Web Development"
                className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none"
              />
            </div>
            <div className="mb-5">
              <label className="block text-[0.75rem] font-bold text-[#333] mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this skill category..."
                className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none h-[80px] resize-y"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowForm(false); setName(""); setDescription(""); }}
                className="bg-none border-none text-[#555] font-semibold text-[0.9rem] cursor-pointer px-3.5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name || !description || creating}
                className="bg-primary text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20 text-[#888]">Loading...</div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-xl p-5 shadow-sm border border-[#f0f0f0] flex items-center justify-between">
                <div>
                  <h3 className="text-[0.95rem] font-bold text-[#111]">{cat.name}</h3>
                  <p className="text-[0.8rem] text-[#666]">{cat.description}</p>
                </div>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="bg-red-50 text-red-600 border-none p-2.5 rounded-lg cursor-pointer hover:bg-red-100"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            ))}
            {categories.length === 0 && <p className="text-center py-10 text-[#888]">No skill categories yet.</p>}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Skill Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All user skills linked to this category will also be removed.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </DashboardLayout>
  );
}
