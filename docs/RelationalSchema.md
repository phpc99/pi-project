# Relational Schema for [UMLv6](https://gitlab.com/andrethiagonetto/dynamic-dashboard-backend/-/blob/main/UML/UMLv6.png)

| Relation Reference | Attributes                                                                                                                                                                               |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| R01                | token (<ins>idToken</ins>, token, expiresAt, idUser -> user)                                                                                                                             |
| R02                | user (<ins>idUser</ins>, username, password, email, permission)                                                                                                                          |
| R03                | dashboard (<ins>idDashboard</ins>, title, createdAt, updatedAt, autoRefresh, refreshInterval, idUser -> user)                                                                            |
| R04                | layout (<ins>idLayout</ins>, numOfRows, numOfColumns, idDashboard -> dashboard)                                                                                                          |
| R05                | widget (<ins>idWidget</ins>, row, column, width, height, realTimeEnabled, updatedAt, idLayout -> layout, idDataSource -> dataSource, idWidgetType -> widgetType)                         |
| R06                | dataSource (<ins>idDataSource</ins>, name, url, refreshRate, lastFetchedAt, idDashboard -> dashboard, idDataSourceType -> dataSourceType, idRealTimeConnection -> realTimeConnection)    |
| R07                | table (<ins>idTable</ins>, name, description, updatedAt)                                                                                                                                 |
| R08                | attribute (<ins>idAttribute</ins>, name, index, idAttributeType -> attributeType)                                                                                                        |
| R09                | row (<ins>idRow</ins>, value)                                                                                                                                                            |
| R10                | tableAttribute (<ins>idTable</ins> -> table, <ins>idAttribute</ins> -> attribute)                                                                                                        |
| R11                | tableRow (<ins>idTable</ins> -> table, <ins>idRow</ins> -> row)                                                                                                                          |
| R12                | widgetType (<ins>idWidgetType</ins>, type, createdAt)                                                                                                                                    |
| R13                | dataSourceType (<ins>idDataSourceType</ins>, type, createdAt)                                                                                                                            |
| R14                | attributeType (<ins>idAttributeType</ins>, type, createdAt)                                                                                                                              |
| R15                | realTimeConnection(<ins>idRealTimeConnection</ins>, protocol, endpoint, status)                                                                                                          |

### Domains

| Domain Name    | Domain Specification       |
|----------------|----------------------------|
| permissionType | ENUM ('editor', 'viewer')  |