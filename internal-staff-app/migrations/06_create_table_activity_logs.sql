CREATE TABLE IF NOT EXISTS activity_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    action_type ENUM('CREATE_REQUEST', 'UPDATE_REQUEST', 'GENERATE_REPORT') NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES project_details(project_id)
);