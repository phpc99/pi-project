import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/Login.css"; 

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); // Initialize navigate

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use the onLogin prop for authentication
    const result = await onLogin(email, password);
    if (result.success) {
      setError(""); // Clear error on successful login
    } else {
      setError(result.message || "Invalid credentials. Please try again."); // Display error message
      setPassword(""); // Clear the password field

      // Clear the error message after 3 seconds
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="title">Login</h2>

        <input
          className="input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Error message container with fixed space */}
        <div className="error-container">
          {error && <p className="error">{error}</p>}
        </div>

        <button className="button" type="submit">
          Log In
        </button>
        <button
          type="button"
          className="button"
          id="register-button"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </form>
    </div>
  );
}
