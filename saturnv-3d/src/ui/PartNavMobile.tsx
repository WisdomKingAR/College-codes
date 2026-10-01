import { useState } from 'react'
import { MenuIcon } from 'lucide-react'
import { PARTS, SCROLL_PART_ORDER, type PartId } from '@/data/parts'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

/**
 * Small-screen equivalent of the PartNav rail.
 *
 * The rail is a fixed column of ticks down the right edge, which is unusable
 * below the md breakpoint, so this is the only way to reach a part without
 * scrolling on a phone. Built on a Radix dialog rather than a plain disclosure
 * so it traps focus, closes on Escape, and reports itself as a dialog — hand
 * rolling that correctly is more work than it looks.
 */
export function PartNavMobile({
  active,
  onSelect,
}: {
  active: PartId | null
  onSelect: (id: PartId) => void
}) {
  const [open, setOpen] = useState(false)

  // Returning to the hero leaves no active part; say so rather than showing a
  // stale highlight.
  const activePart = PARTS.find((p) => p.id === active)

  return (
    <div className="pointer-events-auto fixed top-4 left-4 z-30 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {/* The outline variant hovers to bg-muted, which on this palette is a
              text colour rather than a surface. Overridden here so the trigger
              tints the same edge tone as the rest of the chrome. */}
          <Button
            variant="outline"
            size="icon"
            aria-label="Jump to a vehicle section"
            className="border-edge bg-hull/80 text-chalk hover:bg-edge-soft hover:text-chalk"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-72 border-edge bg-popover p-0">
          <SheetHeader className="border-b border-edge p-6 text-left">
            <SheetTitle className="telemetry text-nasa">Vehicle sections</SheetTitle>
            <SheetDescription className="telemetry text-faint">
              {activePart ? `Now viewing ${activePart.code} — ${activePart.name}` : 'Intro'}
            </SheetDescription>
          </SheetHeader>

          <nav aria-label="Vehicle sections">
            <ol>
              {SCROLL_PART_ORDER.map((id, i) => {
                const part = PARTS.find((p) => p.id === id)
                if (!part) return null
                const isActive = id === active

                return (
                  <li key={id} className="border-b border-edge/60 last:border-b-0">
                    <button
                      type="button"
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => {
                        // Close first: the drawer would otherwise still be
                        // capturing scroll while Lenis animates the page under it.
                        setOpen(false)
                        onSelect(id)
                      }}
                      className="flex w-full items-baseline gap-4 px-6 py-4 text-left"
                    >
                      <span
                        className={`telemetry ${isActive ? 'text-nasa' : 'text-faint'}`}
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-sm font-medium ${
                            isActive ? 'text-nasa' : 'text-chalk'
                          }`}
                        >
                          {part.code}
                        </span>
                        <span className="mt-1 block truncate text-xs text-muted">{part.name}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}