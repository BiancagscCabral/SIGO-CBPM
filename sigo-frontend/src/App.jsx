import './App.css';
import AppRoutes from './routes';
import { UserProvider } from './contexts/UserContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';

function App() {
  return (
    <UserProvider>
      <AccessibilityProvider>
        <AppRoutes />
      </AccessibilityProvider>
    </UserProvider>
  );
}

export default App;