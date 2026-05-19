import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-paper font-sans px-8 text-center">
          <p className="text-2xl">Er is iets misgegaan</p>
          <p className="text-paper/60 text-sm max-w-md">{this.state.error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-full bg-paper/10 border border-paper/20 hover:bg-paper/20 transition-colors text-sm"
          >
            Pagina herladen
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
