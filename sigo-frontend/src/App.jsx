import './App.css';
import AppRoutes from './routes';
import { UserProvider } from './contexts/UserContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { OcorrenciasProvider } from './contexts/OcorrenciasContext';

function App() {
  return (
    <UserProvider>
      <AccessibilityProvider>
        <OcorrenciasProvider>
          <AppRoutes />
        </OcorrenciasProvider>
      </AccessibilityProvider>
    </UserProvider>
  );
}

export default App;