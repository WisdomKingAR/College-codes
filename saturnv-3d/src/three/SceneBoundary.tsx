import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  onError?: (error: Error) => void
}

interface State {
  failed: boolean
}

/**
 * Catches failures from inside the R3F canvas.
 *
 * This has to live *within* the Canvas rather than around it. R3F renders the
 * scene into its own reconciler root, so an error thrown by a child of Canvas is
 * not propagated to an error boundary in the surrounding component tree — a
 * failed useGLTF fetch would otherwise leave the page with a blank canvas, an
 * unhandled rejection and a boot overlay that never lifts.
 *
 * Sitting directly above the scene contents, it is in the same root as whatever
 * throws, so the rejection is caught here and reported upward, where the document
 * fallback can take over.
 */
export class SceneBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('3D scene failed to load:', error, info.componentStack)
    this.props.onError?.(error)
  }

  render() {
    // Nothing to draw in here; the failure is reported up so the surrounding
    // page can swap in the text version of the same content.
    if (this.state.failed) return null
    return this.props.children
  }
}