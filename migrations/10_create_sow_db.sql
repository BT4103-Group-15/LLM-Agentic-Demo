CREATE TABLE IF NOT EXISTS sow_db (
  client_id varchar(255) PRIMARY KEY,
  project_id varchar(255),
  email VARCHAR(255),
  sowsheet_markdown TEXT,
  sowsheet_URL TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);