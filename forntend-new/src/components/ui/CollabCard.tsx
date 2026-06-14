import { DotsThreeVertical } from '@phosphor-icons/react'

interface CollabCardProps {
  title: string
  description: string
  avatarCount?: number
}

export default function CollabCard({ title, description, avatarCount = 2 }: CollabCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 mb-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-card-border relative">
      <span className="inline-block bg-[#a7f3d0] text-[#047857] px-2.5 py-1 rounded text-[0.65rem] font-bold mb-4">
        OPEN
      </span>
      <DotsThreeVertical size={20} className="absolute top-6 right-5 text-[#888] cursor-pointer" />
      <h3 className="font-heading text-base font-bold text-[#111] mb-2">{title}</h3>
      <p className="text-xs text-[#555] leading-relaxed mb-4">{description}</p>
      <div className="flex items-center">
        {Array.from({ length: avatarCount }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full border-2 border-white ${i === 0 ? 'bg-[#4ade80]' : 'bg-[#94a3b8]'} ${i > 0 ? '-ml-2' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
