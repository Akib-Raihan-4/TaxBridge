import {
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  ChartLine,
  FileText,
  HardHat,
  PiggyBank,
  Receipt,
  RefreshCw,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'

/** Icons editors can pick in the CMS (see src/fields/icons.ts). */
const icons: Record<string, LucideIcon> = {
  calculator: Calculator,
  receipt: Receipt,
  briefcase: Briefcase,
  'building-2': Building2,
  'chart-line': ChartLine,
  'piggy-bank': PiggyBank,
  'book-open': BookOpen,
  users: Users,
  'file-text': FileText,
  'shield-check': ShieldCheck,
  'hard-hat': HardHat,
  'refresh-cw': RefreshCw,
}

export function Icon({ name, className = '' }: { name?: string | null; className?: string }) {
  const Component = (name && icons[name]) || FileText
  return <Component aria-hidden="true" strokeWidth={1.5} className={className} />
}
