-- Sample data for Real-Time Dashboard Schema

-- Users
INSERT INTO user (idUser, username, password, email, permission) VALUES
('u1', 'editor_john', 'hashedpassword1', 'john@example.com', 'editor'),
('u2', 'viewer_jane', 'hashedpassword2', 'jane@example.com', 'viewer');

-- Tokens
INSERT INTO token (idToken, token, expiresAt, idUser) VALUES
('t1', 'tokenvalue1', '2025-12-31T23:59:59', 'u1');

-- Dashboards
INSERT INTO dashboard (idDashboard, title, autoRefresh, refreshInterval, idUser) VALUES
('d1', 'Sales Dashboard', TRUE, 60, 'u1');

-- Layouts
INSERT INTO layout (idLayout, numOfRows, numOfColumns, idDashboard) VALUES
('l1', 3, 3, 'd1');

-- Widget Types
INSERT INTO widgetType (idWidgetType, type) VALUES
('wt1', 'BarChart'),
('wt2', 'LineChart');

-- Real-Time Connections
INSERT INTO realTimeConnection (idRealTimeConnection, protocol, endpoint_, status_) VALUES
('rtc1', 'WebSocket', 'ws://localhost:8000/stream', 'active');

-- Data Source Types
INSERT INTO dataSourceType (idDataSourceType, type) VALUES
('dst1', 'API'),
('dst2', 'Database');

-- Data Sources
INSERT INTO dataSource (idDataSource, name, url, refreshRate, idDashboard, idDataSourceType, idRealTimeConnection) VALUES
('ds1', 'Sales API', 'https://api.example.com/sales', 30, 'd1', 'dst1', 'rtc1');

-- Widgets
INSERT INTO widget (idWidget, row, column, width, height, realTimeEnabled, idLayout, idDataSource, idWidgetType) VALUES
('w1', 0, 0, 3, 2, TRUE, 'l1', 'ds1', 'wt1');

-- Attribute Types
INSERT INTO attributeType (idAttributeType, type) VALUES
('at1', 'String'),
('at2', 'Number');

-- Table Entities
INSERT INTO tableEntity (idTable, name, description) VALUES
('tbl1', 'Sales Table', 'Monthly sales data');

-- Attributes
INSERT INTO attribute (idAttribute, name, index_, idAttributeType) VALUES
('a1', 'Month', 0, 'at1'),
('a2', 'Revenue', 1, 'at2');

-- Table Attributes
INSERT INTO tableAttribute (idTable, idAttribute) VALUES
('tbl1', 'a1'),
('tbl1', 'a2');

-- Row Entities
INSERT INTO rowEntity (idRow, value) VALUES
('r1', 'January'),
('r2', '5000');

-- Table Rows
INSERT INTO tableRow (idTable, idRow) VALUES
('tbl1', 'r1'),
('tbl1', 'r2');
