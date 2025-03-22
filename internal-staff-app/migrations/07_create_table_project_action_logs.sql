
CREATE TABLE IF NOT EXISTS project_action_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    action_type ENUM(
        'SCOPING_SHEET_SUBMISSION',
        'SCOPING_SHEET_APPROVAL', 
        'SOW_DRAFTING_TRIGGERED',
        'DRAFT_SOW_SUBMISSION',
        'SOW_APPROVAL',
        'FINAL_SOW_SENT_TO_CLIENT'
    ) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES pentest_requests(pentest_request_id)
);
