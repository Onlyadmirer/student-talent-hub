import { useNavigate } from 'react-router-dom'
import { PLACEHOLDER_COVER, coverErrorHandler } from '../../types/index.ts'

interface ProjectItemProps {
  id: number
  title: string
  meta: string
  status: string
  imageUrl?: string
}

export default function ProjectItem({ id, title, meta, status, imageUrl }: ProjectItemProps) {
  const navigate = useNavigate()

  return (
    <div
      className="flex items-center py-5 border-b border-[#f0f0f0] last:border-none cursor-pointer"
      onClick={() => navigate(`/projects/${id}`)}
    >
      <img
        src={imageUrl || PLACEHOLDER_COVER}
        alt="Project"
        className="w-[60px] h-[45px] rounded-md object-cover mr-5 bg-[#e5e7eb]"
        onError={coverErrorHandler}
      />
      <div className="flex-1">
        <h3 className="font-heading text-base font-bold text-[#111] mb-1">{title}</h3>
        <p className="text-xs text-[#666]">{meta}</p>
      </div>
      <span className="bg-[#ccfbf1] text-[#0f766e] px-3 py-1.5 rounded-full text-xs font-semibold">
        {status}
      </span>
    </div>
  )
}
