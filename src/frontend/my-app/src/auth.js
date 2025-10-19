import { gql } from "@apollo/client";
import { client } from "./apolloClient"; // Import Apollo Client instance

// GraphQL mutation for login
const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      expiresAt
      username
    }
  }
`;

// Login function using Apollo
export const login = async (email, password) => {
  try {
    const { data } = await client.mutate({
      mutation: LOGIN_USER,
      variables: { email, password },
    });
    const { token, username } = data.login; // Extract token and username from response
    localStorage.setItem("authToken", token); // Save token to localStorage
    await client.resetStore(); // clear & reload data with new auth token
    localStorage.setItem("username", username); // Save username to localStorage
    return true;
  } catch (error) {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      console.error("Login failed:", error.graphQLErrors[0].message); // Log specific GraphQL error
    } else {
      console.error("Login failed:", error.message); // Log generic error
      alert("An unexpected error occurred. Please try again."); // Display fallback error message
    }
    return false;
  }
};

// Logout function
export const logout = async () => {
  localStorage.removeItem("authToken");
  await client.clearStore(); // clear cached data
  localStorage.removeItem("username"); // Remove username from localStorage
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token; // Check if token exists
};

// Handle login with navigation
export const handleLogin = async (email, password, navigate) => {
  if (await login(email, password)) {
    const token = localStorage.getItem("authToken"); // Reload token after login
    if (token) {
      console.log("Token reloaded:", token); // Log reloaded token for debugging
    }
    navigate("/"); // Redirect to home page on successful login
    return true; // Indicate success
  }
  return false; // Indicate failure
};

// Handle logout with navigation
export const handleLogout = (navigate) => {
  logout();
  navigate("/login"); // Redirect to login page after logout
};
