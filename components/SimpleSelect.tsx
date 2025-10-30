'use client'

import { useEffect, useRef, useState } from 'react'

export interface SimpleSelectOption<T extends string = string> {
  label: string
  value: T
}

interface SimpleSelectProps<T extends string = string> {
  options: SimpleSelectOption<T>[]
  value: T
  onChange: (value: T) => void
  widthClass?: string
  placeholder?: string
  ariaLabel?: string
  disabled?: boolean
}

export default function SimpleSelect<T extends string = string>({
  options,
  value,
  onChange,
  widthClass = 'w-48',
  placeholder = '请选择',
  ariaLabel,
  disabled
}: SimpleSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const current = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    function onDocMouseDown(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={`relative ${widthClass}`} ref={containerRef}>
      <button
        type="button"
        aria-label={ariaLabel}
        disabled={disabled}
        className={
          `w-full bg-gray-900/60 text-white px-4 py-3 rounded-xl border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 flex items-center justify-between ` +
          (disabled ? ' opacity-60 cursor-not-allowed' : ' cursor-pointer')
        }
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        <span className="truncate">
          {current ? current.label : placeholder}
        </span>
        <span
          className={`ml-2 transition-transform duration-200 text-cyan-400/80 ${
            open ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="absolute left-0 z-50 mt-2 w-full rounded-xl bg-gray-900/90 backdrop-blur-md border border-gray-700/30 shadow-xl py-1 max-h-60 overflow-auto">
          {options.length === 0 && (
            <div className="px-4 py-2 text-gray-400 text-center select-none">
              暂无选项
            </div>
          )}
          {options.map((opt) => {
            const active = opt.value === value
            return (
              <div
                key={opt.value}
                className={
                  `px-4 py-2.5 cursor-pointer select-none text-gray-200 hover:bg-cyan-600/30 hover:text-white transition-all duration-150 flex items-center gap-2 ` +
                  (active ? ' bg-cyan-700/30 text-white font-medium' : '')
                }
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onChange(opt.value)
                    setOpen(false)
                  }
                }}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400/60"></span>
                <span className="truncate">{opt.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
