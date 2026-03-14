interface TechBadgeProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md';
}

export default function TechBadge({ name, color = 'bg-orange-50 text-[#a34a1a]', size = 'sm' }: TechBadgeProps) {
  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${color} ${sizeClasses} transition-transform duration-150 hover:scale-105`}
    >
      {name}
    </span>
  );
}
