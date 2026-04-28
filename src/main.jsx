import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding:'2rem',color:'#f0ecff',fontFamily:'monospace',background:'#12101a',minHeight:'100vh'}}>
          <h2 style={{color:'#e05c6a'}}>Render Error</h2>
          <pre style={{whiteSpace:'pre-wrap',fontSize:13,color:'#e0a85c'}}>{this.state.error.toString()}</pre>
          <pre style={{whiteSpace:'pre-wrap',fontSize:12,color:'#9b93b8'}}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
