import { SplitHeading } from '@/ui/motion'

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p className="telemetry mb-8 text-faint">
        National Aeronautics and Space Administration · Launch Vehicle
      </p>

      <SplitHeading
        tag="h1"
        text="SATURN V"
        className="text-[clamp(3rem,13vw,11rem)] leading-[0.85] font-semibold tracking-[-0.03em] text-chalk"
      />

      <p className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
        One hundred and ten metres of rocket, in eight sections. Scroll to take it apart from the
        escape tower down to the engines.
      </p>

      <div className="mt-14 flex items-center gap-3" aria-hidden="true">
        <span className="telemetry text-faint">Scroll</span>
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-nasa" />
      </div>
    </section>
  )
}