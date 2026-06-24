import { XIcon } from '@phosphor-icons/react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(230,235,235,0.85)] backdrop-blur-sm">
      <div className="bg-white w-full max-w-[420px] rounded-2xl p-[35px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[1.3rem] font-bold text-primary">{title}</h2>
          <button onClick={onCancel} className="bg-none border-none text-[#555] text-lg cursor-pointer">
            <XIcon size={22} />
          </button>
        </div>

        <p className="text-[#555] text-[0.9rem] leading-relaxed mb-8">{message}</p>

        <div className="flex justify-end items-center gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="bg-none border-none text-[#555] text-[0.9rem] font-semibold cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 text-white border-none px-6 py-3 rounded-lg text-[0.9rem] font-semibold cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
