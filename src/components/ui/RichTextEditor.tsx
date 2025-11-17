"use client";

import { useEffect, useRef, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
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
  Code2,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const btnBase =
  "p-2 rounded-xl border border-transparent hover:border-gray-300 transition shadow-sm bg-background disabled:opacity-40 disabled:cursor-not-allowed";
const btnActive = "bg-gray-900 text-white hover:border-gray-900";
const group = "flex items-center gap-1";

const Button = ({
  isActive,
  onClick,
  title,
  children,
  disabled,
}: {
  isActive?: boolean;
  onClick?: () => void;
  title?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`${btnBase} ${isActive ? btnActive : ""}`}
    disabled={disabled}
  >
    {children}
  </button>
);

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Type something…",
  className = "",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: useMemo(
      () => [
        StarterKit.configure({
          bulletList: { keepMarks: true, keepAttributes: true },
          orderedList: { keepMarks: true, keepAttributes: true },
          blockquote: {},
          codeBlock: {},
        }),
        Underline,
        Heading.configure({ levels: [1, 2, 3] }),
        TextAlign.configure({
          types: [
            "heading",
            "paragraph",
            "bulletList",
            "orderedList",
            "listItem",
          ],
        }),
        Link.configure({ openOnClick: true, autolink: true }),
        Image,
        Placeholder.configure({ placeholder }),
      ],
      [placeholder]
    ),
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[220px] p-4 focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  const toggleLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const finalUrl = /^(https?:|mailto:)/.test(url) ? url : `https://${url}`;
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: finalUrl })
      .run();
  };

  const insertImage = () => {
    if (!editor) return;
    const useUrl = window.confirm("Insert image via URL? (Cancel to upload)");
    if (useUrl) {
      const url = window.prompt("Image URL");
      if (url) editor.chain().focus().setImage({ src: url }).run();
    } else {
      fileInputRef.current?.click();
    }
  };

  const onPickFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result || "");
      if (src) editor.chain().focus().setImage({ src, alt: file.name }).run();
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = "";
  };

  return (
    <div
      className={`rounded-2xl border border-border  shadow-sm overflow-hidden bg-background ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-background">
        <div className={group}>
          <Button
            title="Undo"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            title="Redo"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-px h-6 bg-gray-300" />
        <div className={group}>
          <Button
            title="Heading 1"
            isActive={!!editor?.isActive("heading", { level: 1 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            title="Heading 2"
            isActive={!!editor?.isActive("heading", { level: 2 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            title="Heading 3"
            isActive={!!editor?.isActive("heading", { level: 3 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-px h-6 bg-gray-300" />
        <div className={group}>
          <Button
            title="Bold"
            isActive={!!editor?.isActive("bold")}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            title="Italic"
            isActive={!!editor?.isActive("italic")}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            title="Underline"
            isActive={!!editor?.isActive("underline")}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>
          <Button
            title="Strike"
            isActive={!!editor?.isActive("strike")}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
          <Button
            title="Inline Code"
            isActive={!!editor?.isActive("code")}
            onClick={() => editor?.chain().focus().toggleCode().run()}
          >
            <Code className="w-4 h-4" />
          </Button>
          <Button
            title="Code Block"
            isActive={!!editor?.isActive("codeBlock")}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          >
            <Code2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-px h-6 bg-gray-300" />
        <div className={group}>
          <Button
            title="Bullet List"
            isActive={!!editor?.isActive("bulletList")}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            title="Numbered List"
            isActive={!!editor?.isActive("orderedList")}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            title="Blockquote"
            isActive={!!editor?.isActive("blockquote")}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-px h-6 bg-gray-300" />
        <div className={group}>
          <Button
            title="Align Left"
            isActive={editor?.isActive({ textAlign: "left" }) ?? false}
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            title="Align Center"
            isActive={editor?.isActive({ textAlign: "center" }) ?? false}
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            title="Align Right"
            isActive={editor?.isActive({ textAlign: "right" }) ?? false}
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-px h-6 bg-gray-300" />
        <div className={group}>
          <Button title="Insert/Edit Link" onClick={toggleLink}>
            <LinkIcon className="w-4 h-4" />
          </Button>
          <Button title="Insert Image" onClick={insertImage}>
            <ImageIcon className="w-4 h-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickFile}
          />
        </div>
      </div>

      <EditorContent editor={editor} />

      <div className="flex items-center justify-between px-4 py-2 border-t bg-background text-xs text-foreground ">
        <span>Rich Text Editor</span>
        <span>{value?.length ?? 0} characters</span>
      </div>

      <style jsx global>{`
        .prose p {
          margin: 0.5rem 0;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
        }
        .ProseMirror a {
          text-decoration: underline;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          color: #6b7280;
          font-style: italic;
        }
        .ProseMirror pre {
          background: #0f172a;
          color: #e2e8f0;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          overflow: auto;
        }
      `}</style>
    </div>
  );
}
