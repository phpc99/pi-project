import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated, handleLogin } from './auth';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register'; // Import Register page
import Dashboard from './pages/Dashboard'; // Import Dashboard page
import './styles/Login.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'; // Import Apollo Client
import { client } from "./apolloClient"; // Ensure this path matches the file location

// PrivateRoute component
function PrivateRoute({ element }) {
  return isAuthenticated() ? element : <Navigate to="/login" />;
}

function App() {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <ApolloProvider client={client}> {/* Ensure ApolloProvider wraps the app */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect root to login */}
        <Route
          path="/login"
          element={
            <Login
              onLogin={(email, password) =>
                handleLogin(email, password, () => navigate("/home"))
              }
            />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/:id" element={<PrivateRoute element={<Dashboard />} />} /> {/* Add Dashboard route */}
        <Route path="/home" element={<PrivateRoute element={<Home />} />} /> {/* Optionally, move Home to /home */}
      </Routes>
    </ApolloProvider>
  );
}

export default App;
