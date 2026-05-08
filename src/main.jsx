import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      // In dev, show the full stack so we can debug.
      // In prod, show a calm, on-brand message — no stack traces, no file
      // paths, no implementation hints in the UI of a sensitive app.
      if (import.meta.env.DEV) {
        return (
          <div style={{padding:'2rem',color:'#f0ecff',fontFamily:'monospace',background:'#12101a',minHeight:'100vh'}}>
            <h2 style={{color:'#e05c6a'}}>Render Error</h2>
            <pre style={{whiteSpace:'pre-wrap',fontSize:13,color:'#e0a85c'}}>{this.state.error.toString()}</pre>
            <pre style={{whiteSpace:'pre-wrap',fontSize:12,color:'#9b93b8'}}>{this.state.error.stack}</pre>
          </div>
        );
      }
      return (
        <div style={{padding:'2rem',color:'#f0ecff',fontFamily:"'Outfit', system-ui, sans-serif",background:'#12101a',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
          <h2 style={{fontSize:22,fontWeight:600,margin:'0 0 12px'}}>Something didn't load right.</h2>
          <p style={{fontSize:14,color:'#9b93b8',margin:'0 0 24px',maxWidth:320,lineHeight:1.6}}>Your data is safe. Try closing the app and opening it again. If the problem keeps happening, you can export a backup of your data from Settings.</p>
          <button onClick={() => location.reload()} style={{padding:'12px 24px',borderRadius:12,fontSize:14,fontWeight:600,background:'#9d85ff',color:'#fff',border:'none',cursor:'pointer'}}>Reload</button>
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

// Register the service worker only in pure-web contexts. Inside Capacitor's
// native webview the SW would intercept asset requests in confusing ways
// (and is unnecessary — the native app ships its own bundled assets).
if ('serviceWorker' in navigator && !Capacitor.isNativePlatform()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Hide the native splash screen as soon as React has rendered. No-op on web.
if (Capacitor.isNativePlatform()) {
  // requestIdleCallback fallback: setTimeout 0 also works fine.
  setTimeout(() => { SplashScreen.hide().catch(() => {}); }, 50);
}
