import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

// Small shared building blocks so every page uses the same styles.

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line p-6 ${className}`}>{children}</div>
}

export function Button({
  className = '',
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) {
  const styles = {
    primary: 'bg-navy text-ink border border-line hover:border-accent',
    ghost: 'text-muted hover:text-ink',
  }[variant]
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
      {...props}
    />
  )
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-line bg-transparent px-4 py-2.5 text-ink placeholder:text-dim focus:border-accent focus:outline-none ${className}`}
      {...props}
    />
  )
}

export function Select({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`rounded-lg border border-line bg-page px-3 py-2.5 text-ink focus:border-accent focus:outline-none ${className}`}
      {...props}
    />
  )
}

export function ErrorMessage({ message }: { message: string }) {
  if (!message) return null
  return <p className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-2 text-sm text-danger">{message}</p>
}

// Bold ticker over a light company name, as used in every table and card.
export function StockName({ ticker, name }: { ticker: string; name: string }) {
  return (
    <div>
      <div className="text-lg font-bold leading-tight">{ticker}</div>
      <div className="max-w-56 truncate text-lg font-light leading-tight text-soft">{name}</div>
    </div>
  )
}

// Bordered, rounded table wrapper that scrolls sideways on narrow screens.
export function DataTable({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[640px] text-left">
        <thead>
          <tr className="border-b border-line">
            {head.map((h, i) => (
              <th key={i} className="px-6 py-5 text-lg font-medium first:pl-16">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line [&_td]:px-6 [&_td]:py-4 [&_td]:text-lg [&_td]:font-medium [&_td:first-child]:pl-16">
          {children}
        </tbody>
      </table>
    </div>
  )
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="!py-10 text-center !text-base !font-normal text-muted">
        {children}
      </td>
    </tr>
  )
}

// Small "×" button for removing a row.
export function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="rounded px-2 text-xl leading-none text-dim hover:text-danger">
      ×
    </button>
  )
}
