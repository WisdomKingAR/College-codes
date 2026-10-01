import { Component, type ErrorInfo, type ReactNode } from 'react'
import { PARTS } from '@/data/parts'

interface Props {
  children: ReactNode
}

interface State {
  failed: boolean
}

/**
 * Catches WebGL context loss and driver failures.
 *
 * The rocket is decorative: if it cannot be drawn, every part's name, summary
 * and specification is still available as a plain document. Losing the 3D view
 * must not lose the content.
 */
export class WebGLBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('3D scene unavailable:', error, info.componentStack)
  }

  render() {
    if (this.state.failed) return <FallbackList />
    return this.props.children
  }
}

function FallbackList() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-chalk sm:text-4xl">
        Saturn V — Anatomy of the Apollo Rocket
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        The interactive 3D view could not start in this browser, so here is the same breakdown as
        text. It covers the full 110.6 m vehicle, from the launch escape tower down to the F-1
        engines.
      </p>

      {PARTS.map((part) => (
        <section key={part.id} className="mt-12 border-t border-edge pt-8">
          <span className="telemetry text-nasa">{part.code}</span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-chalk">{part.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{part.blurb}</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            {part.specs.map((spec) => (
              <div key={spec.label}>
                <dt className="telemetry text-faint">{spec.label}</dt>
                <dd className="mt-1 font-mono text-sm text-chalk">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}