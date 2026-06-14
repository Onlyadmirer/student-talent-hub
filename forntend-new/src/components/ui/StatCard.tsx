import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  iconBgClass: string
  iconColorClass: string
  value: string
  label: string
}

export default function StatCard({ icon, iconBgClass, iconColorClass, value, label }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 flex items-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-card-border">
      <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center mr-5 text-[1.5rem] ${iconBgClass} ${iconColorClass}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-heading text-primary text-xl mb-1">{value}</h3>
        <p className="text-[#666] text-xs font-medium">{label}</p>
      </div>
    </div>
  )
}
