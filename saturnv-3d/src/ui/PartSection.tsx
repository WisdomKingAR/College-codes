import AnimatedContent from '@/components/AnimatedContent'
import SpotlightCard from '@/components/SpotlightCard'
import { PART_BY_ID, PART_TRIANGLES, type PartId } from '@/data/parts'

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

  return (
    <section
      id={`part-${id}`}
      aria-labelledby={`part-${id}-heading`}
      className="relative flex h-screen items-center px-6 sm:px-10 lg:px-16"
    >
      <div className="w-full max-w-md lg:ml-auto">
        <AnimatedContent
          distance={44}
          direction="vertical"
          reverse={false}
          duration={0.7}
          ease="power3.out"
          className={active ? '' : 'pointer-events-none'}
        >
          <SpotlightCard
            spotlightColor="rgba(252, 61, 33, 0.14)"
            className="rounded-sm border border-edge/70 bg-hull/70 p-7 backdrop-blur-md"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="telemetry text-nasa">{part.code}</span>
              <span className="telemetry text-faint">
                {String(index + 1).padStart(2, '0')} / 08
              </span>
            </div>

            <h2
              id={`part-${id}-heading`}
              className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-chalk sm:text-4xl"
            >
              {part.name}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-muted">{part.blurb}</p>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-edge/70 pt-5">
              {part.specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="telemetry text-faint">{spec.label}</dt>
                  <dd className="mt-1.5 font-mono text-sm text-chalk">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <p className="telemetry mt-5 text-faint/70">
              {triangles.toLocaleString()} triangles in this section of the model
            </p>
          </SpotlightCard>
        </AnimatedContent>
      </div>
    </section>
  )
}