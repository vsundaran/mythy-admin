import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  useLocation
} from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ConfigEditor from './pages/ConfigEditor';
import Chats from './pages/Chats';
import Users from './pages/Users';
import SubscriptionPlans from './pages/SubscriptionPlans';
import './index.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('admin_token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const userStr = localStorage.getItem('admin_user');
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar user={user} />
      <main style={{ 
        flex: 1, 
        marginLeft: 'var(--sidebar-width)',
        background: 'var(--background)'
      }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/configs" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <ConfigEditor />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Users />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/chats" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Chats />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/subscription-plans" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <SubscriptionPlans />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        {/* Fallback routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
