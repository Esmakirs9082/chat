import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthGuard from './components/auth/AuthGuard';
import router from './routes';
import './styles/global.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <RouterProvider router={router} />
      </AuthGuard>
    </QueryClientProvider>
  );
}

export default App;
