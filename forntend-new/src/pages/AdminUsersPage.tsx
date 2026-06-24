import { useState, useEffect } from "react";
import { TrashIcon, ProhibitIcon, CheckCircleIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { adminApi } from "../services/api.ts";
import type { UserIcon } from "../types/index.ts";
import ConfirmModal from "../components/ui/ConfirmModal.tsx";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionTarget, setActionTarget] = useState<UserIcon | null>(null);
  const [actionType, setActionType] = useState<"ban" | "unban" | "delete" | null>(null);
  const [processing, setProcessing] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.getUsers().then((res) => setUsers(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAction = async () => {
    if (!actionTarget || !actionType) return;
    setProcessing(true);
    try {
      if (actionType === "ban") await adminApi.updateUserStatus(actionTarget.id, "banned");
      else if (actionType === "unban") await adminApi.updateUserStatus(actionTarget.id, "active");
      else if (actionType === "delete") await adminApi.deleteUser(actionTarget.id);
      load();
    } catch {
      alert("Action failed.");
    } finally {
      setProcessing(false);
      setActionTarget(null);
      setActionType(null);
    }
  };

  const confirmLabel = actionType === "delete" ? "Delete" : actionType === "ban" ? "Ban" : "Unban";

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeftIcon size={20} className="text-primary cursor-pointer" onClick={() => window.history.back()} />
          <h1 className="text-[2rem] font-bold text-primary">Manage UsersIcon</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-[#888]">Loading...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-[#f0f0f0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="text-left p-4 text-[0.7rem] font-bold text-[#888] uppercase tracking-wide">ID</th>
                    <th className="text-left p-4 text-[0.7rem] font-bold text-[#888] uppercase tracking-wide">Name</th>
                    <th className="text-left p-4 text-[0.7rem] font-bold text-[#888] uppercase tracking-wide">Email</th>
                    <th className="text-left p-4 text-[0.7rem] font-bold text-[#888] uppercase tracking-wide">NIM</th>
                    <th className="text-left p-4 text-[0.7rem] font-bold text-[#888] uppercase tracking-wide">Role</th>
                    <th className="text-left p-4 text-[0.7rem] font-bold text-[#888] uppercase tracking-wide">Status</th>
                    <th className="text-left p-4 text-[0.7rem] font-bold text-[#888] uppercase tracking-wide">Major</th>
                    <th className="text-left p-4 text-[0.7rem] font-bold text-[#888] uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-[#f3f4f6] hover:bg-[#fafafa]">
                      <td className="p-4 text-[0.85rem]">{u.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-[32px] h-[32px] rounded-full bg-[#a7f3d0] flex items-center justify-center text-[0.7rem] font-bold text-[#111]">
                            {u.name.charAt(0)}
                          </div>
                          <span className="text-[0.85rem] font-semibold">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[0.85rem]">{u.email}</td>
                      <td className="p-4 text-[0.85rem]">{u.nim || "—"}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold ${
                          u.role === "admin" ? "bg-purple-50 text-purple-700" :
                          u.role === "recruiter" ? "bg-blue-50 text-blue-700" :
                          "bg-green-50 text-green-700"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold ${
                          u.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-[0.85rem]">{u.major || "—"}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {u.status === "active" ? (
                            <button
                              onClick={() => { setActionTarget(u); setActionType("ban"); }}
                              className="bg-amber-50 text-amber-700 border-none px-3 py-1.5 rounded-lg text-[0.75rem] font-semibold flex items-center gap-1 cursor-pointer hover:bg-amber-100"
                            >
                              <ProhibitIcon size={12} /> Ban
                            </button>
                          ) : (
                            <button
                              onClick={() => { setActionTarget(u); setActionType("unban"); }}
                              className="bg-green-50 text-green-700 border-none px-3 py-1.5 rounded-lg text-[0.75rem] font-semibold flex items-center gap-1 cursor-pointer hover:bg-green-100"
                            >
                              <CheckCircleIcon size={12} /> Unban
                            </button>
                          )}
                          <button
                            onClick={() => { setActionTarget(u); setActionType("delete"); }}
                            className="bg-red-50 text-red-600 border-none px-3 py-1.5 rounded-lg text-[0.75rem] font-semibold flex items-center gap-1 cursor-pointer hover:bg-red-100"
                          >
                            <TrashIcon size={12} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && <p className="text-center py-10 text-[#888]">No users found.</p>}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!actionTarget}
        title={`${confirmLabel} UserIcon`}
        message={`Are you sure you want to ${actionType === "delete" ? "permanently delete" : actionType === "ban" ? "ban" : "unban"} "${actionTarget?.name}"?${actionType === "delete" ? " This will remove all their projects, skills, endorsements, and collaboration requests." : ""}`}
        confirmLabel={confirmLabel}
        cancelLabel="Cancel"
        onConfirm={handleAction}
        onCancel={() => { setActionTarget(null); setActionType(null); }}
        loading={processing}
      />
    </DashboardLayout>
  );
}
