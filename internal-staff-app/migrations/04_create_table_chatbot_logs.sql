CREATE TABLE IF NOT EXISTS chatbot_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    pentest_request_id INT,
    user_input JSON,
    bot_response JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pentest_request_id) REFERENCES pentest_requests(pentest_request_id)
);
