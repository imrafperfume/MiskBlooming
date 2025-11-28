"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import { BubbleMenu } from "@tiptap/react/menus";
import { cn } from "@/src/lib/utils"; // Assuming you have a cn utility
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Redo2,
  Undo2,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Check,
  X,
  Loader2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /**
   * Optional async function to handle image uploads to a server (S3, Cloudinary, etc.)
   * Should return the public URL of the uploaded image.
   */
  onImageUpload?: (file: File) => Promise<string>;
}

// --- Toolbar Button Component ---
interface ToolbarBtnProps {
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  tooltip?: string;
  className?: string;
}

const ToolbarButton = ({
  isActive,
  onClick,
  children,
  disabled,
  tooltip,
  className,
}: ToolbarBtnProps) => (
  <button
    type="button"
    title={tooltip}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200",
      isActive &&
        "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
      disabled && "opacity-40 cursor-not-allowed",
      className
    )}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-border mx-1" />;

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
  onImageUpload,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Define extensions once
  const extensions = [
    StarterKit.configure({
      bulletList: { keepMarks: true, keepAttributes: false },
      orderedList: { keepMarks: true, keepAttributes: false },
      heading: false, // Disabling default heading to use custom configuration
    }),
    Heading.configure({ levels: [1, 2, 3] }),
    Underline,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Link.configure({
      openOnClick: false, // Prevent opening links while editing
      autolink: true,
      HTMLAttributes: {
        class:
          "text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-colors cursor-pointer",
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class:
          "rounded-lg border border-border shadow-sm max-w-full h-auto my-4",
      },
    }),
    Placeholder.configure({
      placeholder,
      emptyEditorClass:
        "before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none h-full",
    }),
  ];

  const editor = useEditor({
    extensions,
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      // De-bounce could be added here for performance if content is very large
      onChange(editor.getHTML());
    },
    // Fix for Tiptap Hydration Mismatch in Next.js
    immediatelyRender: false,
  });

  // Sync external value changes (e.g. from database load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // --- Handlers ---

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    // Simple protocol check
    const finalUrl = /^https?:\/\//.test(url) ? url : `https://${url}`;
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: finalUrl })
      .run();
  }, [editor]);

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return;

      // 1. If a custom upload handler is provided, use it
      if (onImageUpload) {
        try {
          setIsUploading(true);
          const url = await onImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          console.error("Image upload failed", error);
          alert("Failed to upload image. Please try again.");
        } finally {
          setIsUploading(false);
        }
      }
      // 2. Fallback: Convert to Base64 (Not recommended for heavy production use)
      else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          if (src) editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
      }
    },
    [editor, onImageUpload]
  );

  const triggerImagePicker = () => fileInputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset input
    e.target.value = "";
  };

  if (!editor) {
    return null; // or a skeleton loader
  }

  return (
    <div
      className={cn(
        "flex flex-col border border-border rounded-xl bg-background shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-shadow",
        className
      )}
    >
      {/* --- Toolbar --- */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
        {/* History */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            tooltip="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            tooltip="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Headings */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            tooltip="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            tooltip="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Formatting */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            tooltip="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            tooltip="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            tooltip="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            tooltip="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            tooltip="Inline Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Alignment */}
        <div className="flex items-center gap-0.5  sm:flex">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            tooltip="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            tooltip="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            tooltip="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            tooltip="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            tooltip="Ordered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            tooltip="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Media */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive("link")}
            tooltip="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={triggerImagePicker}
            tooltip="Insert Image"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
          </ToolbarButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
      </div>

      {/* --- Bubble Menu (Floating Context) --- */}
      {editor && (
        <BubbleMenu
          editor={editor}
          // tippyOptions={{ duration: 100 }}
          className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background shadow-lg"
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            className={
              editor.isActive("bold")
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                : ""
            }
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            className={
              editor.isActive("italic")
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                : ""
            }
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            className={
              editor.isActive("strike")
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                : ""
            }
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-4 bg-border mx-1" />
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive("link")}
            className={
              editor.isActive("link")
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                : ""
            }
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
        </BubbleMenu>
      )}

      {/* --- Editor Area --- */}
      <EditorContent editor={editor} className="flex-1 cursor-text" />

      {/* --- Footer Status --- */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/20 border-t border-border text-xs text-muted-foreground">
        <div className="flex gap-4">
          {editor.storage.characterCount && (
            <span>{editor.storage.characterCount.characters()} chars</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isUploading && (
            <span className="flex items-center gap-1 text-primary">
              <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
            </span>
          )}
          <span>Markdown Supported</span>
        </div>
      </div>
    </div>
  );
}
