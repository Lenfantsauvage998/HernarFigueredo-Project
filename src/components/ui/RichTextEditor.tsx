import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading2, Heading3, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight,
  Quote, Minus, Link as LinkIcon, Undo, Redo,
} from 'lucide-react'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

const RichTextEditor: React.FC<Props> = ({ value, onChange, placeholder = 'Escribe el contenido aquí…' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#f26822] underline' } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[320px] text-white/80 leading-normal prose-editor px-1',
      },
    },
  })

  if (!editor) return null

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL del enlace:', prev ?? 'https://')
    if (url === null) return
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  type ToolbarBtn = {
    label: string
    icon: React.ReactNode
    action: () => void
    active?: boolean
    disabled?: boolean
  }

  const groups: ToolbarBtn[][] = [
    // History
    [
      { label: 'Deshacer',   icon: <Undo size={14} />,   action: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo() },
      { label: 'Rehacer',    icon: <Redo size={14} />,   action: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo() },
    ],
    // Headings
    [
      { label: 'Título 2',   icon: <Heading2 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
      { label: 'Título 3',   icon: <Heading3 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    ],
    // Inline
    [
      { label: 'Negrita',    icon: <Bold size={14} />,           action: () => editor.chain().focus().toggleBold().run(),          active: editor.isActive('bold') },
      { label: 'Cursiva',    icon: <Italic size={14} />,         action: () => editor.chain().focus().toggleItalic().run(),        active: editor.isActive('italic') },
      { label: 'Subrayado',  icon: <UnderlineIcon size={14} />,  action: () => editor.chain().focus().toggleUnderline().run(),     active: editor.isActive('underline') },
      { label: 'Tachado',    icon: <Strikethrough size={14} />,  action: () => editor.chain().focus().toggleStrike().run(),        active: editor.isActive('strike') },
    ],
    // Align
    [
      { label: 'Izquierda',  icon: <AlignLeft size={14} />,    action: () => editor.chain().focus().setTextAlign('left').run(),   active: editor.isActive({ textAlign: 'left' }) },
      { label: 'Centro',     icon: <AlignCenter size={14} />,  action: () => editor.chain().focus().setTextAlign('center').run(), active: editor.isActive({ textAlign: 'center' }) },
      { label: 'Derecha',    icon: <AlignRight size={14} />,   action: () => editor.chain().focus().setTextAlign('right').run(),  active: editor.isActive({ textAlign: 'right' }) },
    ],
    // Blocks
    [
      { label: 'Lista',         icon: <List size={14} />,         action: () => editor.chain().focus().toggleBulletList().run(),  active: editor.isActive('bulletList') },
      { label: 'Lista núm.',    icon: <ListOrdered size={14} />,  action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
      { label: 'Cita',          icon: <Quote size={14} />,        action: () => editor.chain().focus().toggleBlockquote().run(),  active: editor.isActive('blockquote') },
      { label: 'Separador',     icon: <Minus size={14} />,        action: () => editor.chain().focus().setHorizontalRule().run() },
      { label: 'Enlace',        icon: <LinkIcon size={14} />,     action: setLink, active: editor.isActive('link') },
    ],
  ]

  return (
    <div className="rounded-xl border border-white/[0.09] bg-[#1a1b1c] overflow-hidden focus-within:border-[#f26822]/45 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-white/[0.06] bg-[#161718]">
        {groups.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <div className="w-px h-5 bg-white/10 mx-1" />}
            {group.map((btn) => (
              <button
                key={btn.label}
                type="button"
                title={btn.label}
                disabled={btn.disabled}
                onClick={btn.action}
                className={`p-1.5 rounded-md transition-colors text-sm ${
                  btn.disabled
                    ? 'text-white/15 cursor-not-allowed'
                    : btn.active
                      ? 'bg-[#f26822] text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.07]'
                }`}
              >
                {btn.icon}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Editor area */}
      <div className="px-4 py-3">
        <EditorContent editor={editor} />
      </div>

      {/* Inline styles for the editor content */}
      <style>{`
        .prose-editor h2 { color: #fff; font-size: 1.35rem; font-weight: 700; margin: 1.2em 0 0.5em; line-height: 1.3; }
        .prose-editor h3 { color: #fff; font-size: 1.1rem; font-weight: 700; margin: 1em 0 0.4em; line-height: 1.3; }
        .prose-editor p  { margin: 0; }
        .prose-editor p + p { margin-top: 0; }
        .prose-editor strong { color: #fff; font-weight: 600; }
        .prose-editor em { font-style: italic; }
        .prose-editor u  { text-decoration: underline; }
        .prose-editor s  { text-decoration: line-through; }
        .prose-editor ul { list-style: disc; padding-left: 1.4em; margin: 0.6em 0; }
        .prose-editor ol { list-style: decimal; padding-left: 1.4em; margin: 0.6em 0; }
        .prose-editor li { margin: 0.25em 0; }
        .prose-editor blockquote { border-left: 3px solid #f26822; padding-left: 1em; color: rgba(255,255,255,0.5); margin: 0.8em 0; font-style: italic; }
        .prose-editor hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.2em 0; }
        .prose-editor a  { color: #f26822; text-decoration: underline; }
        .prose-editor .is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: rgba(255,255,255,0.2); pointer-events: none; height: 0; }
      `}</style>
    </div>
  )
}

export default RichTextEditor
