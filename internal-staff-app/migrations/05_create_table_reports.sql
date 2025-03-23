CREATE TABLE IF NOT EXISTS reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    report_type ENUM('REQUIREMENT_VALIDATION', 'RISK_ASSESSMENT', 'DRAFT_SOW', 'FINAL_SOW') NOT NULL,
    content JSON,
    status ENUM('DRAFT', 'SENT', 'APPROVED') DEFAULT 'DRAFT',
    created_by INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES project_details(project_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);