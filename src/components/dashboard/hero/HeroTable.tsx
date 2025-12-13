"use client";

import { useEffect, useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Sortable from "sortablejs";
import { toast } from "sonner";
import {
  Pencil,
  Plus,
  Trash2,
  GripVertical,
  Loader2,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import SlideFormDialog from "./SlideFormDialog";

// Define strict type for safety
type Slide = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  order: number;
  published: boolean;
};

export default function HeroTable() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Ref for the sortable container
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    try {
      setIsLoading(true);
      const r = await fetch("/api/hero-slides");
      if (!r.ok) throw new Error("Failed to fetch");
      const data = await r.json();
      // Ensure we sort by order locally immediately
      const sorted = data.sort((a: Slide, b: Slide) => a.order - b.order);
      setSlides(sorted);
    } catch (e) {
      toast.error("Could not load slides");
    } finally {
      setIsLoading(false);
    }
  }

  // Initialize SortableJS
  useEffect(() => {
    if (!tableBodyRef.current || isLoading) return;

    const sortable = Sortable.create(tableBodyRef.current, {
      animation: 150,
      handle: ".drag-handle", // Only drag using the grip icon
      ghostClass: "bg-muted/50",
      onEnd: async () => {
        if (!tableBodyRef.current) return;

        // Create new order array
        const newOrder = Array.from(tableBodyRef.current.children).map(
          (row, idx) => ({
            id: row.getAttribute("data-id"),
            order: idx + 1, // 1-based index
          })
        );

        // Optimistic UI update
        const reorderedSlides = [...slides];
        newOrder.forEach((item) => {
          const slide = reorderedSlides.find((s) => s.id === item.id);
          if (slide) slide.order = item.order as number;
        });
        reorderedSlides.sort((a, b) => a.order - b.order);
        setSlides(reorderedSlides);

        try {
          await fetch("/api/hero-slides-reorder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOrder),
          });
          toast.success("New order saved");
        } catch (error) {
          toast.error("Failed to save order");
          fetchSlides(); // Revert on error
        }
      },
    });

    return () => sortable.destroy();
  }, [slides, isLoading]);

  async function deleteSlide(id: string) {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    // Optimistic update
    setSlides(slides.filter((s) => s.id !== id));

    try {
      await fetch(`/api/hero-slides/${id}`, { method: "DELETE" });
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Failed to delete");
      fetchSlides();
    }
  }

  async function togglePublish(id: string, currentStatus: boolean) {
    const newStatus = !currentStatus;

    // Optimistic update
    setSlides(
      slides.map((s) => (s.id === id ? { ...s, published: newStatus } : s))
    );

    try {
      await fetch(`/api/hero-slides/${id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: newStatus }),
      });
      toast.success(newStatus ? "Slide Published" : "Slide Unpublished");
    } catch (error) {
      toast.error("Update failed");
      fetchSlides();
    }
  }

  return (
    <div className="space-y-4 w-full max-w-[100vw]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-1">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Hero Slides
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your homepage hero slider content.
          </p>
        </div>

        <Dialog.Root open={openCreate} onOpenChange={setOpenCreate}>
          <Dialog.Trigger asChild>
            <button className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Add New Slide
            </button>
          </Dialog.Trigger>
          <SlideModal
            title="Create Slide"
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
          >
            <SlideFormDialog
              onSaved={() => {
                setOpenCreate(false);
                fetchSlides();
              }}
            />
          </SlideModal>
        </Dialog.Root>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : slides.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No slides found. Create one to get started.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-medium border-b border-border">
                <tr>
                  <th className="px-4 py-3 w-[50px]"></th>
                  <th className="px-4 py-3 w-[120px]">Preview</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3 text-center w-[120px]">Status</th>
                  <th className="px-4 py-3 text-right w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody
                ref={tableBodyRef}
                id="sortableBody"
                className="divide-y divide-border"
              >
                {slides.map((s) => (
                  <tr
                    key={s.id}
                    data-id={s.id}
                    className="bg-background hover:bg-muted/30 transition-colors group"
                  >
                    {/* Drag Handle */}
                    <td className="px-4 py-3 text-center">
                      <button className="drag-handle cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 rounded">
                        <GripVertical className="w-5 h-5" />
                      </button>
                    </td>

                    {/* Preview Image */}
                    <td className="px-4 py-3">
                      <div className="relative w-24 h-14 overflow-hidden rounded-md border border-border bg-muted">
                        <img
                          src={s.imageUrl}
                          alt={s.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Title & Subtitle */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">
                        {s.title || "Untitled"}
                      </div>
                      {s.subtitle && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {s.subtitle}
                        </div>
                      )}
                    </td>

                    {/* Published Status */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => togglePublish(s.id, s.published)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                          s.published
                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                            : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                        }`}
                      >
                        {s.published ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Published
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Draft
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditing(s)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSlide(s.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog.Root
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <SlideModal
          title="Edit Slide"
          isOpen={!!editing}
          setIsOpen={(val: any) => !val && setEditing(null)}
        >
          {editing && (
            <SlideFormDialog
              slide={editing}
              onSaved={() => {
                setEditing(null);
                fetchSlides();
              }}
            />
          )}
        </SlideModal>
      </Dialog.Root>
    </div>
  );
}

// Reusable Modal Wrapper Component for clean design
function SlideModal({ children, title, isOpen, setIsOpen }: any) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight text-foreground">
              {title}
            </Dialog.Title>
            <Dialog.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>
        </div>

        <div className="pt-2">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
