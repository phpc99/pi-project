import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { handleLogout } from "../auth";
import "../styles/Dashboard.css";
import { useQuery, gql, useMutation } from "@apollo/client";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import ChartWidget from "./ChartWidget";

const CREATE_WIDGET = gql`
  mutation CreateWidget(
    $dashboardId: ID!
    $row: Int!
    $column: Int!
    $width: Int!
    $height: Int!
    $type: String!
    $dataSourceId: ID
    $parsedData: String
    $title: String
    $body: String
  ) {
    createWidget(
      dashboardId: $dashboardId
      row: $row
      column: $column
      width: $width
      height: $height
      type: $type
      dataSourceId: $dataSourceId
      parsedData: $parsedData
      title: $title
      body: $body
    ) {
      id
      row
      column
      width
      height
      type
      dataSourceId
      parsedData
      title
      body
    }
  }
`;

const CREATE_DATASOURCE = gql`
  mutation CreateDataSource($dashboardId: ID!, $name: String!, $url: String!, $type: String!) {
    createDataSource(dashboardId: $dashboardId, name: $name, url: $url, type: $type) {
      id
      name
    }
  }
`;

const DELETE_WIDGET = gql`
  mutation DeleteWidget($id: ID!) {
    deleteWidget(id: $id) {
      id
    }
  }
`;

const UPDATE_WIDGET_LAYOUT = gql`
  mutation UpdateWidgetLayout(
    $id: ID!
    $row: Int!
    $column: Int!
    $width: Int!
    $height: Int!
  ) {
    updateWidgetLayout(
      id: $id
      row: $row
      column: $column
      width: $width
      height: $height
    ) {
      id
      row
      column
      width
      height
    }
  }
`;

const GET_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!) {
    getDashboard(id: $id) {
      id
      title
      dataSources {
        id
        name
        url
        type {
          type
        }
      }
      widgets {
        id
        row
        column
        width
        height
        type
        dataSourceId
        parsedData
        title
        body
      }
    }
  }
`;

export default function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showDataSources, setShowDataSources] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openWidgetMenu, setOpenWidgetMenu] = useState(null);
  const [widgetToDelete, setWidgetToDelete] = useState(null);
  const [showTextWidgetForm, setShowTextWidgetForm] = useState(false);
  const [textWidgetTitle, setTextWidgetTitle] = useState("");
  const [textWidgetBody, setTextWidgetBody] = useState("");
  const [chartType, setChartType] = useState("bar"); 

  const GRID_COLS = 12; // added 
  const GRID_ROW_HEIGHT = 60; // added 
  const GRID_WIDTH = 1800; // added

  const { data, loading, error } = useQuery(GET_DASHBOARD_BY_ID, {
    variables: { id },
  });

  const [createWidget] = useMutation(CREATE_WIDGET, {
    refetchQueries: [{ query: GET_DASHBOARD_BY_ID, variables: { id } }],
  });

  const [createDataSource] = useMutation(CREATE_DATASOURCE, {
    refetchQueries: [{ query: GET_DASHBOARD_BY_ID, variables: { id } }],
  });

  const [deleteWidget] = useMutation(DELETE_WIDGET, {
    refetchQueries: [{ query: GET_DASHBOARD_BY_ID, variables: { id } }],
  });

  const [updateWidgetLayout] = useMutation(UPDATE_WIDGET_LAYOUT);
  const token = localStorage.getItem("authToken");
  let username = "Guest";
  try {
    if (token) {
      const decodedData = JSON.parse(atob(token.split(".")[1]));
      username = decodedData.username || "Guest";
    }
  } catch (error) {
    console.error("Failed to decode token:", error.message);
  }

  const handleLayoutChange = async (newLayout) => {
    newLayout.forEach((layoutItem) => {
      const widgetId = layoutItem.i;
      const row = layoutItem.y;
      const column = layoutItem.x;
      const width = layoutItem.w;
      const height = layoutItem.h;

      updateWidgetLayout({
        variables: { id: widgetId, row, column, width, height },
      })
        .then((response) => {
          console.log("Widget layout updated successfully:", response.data.updateWidgetLayout);
        })
        .catch((error) => {
          console.error("Error updating widget layout:", error.message);
        });
    });
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:4001/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        const { fileUrl, parsedData } = result;

        const dataSourceResponse = await createDataSource({
          variables: {
            dashboardId: id,
            name: selectedFile.name,
            url: fileUrl,
            type: "CSV",
          },
        });

        const newDataSourceId = dataSourceResponse.data.createDataSource.id;

        await createWidget({
          variables: {
            dashboardId: id,
            row: 0,
            column: 0,
            width: 3,
            height: 3,
            type: chartType === "bar" || chartType === "pie" ? "Chart" : "Sample",
            dataSourceId: newDataSourceId,
            title: "",
            body: "",
            parsedData: JSON.stringify({
              data: parsedData,
              chartType: chartType,
            }),
          },
        });

        setShowUploadForm(false);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Upload or widget creation failed:", error);
    }
  };

  const handleAddWidgetClick = () => {
    setShowTextWidgetForm(true);
    setTextWidgetTitle("");
    setTextWidgetBody("");
  };

  const handleTextWidgetSubmit = async (e) => {
    e.preventDefault();
    await createWidget({
      variables: {
        dashboardId: id,
        row: 0,
        column: 0,
        width: 4,
        height: 4,
        type: "Text",
        dataSourceId: null,
        parsedData: null,
        title: textWidgetTitle,
        body: textWidgetBody,
      },
    });
    setShowTextWidgetForm(false);
    setTextWidgetTitle("");
    setTextWidgetBody("");
  };

  const handleWidgetMenuOpen = (widgetId) => {
    setOpenWidgetMenu((prev) => (prev === widgetId ? null : widgetId));
  };

  const handleWidgetMenuClose = () => {
    setOpenWidgetMenu(null);
  };

  const handleDeleteWidget = (widgetId) => {
    deleteWidget({ variables: { id: widgetId } })
      .then(() => setWidgetToDelete(null))
      .catch((error) => {
        console.error("Error deleting widget:", error.message);
      });
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error loading dashboard: {error.message}</p>;

  const dashboard = data?.getDashboard;
  const files = dashboard?.dataSources || [];
  const layout = dashboard?.widgets?.map((widget) => ({
    i: widget.id,
    x: widget.column,
    y: widget.row,
    w: widget.width,
    h: widget.height,
  })) || [];

  const singleColumnWidth = GRID_WIDTH / GRID_COLS; 

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-buttons">
          <button className="home-button" onClick={() => navigate("/home")}>
            Home
          </button>
        </div>
        <div className="dashboard-title">
          <h1>{dashboard?.title || "Dashboard"}</h1>
        </div>
        <div className="user-info-container">
          <div className="user-info" onClick={() => setShowLogout(!showLogout)}>
            <span className="user-username">{username}</span>
            <img
              src={`https://ui-avatars.com/api/?name=${username}&background=32cd32&color=ffffff&size=128`}
              alt="Profile"
              className="profile-picture"
            />
          </div>
          <div className={`logout-popout ${showLogout ? "show" : ""}`}>
            <button className="logout-button" onClick={() => handleLogout(navigate)}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="toolbar">
          <button className="toolbar-button" onClick={handleAddWidgetClick}>Add Text Widget</button>
          <button className="toolbar-button" onClick={() => setShowUploadForm(true)}>Upload File</button>
          <button className="toolbar-button" onClick={() => setShowDataSources(prev => !prev)}>
            {showDataSources ? "Hide Data Sources" : "Show Data Sources"}
          </button>
        </div>

        <div className="visualization-window">
          <GridLayout
            className="layout"
            layout={layout}
            cols={GRID_COLS} // added
            rowHeight={GRID_ROW_HEIGHT} // added
            width={GRID_WIDTH} // added
            onDragStop={handleLayoutChange}
            onResizeStop={handleLayoutChange}
            compactType={"vertical"}
            draggableHandle=".widget-drag-handle"
          >
            {dashboard?.widgets?.map((widget) => (
              <div
                key={widget.id}
                className="widget-card"
                style={{
                  position: "relative",
                  width: widget.width * singleColumnWidth - 32,
                  height: widget.height * GRID_ROW_HEIGHT - 32,
                  minWidth: 120,
                  minHeight: 80,
                  maxWidth: "100%",
                  maxHeight: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div
                  className="widget-drag-handle"
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    width: 24,
                    height: 24,
                    cursor: "grab",
                    zIndex: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(50,205,50,0.12)",
                    borderRadius: 4,
                  }}
                  title="Drag widget"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#32cd32">
                    <circle cx="3" cy="3" r="2" />
                    <circle cx="3" cy="8" r="2" />
                    <circle cx="3" cy="13" r="2" />
                    <circle cx="8" cy="3" r="2" />
                    <circle cx="8" cy="8" r="2" />
                    <circle cx="8" cy="13" r="2" />
                  </svg>
                </div>

                <button
                  className="widget-menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWidgetMenuOpen(widget.id);
                  }}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 2,
                    padding: 0,
                  }}
                  aria-label="Open widget menu"
                >
                  <span style={{ fontSize: "1.5em", color: "#e0e0e0" }}>⋮</span>
                </button>

                {openWidgetMenu === widget.id && (
                  <div className="widget-popup-menu" style={{
                    position: "absolute",
                    top: 32,
                    right: 8,
                    background: "#232323",
                    border: "1px solid #32cd32",
                    borderRadius: 5,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    zIndex: 10,
                    minWidth: 100,
                    padding: "0.5em",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                  }}>
                    <button className="widget-delete-btn"
                      style={{
                        background: "#ff4d4f",
                        color: "#fff",
                        border: "none",
                        borderRadius: 3,
                        padding: "0.5em",
                        cursor: "pointer",
                        marginBottom: "0.2em",
                      }}
                      onClick={() => {
                        setWidgetToDelete(widget.id);
                        setOpenWidgetMenu(null);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      style={{
                        background: "transparent",
                        color: "#e0e0e0",
                        border: "none",
                        borderRadius: 3,
                        padding: "0.3em",
                        cursor: "pointer",
                        fontSize: "0.9em",
                      }}
                      onClick={handleWidgetMenuClose}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <div
                  className="widget-title"
                  style={{ cursor: "pointer" }}
                >
                  {widget.title || `${widget.type} Widget`}
                </div>
                {widget.body && (
                  <div
                    className="widget-body"
                    style={{ cursor: "pointer" }}
                  >
                    {widget.body}
                  </div>
                )}
                {widget.type === "Chart" && widget.parsedData && (() => {
                  let parsed; 
                  try {
                    parsed = JSON.parse(widget.parsedData);
                  } catch (e) {
                    console.error("Invalid parsedData:", e);
                    return null;
                  }

                  const keys = Object.keys(parsed.data[0] || {});
                  const xKey = keys[0];
                  const yKey = keys[1];

                  return (
                    <>
                      <ChartWidget
                        data={parsed.data}
                        type={parsed.chartType}
                        xKey={xKey}
                        yKey={yKey}
                        width={widget.width * singleColumnWidth - 32} 
                        height={widget.height * GRID_ROW_HEIGHT - 100} 
                      />
                      <h3> {xKey} and {yKey} </h3>
                    </>
                  );
                })()}
              </div>
            ))}

          </GridLayout>

          {showDataSources && files.length > 0 && (
            <div className="uploaded-files" style={{ marginTop: "1em" }}>
              <h4>Available Data Sources</h4>
              <ul>
                {files.map((file) => (
                  <li key={file.id}>
                    <strong>{file.name}</strong> - <small>{file.url}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {widgetToDelete && (
        <div className="delete-popup">
          <div className="popup-content">
            <p>Are you sure you want to delete this widget?</p>
            <div className="popup-buttons">
              <button className="confirm-button" onClick={() => handleDeleteWidget(widgetToDelete)}>Yes</button>
              <button className="cancel-button" onClick={() => setWidgetToDelete(null)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Data Sources Popup */}
      {showDataSources && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#232323",
              borderRadius: 10,
              padding: "2em",
              minWidth: 350,
              maxWidth: "90vw",
              maxHeight: "80vh",
              overflowY: "auto",
              color: "#e0e0e0",
              boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
              position: "relative",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "#32cd32",
                color: "#232323",
                border: "none",
                borderRadius: 4,
                padding: "0.3em 0.8em",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1em",
              }}
              onClick={() => setShowDataSources(false)}
            >
              X
            </button>
            <h4 style={{ marginTop: 0 }}>Available Data Sources</h4>
            {files.length === 0 ? (
              <p style={{ color: "#aaa" }}>No data sources available.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {files.map((file) => (
                  <li key={file.id} style={{ marginBottom: "0.7em" }}>
                    <strong>{file.name}</strong>
                    <span style={{ marginLeft: "1em", fontSize: "0.95em", color: "#aaa" }}>{file.url}</span>
                    <span style={{ marginLeft: "1em", fontSize: "0.95em", color: "#aaa" }}>{file.type?.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {showUploadForm && (
        <div className="dashboard-upload-overlay" style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <form onSubmit={handleFileUpload} className="dashboard-upload-form" style={{
            background: "#232323",
            padding: "2rem",
            borderRadius: 8,
            minWidth: 300
          }}>
            <h3>Upload CSV File</h3>
            <input type="file" onChange={handleFileChange} accept=".csv" className="dashboard-upload-input" style={{ marginBottom: "1em" }} />

            <label htmlFor="chartType" style={{ display: "block", marginBottom: "0.5em", color: "#e0e0e0" }}>
              Chart Type:
            </label>
            <select
              id="chartType"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              style={{ marginBottom: "1em", padding: "0.4em", borderRadius: 4 }}
            >
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
            </select>

            <div className="dashboard-upload-buttons" style={{ display: "flex", justifyContent: "space-between" }}>
              <button type="submit" className="create-button">Upload</button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowUploadForm(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Text Widget Creation Form */}
      {showTextWidgetForm && (
        <div className="dashboard-upload-overlay">
          <form className="dashboard-upload-form" onSubmit={handleTextWidgetSubmit}>
            <h3>Create Text Widget</h3>
            <label style={{ color: "#e0e0e0", marginBottom: "0.5em" }}>
              Title:
              <input
                type="text"
                value={textWidgetTitle}
                onChange={e => setTextWidgetTitle(e.target.value)}
                required
                style={{ width: "100%", marginTop: "0.3em", marginBottom: "1em" }}
              />
            </label>
            <label style={{ color: "#e0e0e0", marginBottom: "0.5em" }}>
              Text:
              <textarea
                value={textWidgetBody}
                onChange={e => setTextWidgetBody(e.target.value)}
                rows={4}
                required
                style={{ width: "100%", marginTop: "0.3em", marginBottom: "1em" }}
              />
            </label>
            <div className="dashboard-upload-buttons">
              <button type="submit" className="create-button">Create</button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowTextWidgetForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
