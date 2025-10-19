import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "../styles/Login.css"; // Reuse Login styles
import { useNavigate } from "react-router-dom";

// GraphQL mutation for user registration
const REGISTER_USER = gql`
  mutation RegisterUser(
    $username: String!
    $email: String!
    $password: String!
    $permission: PermissionType!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      permission: $permission
    ) {
      id
      username
      email
    }
  }
`;

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [permission, setPermission] = useState("EDITOR"); // Default to EDITOR
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // Initialize navigate
  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: () => {
      setSuccess("Registration successful! You can now log in.");
      setError("");
    },
    onError: (err) => {
      setError(err.message);
      setSuccess("");
      setTimeout(() => {
        setError("");
      }, 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Username, email, and password cannot be empty.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    registerUser({
      variables: {
        username,
        email,
        password,
        permission,
      },
    });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        {!success && (
          <button
            className="button"
            id="back-button"
            type="button"
            onClick={() => navigate(-1)}
          >
            ←
          </button>
        )}
        <h2 className="title">Register</h2>

        <input
          className="input"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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

        <select
          className="input"
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
        >
          <option value="EDITOR">Editor</option>
          <option value="VIEWER">Viewer</option>
        </select>

        <div className="error-container">
          {error && <p className="error">{error}</p>}
        </div>

        {/* Success message container */}
        {success && <p className="success">{success}</p>}
        {success ? (
          <button
            className="button"
            type="button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        ) : (
          <button className="button" type="submit">
            Register
          </button>
        )}
      </form>
    </div>
  );
}