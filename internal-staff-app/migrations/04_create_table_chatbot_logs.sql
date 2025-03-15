CREATE TABLE IF NOT EXISTS clients (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT,
    user_input JSON,
    bot_response JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(request_id)
);
