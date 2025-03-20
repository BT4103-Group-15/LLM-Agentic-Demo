CREATE TABLE IF NOT EXISTS reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    pentest_request_id INT NOT NULL,
    report_type ENUM('REQUIREMENT_VALIDATION', 'RISK_ASSESSMENT', 'DRAFT_SOW', 'FINAL_SOW') NOT NULL,
    content JSON,
    status ENUM('DRAFT', 'SENT', 'APPROVED') DEFAULT 'DRAFT',
    created_by INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pentest_request_id) REFERENCES pentest_requests(pentest_request_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);