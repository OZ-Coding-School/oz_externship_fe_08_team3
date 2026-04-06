import { createContext, useContext, useId } from 'react'

/* ------------------------------------------------------------------ */
/* Context                                                              */
/* ------------------------------------------------------------------ */

interface TabsContextValue {
  activeTab: string
  onChange: (value: string) => void
  baseId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('<Tab> must be used inside <Tabs>')
  return ctx
}

/* ------------------------------------------------------------------ */
/* Tabs (root)                                                          */
/* ------------------------------------------------------------------ */

export interface TabsProps {
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ value, onChange, children, className = '' }: TabsProps) {
  const baseId = useId()
  return (
    <TabsContext.Provider value={{ activeTab: value, onChange, baseId }}>
      <div className={['w-full', className].filter(Boolean).join(' ')}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

/* ------------------------------------------------------------------ */
/* TabList                                                              */
/* ------------------------------------------------------------------ */

export interface TabListProps {
  children: React.ReactNode
  className?: string
  'aria-label'?: string
}

export function TabList({
  children,
  className = '',
  'aria-label': ariaLabel,
}: TabListProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={['border-border-base flex border-b', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tab (trigger)                                                        */
/* ------------------------------------------------------------------ */

export interface TabProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
}

export function Tab({ value, children, disabled = false }: TabProps) {
  const { activeTab, onChange, baseId } = useTabsContext()
  const isActive = activeTab === value

  return (
    <button
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-controls={`${baseId}-panel-${value}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && onChange(value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onChange(value)
      }}
      className={[
        'relative shrink-0 px-4 py-3 text-sm font-medium transition-colors duration-150 outline-none',
        'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-inset',
        isActive
          ? 'text-primary after:bg-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-t-full'
          : 'text-text-muted hover:text-text-body',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* TabPanel                                                             */
/* ------------------------------------------------------------------ */

export interface TabPanelProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabPanel({ value, children, className = '' }: TabPanelProps) {
  const { activeTab, baseId } = useTabsContext()
  const isActive = activeTab === value

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!isActive}
      tabIndex={0}
      className={['outline-none', isActive ? 'block' : 'hidden', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
