CREATE TABLE IF NOT EXISTS activity_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pentest_request_id INT,
    action_type ENUM('CREATE_REQUEST', 'UPDATE_REQUEST', 'GENERATE_REPORT') NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (pentest_request_id) REFERENCES pentest_requests(pentest_request_id)
);