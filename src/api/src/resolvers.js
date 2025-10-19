const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { users, dashboards, widgets } = require("./db");
const { v4: uuidv4 } = require('uuid');

const resolvers = {
  Query: {
    getUser: (_, { id }, { user }) => {
      if (!user) throw new Error("Não autenticado!");
      return users.find((u) => u.id === id);
    },
    getDashboard: (_, { id }) => dashboards.find(dashboard => dashboard.id === id) || null,
    getDashboardByUsername: (_, { username }) => {
      const user = users.find((u) => u.username === username);
      if (!user) throw new Error("User not found");
      return dashboards.filter((d) => d.userId === user.id);
    },
    getDashboardByUserId: (_, { userId }) => dashboards.filter((d) => d.userId === userId),
    getWidgetById: (_, { id }) => {
      const widget = widgets.find(w => w.id === id);
      if (!widget) throw new Error("Widget não encontrado!");
      return widget;
    },
    getDataSources: () => {
      const allDataSources = dashboards.flatMap(d => d.dataSources || []);
      return allDataSources;
    },
  },

  Mutation: {
    register: async (_, { username, email, password, permission }) => {
      if (users.find(user => user.email === email)) {
        throw new Error("Email já em uso!");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: uuidv4(),
        username,
        email,
        password: hashedPassword,
        permission,
        dashboards: []
      };
      users.push(newUser);
      return newUser;
    },

    login: async (_, { email, password }) => {
      const user = users.find((u) => u.email === email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Credenciais inválidas!");
      }
      const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
      const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();
      return { token, expiresAt, username: user.username };
    },

    createDashboard: (_, { title }, { user }) => {
      if (!user) throw new Error("Não autenticado!");
      const newDashboard = {
        id: uuidv4(),
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        widgets: [],
        dataSources: [],
      };
      dashboards.push(newDashboard);
      return newDashboard;
    },

    deleteDashboard: (_, { id }, { user }) => {
      if (!user) throw new Error("Não autenticado!");
      const index = dashboards.findIndex(d => d.id === id && d.userId === user.id);
      if (index === -1) throw new Error("Dashboard não encontrado ou sem permissão.");
      return dashboards.splice(index, 1)[0];
    },

    createWidget: (_, { dashboardId, row, column, width, height, type, dataSourceId, parsedData, title, body }) => {
      const dashboard = dashboards.find(d => d.id === dashboardId);
      if (!dashboard) throw new Error("Dashboard não encontrado!");

      const newWidget = {
        id: uuidv4(),
        row,
        column,
        width,
        height,
        type,
        dataSourceId: dataSourceId || null,
        parsedData: parsedData || null,
        title: title || null,
        body: body || null 
      };

      widgets.push(newWidget);
      dashboard.widgets.push(newWidget);
      return newWidget;
    },

    updateWidgetLayout: (_, { id, row, column, width, height }) => {
      const widget = widgets.find(w => w.id === id);
      if (!widget) throw new Error("Widget não encontrado!");
      widget.row = row;
      widget.column = column;
      widget.width = width;
      widget.height = height;
      return widget;
    },

    deleteWidget: (_, { id }) => {
      const index = widgets.findIndex(w => w.id === id);
      if (index === -1) throw new Error("Widget não encontrado!");
      const deleted = widgets.splice(index, 1)[0];
      dashboards.forEach(d => {
        if (Array.isArray(d.widgets)) {
          d.widgets = d.widgets.filter(w => w.id !== id);
        }
      });
      return deleted;
    },

    createDataSource: (_, { dashboardId, name, url, type }) => {
      const dashboard = dashboards.find(d => d.id === dashboardId);
      if (!dashboard) throw new Error("Dashboard não encontrado!");

      const newDataSource = {
        id: uuidv4(),
        name,
        url,
        type: { type, createdAt: new Date().toISOString() }
      };

      dashboard.dataSources.push(newDataSource);
      return newDataSource;
    }
  },
};

module.exports = resolvers;
