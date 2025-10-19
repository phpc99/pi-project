-----------------------------------------
-- Drop old tables
-----------------------------------------

PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS token;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS dashboard;
DROP TABLE IF EXISTS layout;
DROP TABLE IF EXISTS widget;
DROP TABLE IF EXISTS dataSource;
DROP TABLE IF EXISTS tableEntity;
DROP TABLE IF EXISTS attribute;
DROP TABLE IF EXISTS rowEntity;
DROP TABLE IF EXISTS tableAttribute;
DROP TABLE IF EXISTS tableRow;
DROP TABLE IF EXISTS widgetType;
DROP TABLE IF EXISTS dataSourceType;
DROP TABLE IF EXISTS attributeType;
DROP TABLE IF EXISTS realTimeConnection; -- added for UMLv6

-----------------------------------------
-- Tables
-----------------------------------------

-- USER TABLE
CREATE TABLE user (
    idUser          TEXT PRIMARY KEY,
    username        TEXT UNIQUE NOT NULL,
    password        TEXT NOT NULL,
    email           TEXT UNIQUE NOT NULL,
    permission      TEXT NOT NULL CHECK (permission IN ('editor', 'viewer'))
);

-- TOKEN TABLE (Authentication)
CREATE TABLE token (
    idToken         TEXT PRIMARY KEY,
    token           TEXT UNIQUE NOT NULL,
    expiresAt       TEXT NOT NULL,
    idUser          TEXT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES user(idUser) ON DELETE CASCADE
);

-- DASHBOARD TABLE
CREATE TABLE dashboard (
    idDashboard         TEXT PRIMARY KEY,
    title               TEXT NOT NULL,
    createdAt           TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt           TEXT DEFAULT CURRENT_TIMESTAMP,
    autoRefresh         BOOLEAN NOT NULL DEFAULT TRUE,                  -- added for UMLv6
    refreshInterval     INTEGER NOT NULL CHECK (refreshInterval > 0),   -- added for UMLv6
    idUser              TEXT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES user(idUser) ON DELETE CASCADE
);

-- LAYOUT TABLE
CREATE TABLE layout (
    idLayout        TEXT PRIMARY KEY,
    numOfRows       INTEGER NOT NULL CHECK (numOfRows > 0),
    numOfColumns    INTEGER NOT NULL CHECK (numOfColumns > 0),
    idDashboard     TEXT NOT NULL,
    FOREIGN KEY (idDashboard) REFERENCES dashboard(idDashboard) ON DELETE CASCADE
);

-- WIDGET TYPE TABLE
CREATE TABLE widgetType (
    idWidgetType    TEXT PRIMARY KEY,
    type            TEXT NOT NULL,
    createdAt       TEXT DEFAULT CURRENT_TIMESTAMP
);

-- REAL TIME CONNECTION TABLE (added for UMLv6)
CREATE TABLE realTimeConnection (
    idRealTimeConnection    TEXT PRIMARY KEY,
    protocol                TEXT NOT NULL,
    endpoint_               TEXT NOT NULL,
    status_                 TEXT NOT NULL
);

-- DATA SOURCE TYPE TABLE
CREATE TABLE dataSourceType (
    idDataSourceType    TEXT PRIMARY KEY,
    type                TEXT NOT NULL,
    createdAt           TEXT DEFAULT CURRENT_TIMESTAMP
);

-- DATA SOURCE TABLE
CREATE TABLE dataSource (
    idDataSource            TEXT PRIMARY KEY,
    name                    TEXT NOT NULL,
    url                     TEXT NOT NULL,
    refreshRate             INTEGER NOT NULL CHECK (refreshRate > 0),       -- added for UMLv6
    lastFetchedAt           TEXT DEFAULT CURRENT_TIMESTAMP,                 -- added for UMLv6
    idDashboard             TEXT NOT NULL,
    idDataSourceType        TEXT NOT NULL,
    idRealTimeConnection    TEXT NOT NULL,
    FOREIGN KEY (idDashboard) REFERENCES dashboard(idDashboard) ON DELETE CASCADE,
    FOREIGN KEY (idDataSourceType) REFERENCES dataSourceType(idDataSourceType) ON DELETE RESTRICT,
    FOREIGN KEY (idRealTimeConnection) REFERENCES realTimeConnection(idRealTimeConnection) ON DELETE CASCADE    -- added for UMLv6
);

-- WIDGET TABLE
CREATE TABLE widget (
    idWidget            TEXT PRIMARY KEY,
    row                 INTEGER NOT NULL CHECK (row >= 0),
    column              INTEGER NOT NULL CHECK (column >= 0),
    width               INTEGER NOT NULL CHECK (width > 0),
    height              INTEGER NOT NULL CHECK (height > 0),
    realTimeEnabled     BOOLEAN NOT NULL DEFAULT TRUE,          -- added for UMLv6
    updatedAt           TEXT DEFAULT CURRENT_TIMESTAMP,         -- added for UMLv6
    idLayout            TEXT NOT NULL,
    idDataSource        TEXT NOT NULL,
    idWidgetType        TEXT NOT NULL,
    FOREIGN KEY (idWidgetType) REFERENCES widgetType(idWidgetType) ON DELETE RESTRICT,
    FOREIGN KEY (idLayout) REFERENCES layout(idLayout) ON DELETE CASCADE,
    FOREIGN KEY (idDataSource) REFERENCES dataSource(idDataSource) ON DELETE CASCADE
);

-- TABLE (Entity Representation)
CREATE TABLE tableEntity (
    idTable         TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    description     TEXT,
    createdAt       TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt       TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ATTRIBUTE TYPE TABLE
CREATE TABLE attributeType (
    idAttributeType     TEXT PRIMARY KEY,
    type                TEXT NOT NULL,
    createdAt           TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ATTRIBUTE (Column Definition)
CREATE TABLE attribute (
    idAttribute         TEXT PRIMARY KEY,
    name                TEXT NOT NULL,
    index_              INTEGER NOT NULL,
    idAttributeType     TEXT NOT NULL,
    FOREIGN KEY (idAttributeType) REFERENCES attributeType(idAttributeType) ON DELETE RESTRICT
);

-- ROW (Data Storage)
CREATE TABLE rowEntity (
    idRow           TEXT PRIMARY KEY,
    value           TEXT NOT NULL
);

-- TABLE_ATTRIBUTE (Mapping between Table and Attribute)
CREATE TABLE tableAttribute (
    idTable         TEXT NOT NULL,
    idAttribute     TEXT NOT NULL,
    PRIMARY KEY (idTable, idAttribute),
    FOREIGN KEY (idTable) REFERENCES tableEntity(idTable) ON DELETE CASCADE,
    FOREIGN KEY (idAttribute) REFERENCES attribute(idAttribute) ON DELETE CASCADE
);

-- TABLE_ROW (Mapping between Table and Row)
CREATE TABLE tableRow (
    idTable         TEXT NOT NULL,
    idRow           TEXT NOT NULL,
    PRIMARY KEY (idTable, idRow),
    FOREIGN KEY (idTable) REFERENCES tableEntity(idTable) ON DELETE CASCADE,
    FOREIGN KEY (idRow) REFERENCES rowEntity(idRow) ON DELETE CASCADE
);

-----------------------------------------
-- Indexes
-----------------------------------------

-- Index on User Table for searching users by email
CREATE INDEX idx_user_email ON user(email);

-- Index on Widget Table for searching widgets in a specific layout
CREATE INDEX idx_widget_layout ON widget(idLayout);

-- Index on Data Source Table for searching data sources by type
CREATE INDEX idx_dataSource_type ON dataSource(idDataSourceType);

-- Index on Dashboard Table for searching dashboards by user
CREATE INDEX idx_dashboard_user ON dashboard(idUser);