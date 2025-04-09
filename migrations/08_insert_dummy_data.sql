INSERT INTO clients (company_name, contact_name, email) VALUES 
('Acme Corporation', 'Wile E. Coyote', 'wile@acme.com'),
('Wayne Enterprises', 'Bruce Wayne', 'bruce@wayne.com'),
('Stark Industries', 'Tony Stark', 'tony@stark.com'),
('Cyberdyne Systems', 'Miles Dyson', 'miles@cyberdyne.com'),
('Umbrella Corporation', 'Albert Wesker', 'wesker@umbrella.com');

INSERT INTO project_details (
    client_id, 
    application_name, 
    production_url, 
    testing_environment, 
    application_type, 
    authentication_method, 
    user_roles, 
    session_management, 
    session_timeout_period, 
    total_num_input_fields, 
    input_types_present, 
    sensitive_data_handled, 
    data_storage, 
    number_of_endpoints, 
    authentication_required, 
    rate_limiting, 
    documentation_available, 
    security_controls_present, 
    hosting, 
    critical_functions, 
    compliance_requirements, 
    previous_testing, 
    time_restrictions, 
    testing_limitations, 
    required_reports, 
    project_start_date, 
    draft_report_due_date, 
    final_report_due_date
) VALUES 
(1, 'Web Application Security Assessment', 'https://example.com', JSON_ARRAY('Staging environment'), JSON_ARRAY('Web Application'), JSON_ARRAY('OAuth 2.0'), 
 JSON_ARRAY('Admin', 'User', 'Guest'), JSON_ARRAY('Cookie-based'), 30, 25, JSON_ARRAY('Text', 'Number', 'Date'), JSON_ARRAY('PII', 'Payment Data'), 
 JSON_ARRAY('MySQL Database'), 15, 'Yes', 'Yes', 'Yes', JSON_ARRAY('WAF', 'Input Validation'), JSON_ARRAY('AWS'), 
 JSON_ARRAY('Authentication', 'Payment Processing'), JSON_ARRAY('PCI-DSS', 'GDPR'), '2024-01-15', JSON_ARRAY('8 hours per day'), 
 JSON_ARRAY('No production testing'), JSON_ARRAY('Executive Summary', 'Technical Details'), '2025-03-25', '2025-04-10', '2025-04-20'),

(2, 'Network Infrastructure Audit', 'https://network.example.org', JSON_ARRAY('Test lab'), JSON_ARRAY('Network'), JSON_ARRAY('Certificate-based'), 
 JSON_ARRAY('Admin', 'Auditor'), JSON_ARRAY('Token-based'), 60, 0, JSON_ARRAY('None'), JSON_ARRAY('Network Configurations'), 
 JSON_ARRAY('Configuration files'), 30, 'Yes', 'No', 'Yes', JSON_ARRAY('Firewall', 'IDS/IPS'), JSON_ARRAY('On-premises'), 
 JSON_ARRAY('Routing', 'Access Control'), JSON_ARRAY('ISO 27001'), '2024-02-20', JSON_ARRAY('After business hours'), 
 JSON_ARRAY('No downtime allowed'), JSON_ARRAY('Risk Assessment', 'Remediation Plan'), '2025-03-28', '2025-04-15', '2025-04-25'),

(3, 'Mobile App Security Review', 'https://mobileapp.example.com/api', JSON_ARRAY('Development environment'), JSON_ARRAY('Mobile Application'), JSON_ARRAY('JWT'), 
 JSON_ARRAY('User', 'Premium'), JSON_ARRAY('Token-based'), 45, 18, JSON_ARRAY('Text', 'Image', 'Location'), JSON_ARRAY('Location Data', 'User Profiles'), 
 JSON_ARRAY('Firebase'), 12, 'Yes', 'Yes', 'No', JSON_ARRAY('Cert Pinning', 'App Signing'), JSON_ARRAY('Google Cloud'), 
 JSON_ARRAY('User Authentication', 'Data Sync'), JSON_ARRAY('OWASP MASVS'), NULL, JSON_ARRAY('Business hours only'), 
 JSON_ARRAY('iOS testing limited to simulators'), JSON_ARRAY('OWASP Top 10 Mobile'), '2025-04-01', '2025-04-20', '2025-04-30'),

(4, 'Cloud Infrastructure Assessment', 'https://cloud.example.net', JSON_ARRAY('Sandbox account'), JSON_ARRAY('Cloud Service'), JSON_ARRAY('IAM Roles'), 
 JSON_ARRAY('Admin', 'DevOps', 'Developer'), JSON_ARRAY('Role-based'), 120, 5, JSON_ARRAY('Configuration', 'Commands'), JSON_ARRAY('Infrastructure Secrets'), 
 JSON_ARRAY('S3', 'DynamoDB'), 25, 'Yes', 'Yes', 'Yes', JSON_ARRAY('Security Groups', 'KMS'), JSON_ARRAY('AWS'), 
 JSON_ARRAY('Data Processing', 'Storage'), JSON_ARRAY('SOC 2', 'HIPAA'), '2023-11-10', JSON_ARRAY('No restrictions'), 
 JSON_ARRAY('Read-only access to production'), JSON_ARRAY('Cloud Security Posture Report'), '2025-04-05', '2025-04-22', '2025-05-05'),

(5, 'API Security Testing', 'https://api.example.io', JSON_ARRAY('QA environment'), JSON_ARRAY('API'), JSON_ARRAY('API Keys'), 
 JSON_ARRAY('Service Accounts'), JSON_ARRAY('Stateless'), 0, 35, JSON_ARRAY('JSON', 'XML'), JSON_ARRAY('Business Data'), 
 JSON_ARRAY('PostgreSQL'), 40, 'Yes', 'Yes', 'Yes', JSON_ARRAY('Rate Limiting', 'Request Validation'), JSON_ARRAY('Microsoft Azure'), 
 JSON_ARRAY('Data Exchange', 'Business Logic'), JSON_ARRAY('OpenAPI Spec Compliance'), '2024-03-01', JSON_ARRAY('Weekend testing preferred'), 
 JSON_ARRAY('No load testing'), JSON_ARRAY('API Security Assessment'), '2025-04-10', '2025-04-28', '2025-05-10');


 
INSERT INTO reports (project_id, report_type, content, status) VALUES 
(1, 'REQUIREMENT_VALIDATION', '{"findings": ["Application uses outdated framework", "Insufficient input validation"], "recommendations": ["Update to latest framework version", "Implement proper input validation"]}', 'DRAFT'),
(2, 'RISK_ASSESSMENT', '{"risk_level": "Medium", "vulnerabilities": ["Weak network segmentation", "Default credentials"], "impact": "Potential unauthorized access"}', 'SENT'),
(3, 'DRAFT_SOW', '{"executive_summary": "This SOW outlines the mobile application security testing...", "deliverables": ["Vulnerability report", "Remediation plan"], "timeline": "2 weeks", "cost": 15000}', 'APPROVED'),
(4, 'FINAL_SOW', '{"executive_summary": "This SOW details the cloud infrastructure assessment...", "deliverables": ["Security findings", "Compliance gaps", "Recommendations"], "timeline": "4 weeks", "cost": 25000}', 'APPROVED'),
(5, 'REQUIREMENT_VALIDATION', '{"findings": ["API lacks rate limiting", "Insufficient authentication"], "recommendations": ["Implement API gateway with rate limiting", "Add multi-factor authentication"]}', 'DRAFT');

INSERT INTO chatbot_logs (project_id, chat_history)
VALUES 
(1, '[{"role": "user", "content": "Hello!"}, {"role": "assistant", "content": "Hi there!"}]'),
(1, '[{"role": "user", "content": "I need help with my project"}, {"role": "assistant", "content": "I\'d be happy to help. What specifically do you need assistance with?"}]'),
(2, '[{"role": "user", "content": "What\'s the status of my project?"}, {"role": "assistant", "content": "Let me check that for you. Your project is currently in the SOW drafting phase."}]');

INSERT INTO activity_logs (project_id, action_type) VALUES 
(1, 'CREATE_REQUEST'),
(2, 'CREATE_REQUEST'),
(3, 'CREATE_REQUEST'),
(1, 'GENERATE_REPORT'),
(4, 'GENERATE_REPORT'),
(2, 'UPDATE_REQUEST'),
(5, 'GENERATE_REPORT'),
(5, 'CREATE_REQUEST'),
(3, 'UPDATE_REQUEST');

INSERT INTO project_action_logs 
(project_id, action_type, timestamp) 
VALUES
(1, 'SCOPING_SHEET_SUBMISSION', '2025-02-01 09:30:00'),
(1, 'SCOPING_SHEET_APPROVAL', '2025-02-02 14:45:00'),
(1, 'SOW_DRAFTING_TRIGGERED', '2025-02-03 11:15:00'),
(1, 'DRAFT_SOW_SUBMISSION', '2025-02-06 16:20:00'),
(1, 'SOW_APPROVAL', '2025-02-08 10:30:00'),
(1, 'FINAL_SOW_SENT_TO_CLIENT', '2025-02-09 13:00:00'),

(2, 'SCOPING_SHEET_SUBMISSION', '2025-02-05 08:15:00'),
(2, 'SCOPING_SHEET_APPROVAL', '2025-02-07 11:30:00'),
(2, 'SOW_DRAFTING_TRIGGERED', '2025-02-09 14:20:00'),
(2, 'DRAFT_SOW_SUBMISSION', '2025-02-12 15:45:00'),

(3, 'SCOPING_SHEET_SUBMISSION', '2025-01-20 10:00:00'),
(3, 'SCOPING_SHEET_APPROVAL', '2025-01-22 13:15:00'),
(3, 'SOW_DRAFTING_TRIGGERED', '2025-01-23 09:30:00'),
(3, 'DRAFT_SOW_SUBMISSION', '2025-01-28 16:00:00'),
(3, 'SOW_APPROVAL', '2025-01-30 14:45:00'),
(3, 'FINAL_SOW_SENT_TO_CLIENT', '2025-01-31 12:30:00'),

(4, 'SCOPING_SHEET_SUBMISSION', '2025-02-15 11:20:00'),
(4, 'SCOPING_SHEET_APPROVAL', '2025-02-16 14:30:00'),

(5, 'SCOPING_SHEET_SUBMISSION', '2025-01-10 09:00:00'),
(5, 'SCOPING_SHEET_APPROVAL', '2025-01-12 10:30:00'),
(5, 'SOW_DRAFTING_TRIGGERED', '2025-01-13 13:45:00'),
(5, 'DRAFT_SOW_SUBMISSION', '2025-01-16 15:00:00'),
(5, 'SOW_APPROVAL', '2025-01-18 11:20:00');

