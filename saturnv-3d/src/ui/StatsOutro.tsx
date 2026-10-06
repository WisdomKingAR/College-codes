import { VEHICLE_STATS } from '@/data/parts'
import { FloatIn, Scramble, Tally } from '@/ui/motion'

export function StatsOutro() {
  return (
    <section className="relative flex h-[100svh] flex-col items-center justify-center px-6">
      <FloatIn containerClassName="mx-auto max-w-2xl text-center">
        <h2 className="text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.1] font-semibold tracking-tight text-chalk">
          Three stages, one escape tower, and the only machine that has carried people to the Moon
          and back.
        </h2>
      </FloatIn>

      <dl className="mt-16 grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
        {VEHICLE_STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <dt className="telemetry text-faint">{stat.label}</dt>
            <dd className="mt-2 font-mono text-3xl font-medium text-chalk sm:text-4xl">
              <Tally
                to={Number(stat.value.replace(/,/g, ''))}
                separator={stat.value.includes(',') ? ',' : ''}
              />
              {stat.unit ? <span className="ml-1 text-base text-nasa">{stat.unit}</span> : null}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-20 max-w-lg text-center">
        <Scramble text="TRANSMISSION ENDS" className="telemetry text-faint" />
        <p className="mt-6 text-xs leading-relaxed text-faint">
          Model: <span className="text-muted">Saturn V.glb</span> by NASA / Michael D. Carbajal,
          public domain, via the NASA 3D Resources catalogue. Geometry split into eight animatable
          sections for this page. Figures from the Saturn V flight manual and the Apollo Launch
          Operations Plan.
        </p>
      </div>
    </section>
  )
}