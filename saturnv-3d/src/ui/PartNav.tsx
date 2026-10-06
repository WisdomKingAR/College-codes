import { PARTS, SCROLL_PART_ORDER, type PartId } from '@/data/parts'

/**
 * Module level: `active` changes at every section boundary, and rebuilding the
 * label table plus re-searching PARTS on each of those renders produced the same
 * eight entries every time.
 */
const NAV_ITEMS = SCROLL_PART_ORDER.flatMap((id) => {
  const part = PARTS.find((p) => p.id === id)
  return part ? [{ id, code: part.code, label: `${part.code} — ${part.name}` }] : []
})

/**
 * Fixed rail that jumps to a part.
 *
 * Rendered as real buttons so it works with a keyboard and announces the active
 * item via aria-current, and it is also the primary navigation for anyone who
 * never scrolls.
 */
export function PartNav({
  active,
  onSelect,
}: {
  active: PartId | null
  onSelect: (id: PartId) => void
}) {
  return (
    <nav
      aria-label="Vehicle sections"
      className="pointer-events-auto fixed top-1/2 right-4 z-30 hidden -translate-y-1/2 md:block"
    >
      <ol className="flex flex-col items-end gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === active
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={isActive ? 'true' : undefined}
                aria-label={item.label}
                className="group flex items-center justify-end gap-3 py-1.5 pl-3 text-right"
              >
                <span
                  className={`telemetry transition-all duration-300 ${
                    isActive
                      ? 'text-nasa opacity-100'
                      : 'text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                  }`}
                >
                  {item.code}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-px transition-all duration-300 ${
                    isActive ? 'w-8 bg-nasa' : 'w-4 bg-edge group-hover:w-6 group-hover:bg-muted'
                  }`}
                />
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
