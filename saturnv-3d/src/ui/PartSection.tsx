import { PART_BAND, PART_BY_ID, PART_TRIANGLES, SCROLL_PART_ORDER, type PartId } from '@/data/parts'
import SpotlightCard from '@/components/SpotlightCard'
import { Reveal } from '@/ui/motion'

/**
 * One full-height section per part.
 *
 * The copy sits in a fixed column rather than flowing in document order, so on a
 * wide screen every part's panel lands in the same place and only its contents
 * change as the 3D view moves. On narrow screens it drops to the natural flow.
 */
export function PartSection({
  id,
  index,
  active,
}: {
  id: PartId
  index: number
  active: boolean
}) {
  const part = PART_BY_ID[id]
  const triangles = PART_TRIANGLES[id]
  const band = PART_BAND[id]
  const totalParts = SCROLL_PART_ORDER.length
  const stepNumber = String(index + 1).padStart(2, '0')

  return (
    <section
      id={`part-${id}`}
      aria-labelledby={`part-${id}-heading`}
      className="relative flex h-[100svh] items-center px-4 sm:px-8 lg:px-16"
    >
      <div
        className={`flex items-center gap-4 sm:gap-6 w-full max-w-xl transition-[opacity,transform] duration-500 ${
          // Fade the inactive panels rather than leaving eight stacked cards at
          // full strength. Done on the wrapper in CSS so it cannot fight the
          // entrance animation on the contents.
          active ? 'opacity-100 translate-x-0' : 'opacity-40 lg:opacity-0 lg:-translate-x-4 lg:pointer-events-none'
        }`}
      >
        {/* Left Telemetry HUD Rail */}
        <div
          className="hidden sm:flex flex-col items-center self-stretch justify-between py-2 text-faint select-none"
          aria-hidden="true"
        >
          <span className="telemetry text-nasa font-mono text-[10px] tracking-widest">{stepNumber}</span>
          <div className="w-px flex-1 my-3 bg-gradient-to-b from-nasa/60 via-edge to-edge/20" />
          <span className="telemetry rotate-180 [writing-mode:vertical-rl] text-[10px] tracking-widest text-faint">
            {part.code}
          </span>
        </div>

        {/* Main Information Card */}
        <div className="flex-1 min-w-0">
          <Reveal className={active ? '' : 'pointer-events-none'}>
            <SpotlightCard
              spotlightColor="rgba(252, 61, 33, 0.14)"
              className="rounded-sm border border-edge/70 bg-hull/95 p-6 sm:p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full bg-nasa ${
                      active ? 'animate-pulse' : ''
                    }`}
                  />
                  <span className="telemetry text-nasa font-bold">{part.code}</span>
                  <span className="text-muted">•</span>
                  <span className="telemetry text-faint text-[10px]">SECTION {stepNumber}</span>
                </div>
                <span className="telemetry text-faint text-[10px]">
                  {stepNumber} / {String(totalParts).padStart(2, '0')}
                </span>
              </div>

              <h2
                id={`part-${id}-heading`}
                className="mt-3 text-2xl sm:text-3xl lg:text-4xl leading-tight font-semibold tracking-tight text-chalk"
              >
                {part.name}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-muted">{part.blurb}</p>

              <dl className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2.5 border-t border-edge/70 pt-4">
                {part.specs.map((spec) => (
                  <div key={spec.label} className="bg-void/70 rounded px-2.5 py-1.5 border border-edge/40">
                    <dt className="telemetry text-faint text-[10px]">{spec.label}</dt>
                    <dd className="mt-0.5 font-mono text-xs sm:text-sm font-medium text-chalk truncate">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex items-center justify-between border-t border-edge/40 pt-3 text-faint">
                <span className="telemetry text-[10px] text-faint">
                  {triangles.toLocaleString()} MESH TRIANGLES
                </span>
                <span className="telemetry text-[10px] text-nasa tracking-widest">
                  {band.from.toFixed(1)}–{band.to.toFixed(1)} M ABOVE BASE
                </span>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}