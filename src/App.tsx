// ...existing code...
// ...existing code...
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './components/AppRouter';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;