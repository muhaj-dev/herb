"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { TeamMember } from "@/lib/supabase/types";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/lib/actions/team-actions";

export default function TeamTable({ members }: { members: TeamMember[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Add form state
  const [addName, setAddName] = useState("");
  const [addRole, setAddRole] = useState("");
  const [addBio, setAddBio] = useState("");
  const [addImage, setAddImage] = useState("");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editImage, setEditImage] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return members;
    const q = query.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.role && m.role.toLowerCase().includes(q))
    );
  }, [members, query]);

  function resetAddForm() {
    setAddName("");
    setAddRole("");
    setAddBio("");
    setAddImage("");
    setShowAdd(false);
    setError(null);
  }

  function startEdit(member: TeamMember) {
    setEditId(member.id);
    setEditName(member.name);
    setEditRole(member.role ?? "");
    setEditBio(member.bio ?? "");
    setEditImage(member.image ?? "");
    setError(null);
  }

  function cancelEdit() {
    setEditId(null);
    setError(null);
  }

  function handleAdd() {
    if (!addName.trim()) {
      setError("Member name is required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createTeamMember({
        name: addName.trim(),
        role: addRole.trim() || undefined,
        bio: addBio.trim() || undefined,
        image: addImage.trim() || undefined,
      });
      if ("error" in result) {
        setError(result.error);
      } else {
        resetAddForm();
        router.refresh();
      }
    });
  }

  function handleUpdate() {
    if (!editId || !editName.trim()) {
      setError("Member name is required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updateTeamMember(editId!, {
        name: editName.trim(),
        role: editRole.trim() || undefined,
        bio: editBio.trim() || undefined,
        image: editImage.trim() || undefined,
      });
      if ("error" in result) {
        setError(result.error);
      } else {
        cancelEdit();
        router.refresh();
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteTeamMember(id);
      if ("error" in result) {
        setError(result.error);
      } else {
        setDeleteConfirmId(null);
        router.refresh();
      }
    });
  }

  const inputClass =
    "w-full bg-[#112214] border border-[#234829] rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all text-sm";

  return (
    <>
      {/* Search & Add Button */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between rounded-xl sm:rounded-2xl bg-[#162e1b] p-3 sm:p-4 border border-white/5">
        <div className="relative w-full lg:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#13ec37]">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="block w-full rounded-lg border-none bg-[#234829]/50 py-3 pl-12 pr-4 text-white placeholder-[#13ec37]/60 focus:ring-2 focus:ring-[#13ec37] focus:bg-[#234829] transition-all"
            placeholder="Search team members..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            setShowAdd(!showAdd);
            setError(null);
          }}
          className="flex items-center gap-2 rounded-lg bg-[#13ec37] px-4 py-2 sm:px-6 sm:py-3 text-[#102213] font-bold text-sm sm:text-base hover:bg-[#13ec37]/90 transition-colors shadow-[0_0_15px_rgba(19,236,55,0.3)]"
        >
          <span className="material-symbols-outlined">
            {showAdd ? "close" : "add"}
          </span>
          {showAdd ? "Cancel" : "Add Member"}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Add Form (expanded card) */}
      {showAdd && (
        <div className="rounded-2xl border border-[#13ec37]/20 bg-[#1a3320] p-4 sm:p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#13ec37]">
              person_add
            </span>
            New Team Member
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                className={inputClass}
                placeholder="Full name"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Role
              </label>
              <input
                className={inputClass}
                placeholder="e.g. Herbalist, Researcher"
                value={addRole}
                onChange={(e) => setAddRole(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Bio
              </label>
              <textarea
                className={`${inputClass} min-h-[80px]`}
                placeholder="Short biography..."
                value={addBio}
                onChange={(e) => setAddBio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Image URL
              </label>
              <input
                className={inputClass}
                placeholder="https://example.com/photo.jpg"
                value={addImage}
                onChange={(e) => setAddImage(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-3">
            <button
              onClick={resetAddForm}
              className="text-slate-400 hover:text-white font-medium px-4 py-2 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={isPending}
              className="bg-[#13ec37] hover:bg-[#13ec37]/90 disabled:opacity-50 disabled:cursor-not-allowed text-[#102213] font-bold py-2 px-6 rounded-lg text-sm transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPending ? "hourglass_empty" : "check"}
              </span>
              {isPending ? "Saving..." : "Save Member"}
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="rounded-2xl border border-white/5 bg-[#162e1b] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Photo</th>
                <th className="px-6 py-4 font-bold tracking-wider">Name</th>
                <th className="px-6 py-4 font-bold tracking-wider">Role</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <span className="material-symbols-outlined text-4xl block mb-2 text-slate-600">
                      {query ? "search_off" : "group"}
                    </span>
                    {query
                      ? `No members match "${query}"`
                      : "No team members found. Add one above."}
                  </td>
                </tr>
              ) : (
                filtered.map((member) =>
                  editId === member.id ? (
                    // Edit Row
                    <tr key={member.id} className="bg-[#1a3320]/60">
                      <td className="px-6 py-3">
                        <input
                          className={inputClass}
                          placeholder="Image URL"
                          value={editImage}
                          onChange={(e) => setEditImage(e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          className={inputClass}
                          placeholder="Name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          className={inputClass}
                          placeholder="Role"
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={handleUpdate}
                            disabled={isPending}
                            className="rounded-lg p-2 text-[#13ec37] hover:bg-[#13ec37]/10 transition-colors disabled:opacity-50"
                            title="Save"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {isPending ? "hourglass_empty" : "check"}
                            </span>
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            title="Cancel"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              close
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Display Row
                    <tr
                      key={member.id}
                      className="group hover:bg-[#1c3b22] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/10">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-500">
                              <span className="material-symbols-outlined text-[20px]">
                                person
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-bold text-white group-hover:text-[#13ec37] transition-colors">
                            {member.name}
                          </div>
                          {member.bio && (
                            <div className="text-xs text-slate-400 max-w-xs truncate">
                              {member.bio}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.role ? (
                          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border bg-purple-900/40 text-purple-200 border-purple-800">
                            {member.role}
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {deleteConfirmId === member.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-red-400 mr-2">
                              Delete?
                            </span>
                            <button
                              onClick={() => handleDelete(member.id)}
                              disabled={isPending}
                              className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                              title="Confirm delete"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                {isPending ? "hourglass_empty" : "check"}
                              </span>
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                              title="Cancel"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                close
                              </span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(member)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(member.id)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                delete
                              </span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="border-t border-white/10 bg-white/5 px-6 py-4">
            <p className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-bold text-white">{filtered.length}</span>{" "}
              member{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
