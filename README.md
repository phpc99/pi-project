# Features

- Developed a web-based platform that enables users to create and manage customizable dashboards dynamically;
- Implemented user authentication (registration, login, logout) with JWT-based security, ensuring private dashboards and data isolation;
- Supported dashboard creation, editing, and deletion, with real-time updates and responsive layout management;
- Enabled widget management, allowing users to add, remove, resize, and reposition visual or textual elements interactively;
- Integrated CSV file upload for importing data and transforming it into visual insights;
- Implemented data visualization widgets using D3.js, supporting bar and pie charts with automatic mapping of CSV data fields;
- Designed a three-tier architecture (frontend, backend, and database) for scalability and maintainability;
- Developed an independent Express server for handling file uploads, converting CSV data into JSON for visualization;
- Utilized Apollo Server and GraphQL API to manage dashboards, widgets, and data sources efficiently;
- Created a responsive and intuitive frontend using React, React Router, and Apollo Client for seamless user interaction;
- Modeled and implemented a relational database in SQLite, supporting entities like users, widgets, data sources, and layouts;
- Conducted API validation and testing through Apollo Sandbox, ensuring correctness of queries, mutations, and database persistence;
- Adopted an iterative Agile development process, with weekly sprints, code versioning in GitLab, and collaboration via Discord;
- Ensured scalability and future extensibility, with support planned for real-time data sources, new chart types, and advanced dashboard interactivity.

# Report

https://github.com/phpc99/pi-project/blob/main/docs/PE17.pdf

# How to run the project
1. Open 3 WSL terminals;
2. In the first terminal, run the following commands to start the main server:
```
cd src/api/src
node server.js
```
3. In the second terminal, run the following commands to start the upload server:
```
cd src/api/src
node uploadServer.js
```
4. In the third terminal, run the following commands to start the frontend:
```
cd src/frontend/my-app
npm run dev
```
5. After executing the previous steps, click on the localhost link displayed in the frontend terminal.
6. If npm run dev doesn’t work, try installing the dependencies first:
```
npm install
```
# Authors

- Hugo Miguel Lopes da Cruz
- Matheus Negrini Liotti
- Pedro Henrique Pessôa Camargo
- Tomas dos Santos Nunes Loureiro Esteves
