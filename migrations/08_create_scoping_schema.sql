CREATE TABLE IF NOT EXISTS scope_db (
  client_id varchar(255) PRIMARY KEY,
  project_id varchar(255),
  email VARCHAR(255),
  scopingsheet_markdown TEXT,
  scopingsheet_URL TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
