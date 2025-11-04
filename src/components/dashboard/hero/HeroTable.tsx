"use client";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Sortable from "sortablejs";
import { toast } from "sonner";
import { CopyIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import SlideFormDialog from "./SlideFormDialog";

type Slide = any;

export default function HeroTable() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    const r = await fetch("/api/hero-slides");
    const data = await r.json();
    setSlides(data);
  }

  useEffect(() => {
    const el = document.getElementById("sortableBody");
    if (!el) return;
    const sortable = Sortable.create(el, {
      animation: 150,
      handle: ".drag-handle",
      onEnd: async () => {
        const newOrder = Array.from(el.children).map((row, idx) => ({
          id: row.getAttribute("data-id"),
          order: idx,
        }));
        await fetch("/api/hero-slides-reorder", {
          method: "POST",
          body: JSON.stringify(newOrder),
        });
        toast.success("Order saved");
        fetchSlides();
      },
    });
    return () => sortable.destroy();
  }, [slides]);

  async function deleteSlide(id: string) {
    if (!confirm("Delete slide?")) return;
    await fetch(`/api/hero-slides/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    fetchSlides();
  }

  async function duplicateSlide(id: string) {
    await fetch("/api/hero-slides/duplicate", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    toast.success("Duplicated");
    fetchSlides();
  }

  async function togglePublish(id: string, publish: boolean) {
    await fetch("/api/hero-slides/publish", {
      method: "POST",
      body: JSON.stringify({ id, publish }),
    });
    fetchSlides();
  }

  return (
    <>
      <div className="flex relative justify-between items-center mb-4">
        <div className="text-sm text-gray-600">Manage slides</div>
        <Dialog.Root open={openCreate} onOpenChange={setOpenCreate}>
          <Dialog.Trigger className="inline-flex items-center gap-2 bg-luxury-500 text-white px-3 py-2 rounded">
            <PlusIcon /> New Slide
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content className="fixed sm:ml-24 ml-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow w-full max-w-[720px] sm:w-[720px]">
              <Dialog.Title className="text-lg font-semibold mb-2">
                Create Slide
              </Dialog.Title>
              <SlideFormDialog
                onSaved={() => {
                  setOpenCreate(false);
                  fetchSlides();
                }}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Preview</th>
              <th className="p-3">Title</th>
              <th className="p-3 text-center">Published</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((s) => (
              <tr
                key={s.id}
                data-id={s.id}
                className="border-b text-center hover:bg-gray-50"
              >
                <td className="p-3 text-sm text-center text-gray-500">
                  {s.order}
                </td>
                <td className="p-3 text-center items-center">
                  <img
                    src={s.imageUrl}
                    className="w-28 h-16 items-center object-cover rounded"
                    alt=""
                  />
                </td>
                <td className="p-3">{s.title}</td>
                <td className="p-3 text-center">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={s.published}
                      onChange={() => togglePublish(s.id, !s.published)}
                    />
                  </label>
                </td>
                <td className="p-3 text-right space-x-4">
                  <button
                    onClick={() => {
                      setEditing(s);
                    }}
                  >
                    <PencilIcon />
                  </button>
                  <button onClick={() => deleteSlide(s.id)}>
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit dialog */}
      <Dialog.Root open={!!editing} onOpenChange={() => setEditing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow w-full max-w-[720px] sm:w-[720px]">
            <Dialog.Title className="text-lg font-semibold mb-2">
              Edit Slide
            </Dialog.Title>
            {editing && (
              <SlideFormDialog
                slide={editing}
                onSaved={() => {
                  setEditing(null);
                  fetchSlides();
                }}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
