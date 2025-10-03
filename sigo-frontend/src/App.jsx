import './App.css';
import AppRoutes from './routes';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;