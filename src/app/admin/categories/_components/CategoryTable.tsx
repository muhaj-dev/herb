"use client";

import { useState, useMemo, useTransition } from "react";
import type { Category } from "@/lib/supabase/types";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/actions/category-actions";
import { useRouter } from "next/navigation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoryTable({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Add form state
  const [addName, setAddName] = useState("");
  const [addSlug, setAddSlug] = useState("");
  const [addIcon, setAddIcon] = useState("");
  const [addColor, setAddColor] = useState("");
  const [addOrder, setAddOrder] = useState("0");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editOrder, setEditOrder] = useState("0");

  const filtered = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  function resetAddForm() {
    setAddName("");
    setAddSlug("");
    setAddIcon("");
    setAddColor("");
    setAddOrder("0");
    setShowAdd(false);
    setError(null);
  }

  function startEdit(cat: Category) {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditIcon(cat.icon ?? "");
    setEditColor(cat.color ?? "");
    setEditOrder(String(cat.display_order));
    setError(null);
  }

  function cancelEdit() {
    setEditId(null);
    setError(null);
  }

  function handleAdd() {
    if (!addName.trim()) {
      setError("Category name is required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createCategory({
        name: addName.trim(),
        slug: addSlug.trim() || undefined,
        icon: addIcon.trim() || undefined,
        color: addColor.trim() || undefined,
        display_order: parseInt(addOrder) || 0,
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
      setError("Category name is required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updateCategory(editId!, {
        name: editName.trim(),
        slug: editSlug.trim() || slugify(editName.trim()),
        icon: editIcon.trim() || undefined,
        color: editColor.trim() || undefined,
        display_order: parseInt(editOrder) || 0,
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
      const result = await deleteCategory(id);
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
            placeholder="Search categories..."
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
          {showAdd ? "Cancel" : "Add Category"}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Data Table */}
      <div className="rounded-2xl border border-white/5 bg-[#162e1b] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Name</th>
                <th className="px-6 py-4 font-bold tracking-wider">Slug</th>
                <th className="px-6 py-4 font-bold tracking-wider">Icon</th>
                <th className="px-6 py-4 font-bold tracking-wider">Color</th>
                <th className="px-6 py-4 font-bold tracking-wider">Order</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Add Row */}
              {showAdd && (
                <tr className="bg-[#1a3320]/60">
                  <td className="px-6 py-3">
                    <input
                      className={inputClass}
                      placeholder="Category name"
                      value={addName}
                      onChange={(e) => {
                        setAddName(e.target.value);
                        if (!addSlug) setAddSlug("");
                      }}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      className={inputClass}
                      placeholder={addName ? slugify(addName) : "auto-generated"}
                      value={addSlug}
                      onChange={(e) => setAddSlug(e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      className={inputClass}
                      placeholder="e.g. spa"
                      value={addIcon}
                      onChange={(e) => setAddIcon(e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      className={inputClass}
                      placeholder="e.g. #13ec37"
                      value={addColor}
                      onChange={(e) => setAddColor(e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      className={inputClass}
                      type="number"
                      placeholder="0"
                      value={addOrder}
                      onChange={(e) => setAddOrder(e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={handleAdd}
                      disabled={isPending}
                      className="rounded-lg p-2 text-[#13ec37] hover:bg-[#13ec37]/10 transition-colors disabled:opacity-50"
                      title="Save"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isPending ? "hourglass_empty" : "check"}
                      </span>
                    </button>
                  </td>
                </tr>
              )}

              {/* Data Rows */}
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <span className="material-symbols-outlined text-4xl block mb-2 text-slate-600">
                      {query ? "search_off" : "category"}
                    </span>
                    {query
                      ? `No categories match "${query}"`
                      : "No categories found. Add one above."}
                  </td>
                </tr>
              ) : (
                filtered.map((cat) =>
                  editId === cat.id ? (
                    // Edit Row
                    <tr key={cat.id} className="bg-[#1a3320]/60">
                      <td className="px-6 py-3">
                        <input
                          className={inputClass}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          className={inputClass}
                          placeholder={slugify(editName)}
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          className={inputClass}
                          placeholder="e.g. spa"
                          value={editIcon}
                          onChange={(e) => setEditIcon(e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          className={inputClass}
                          placeholder="e.g. #13ec37"
                          value={editColor}
                          onChange={(e) => setEditColor(e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          className={inputClass}
                          type="number"
                          value={editOrder}
                          onChange={(e) => setEditOrder(e.target.value)}
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
                      key={cat.id}
                      className="group hover:bg-[#1c3b22] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {cat.icon && (
                            <div className="h-8 w-8 shrink-0 rounded-lg bg-white/10 flex items-center justify-center">
                              <span
                                className="material-symbols-outlined text-[18px]"
                                style={{ color: cat.color ?? "#13ec37" }}
                              >
                                {cat.icon}
                              </span>
                            </div>
                          )}
                          <span className="font-bold text-white">
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                        {cat.slug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                        {cat.icon ?? "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cat.color ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block w-4 h-4 rounded-full border border-white/20"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-slate-400">{cat.color}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                        {cat.display_order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {deleteConfirmId === cat.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-red-400 mr-2">
                              Delete?
                            </span>
                            <button
                              onClick={() => handleDelete(cat.id)}
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
                              onClick={() => startEdit(cat)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(cat.id)}
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
              categor{filtered.length !== 1 ? "ies" : "y"}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
