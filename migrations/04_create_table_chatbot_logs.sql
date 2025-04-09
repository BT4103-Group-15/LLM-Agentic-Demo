CREATE TABLE IF NOT EXISTS chatbot_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    chat_history JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES project_details(project_id) ON DELETE CASCADE
);
