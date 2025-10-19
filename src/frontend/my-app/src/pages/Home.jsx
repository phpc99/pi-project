import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { handleLogout } from "../auth"; // Import handleLogout
import "../styles/Home.css";
import { useQuery, gql, useMutation } from "@apollo/client"; // Import useMutation

export default function Home() {
  const navigate = useNavigate(); // Initialize navigate
  const [showLogout, setShowLogout] = useState(false); // State to toggle logout button
  const [dashboardTitle, setDashboardTitle] = useState(""); // State for dashboard title
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [selectedDashboard, setSelectedDashboard] = useState(null); // State to track selected dashboard for options
  const [dashboardToDelete, setDashboardToDelete] = useState(null); // State to track dashboard to delete

  const token = localStorage.getItem("authToken");

  let username = "Guest"; // Default username
  let userId = null; // Default user ID
  try {
    if (token) {
      console.log("Token found:", token); // Log token for debugging
      const decodedData = JSON.parse(atob(token.split(".")[1])); // Decode token payload
      console.log("Decoded token data:", decodedData); // Log decoded data for debugging
      username = decodedData.username || "Guest"; // Extract username or fallback to "Guest"
      userId = decodedData.id || null; // Extract user ID or fallback to null
    } else {
      throw new Error("Token is missing");
    }
  } catch (error) {
    console.error("Failed to decode token:", error.message);
  }

  if (!userId) {
    console.error("User ID is null. Unable to fetch dashboards.");
  }

  const GET_DASHBOARDS_BY_USER_ID = gql`
    query GetDashboardsByUserId($userId: ID!) {
      getDashboardByUserId(userId: $userId) {
        id
        title
      }
    }
  `;

  const CREATE_DASHBOARD = gql`
    mutation CreateDashboard($title: String!) {
      createDashboard(title: $title) {
        id
        title
      }
    }
  `;

  const DELETE_DASHBOARD = gql`
    mutation DeleteDashboard($id: ID!) {
      deleteDashboard(id: $id) {
        id
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_DASHBOARDS_BY_USER_ID, {
    variables: { userId }, // Use user ID from token
    skip: !userId, // Skip query if user ID is not available
    onCompleted: (data) => {
      console.log("User ID:", userId);
      console.log("Query result:", data); // Log the result when the query completes
    },
  });

  const [createDashboard] = useMutation(CREATE_DASHBOARD, {
    refetchQueries: [{ query: GET_DASHBOARDS_BY_USER_ID, variables: { userId } }],
  });

  const [deleteDashboard] = useMutation(DELETE_DASHBOARD, {
    refetchQueries: [{ query: GET_DASHBOARDS_BY_USER_ID, variables: { userId } }],
  });

  if (loading) return <p>Loading dashboards...</p>;
  if (error) return <p>Error loading dashboards: {error.message}</p>;

  const dashboards = data?.getDashboardByUserId || [];

  const toggleLogout = () => {
    setShowLogout((prev) => !prev); // Toggle visibility
  };

  const handleCreateDashboard = async () => {
    if (!dashboardTitle.trim()) {
      console.error("Dashboard title cannot be empty.");
      return;
    }
    try {
      const decodedData = JSON.parse(atob(token.split(".")[1])); // Decode token payload
      const userId = decodedData?.id; // Safely extract user ID from token
      if (!userId) {
        throw new Error("User ID is missing from the token.");
      }
      await createDashboard({ variables: { title: dashboardTitle, userId } });
      console.log(`Dashboard "${dashboardTitle}" created successfully.`);
      setDashboardTitle(""); // Clear the input field
      setShowForm(false); // Hide the form after creation
    } catch (error) {
      console.error("Error creating dashboard:", error.message);
      if (error.message.includes("Não autenticado")) {
        console.error("Error: User not authenticated!");
        navigate("/login"); // Redirect to login page
      } else {
        console.error("Error creating dashboard:", error.message);
      }
    }
  };

  const handleDeleteDashboard = async () => {
    try {
      if (dashboardToDelete) {
        await deleteDashboard({ variables: { id: dashboardToDelete } });
        console.log(`Dashboard with ID "${dashboardToDelete}" deleted successfully.`);
        setDashboardToDelete(null); // Reset dashboard to delete
      }
    } catch (error) {
      if (error.message.includes("Não autenticado")) {
        console.error("Error: User not authenticated!");
        navigate("/login"); // Redirect to login page
      } else if (error.message.includes("Dashboard não encontrado")) {
        console.error("Error: Dashboard not found or no permission to delete!");
      } else {
        console.error("Error deleting dashboard:", error.message);
      }
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <h2 className="dashboard-title">Your Dashboards</h2>
        <div className="user-info-container">
          <div className="user-info" onClick={toggleLogout}> {/* Toggle on click */}
            <span className="user-username">{username}</span> 
            <img
              src={`https://ui-avatars.com/api/?name=${username}&background=32cd32&color=ffffff&size=128`} //Mock image URL
              alt="Profile Picture"
              className="profile-picture"
            />
          </div>
          <div className={`logout-popout ${showLogout ? "show" : ""}`}> {/* Apply show class */}
            <button className="logout-button" onClick={() => handleLogout(navigate)}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="dashboard-gallery">
        {dashboards.map((dashboard) => (
          <div
            key={dashboard.id}
            className="dashboard-card"
            onClick={() => navigate(`/dashboard/${dashboard.id}`)} // Navigate to Dashboard page
          >
            <div className="dashboard-thumbnail">
              <span className="image-placeholder">🖼️</span>
            </div>
            <p>{dashboard.title}</p>
            <button
              className="options-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering navigation
                setSelectedDashboard((prev) => (prev === dashboard.id ? null : dashboard.id));
              }}
            >
              Options
            </button>
            {selectedDashboard === dashboard.id && (
              <div className="dashboard-options">
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering navigation
                    setDashboardToDelete(dashboard.id);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {dashboardToDelete && (
        <div className="delete-popup">
          <div className="popup-content">
            <p>Are you sure you want to delete this dashboard?</p>
            <div className="popup-buttons">
              <button className="confirm-button" onClick={handleDeleteDashboard}>
                Yes
              </button>
              <button className="cancel-button" onClick={() => setDashboardToDelete(null)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="dashboard-form-container">
        {showForm && (
          <div className="dashboard-form">
            <h3 className="form-title">Create New Dashboard</h3>
            <input
              type="text"
              placeholder="Enter dashboard title"
              value={dashboardTitle}
              onChange={(e) => setDashboardTitle(e.target.value)}
              className="dashboard-title-input"
            />
            <div className="form-buttons">
              <button className="button create-button" onClick={handleCreateDashboard}>
                Create
              </button>
              <button className="button cancel-button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <button className="add-dashboard-button" onClick={() => setShowForm(true)}>
        +
      </button>
    </div>
  );
}
