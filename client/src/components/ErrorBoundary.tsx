import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

// Catches errors thrown while rendering a page and shows them instead of a blank screen.
// React only supports this as a class component.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-xl border border-danger/40 bg-danger/10 p-6">
          <h2 className="text-lg font-medium text-danger">Something went wrong on this page</h2>
          <p className="mt-2 font-mono text-sm break-words text-soft">{this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })} className="mt-4 text-sm text-accent hover:underline">
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
