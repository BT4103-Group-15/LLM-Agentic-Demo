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
(1, 'Web Application Security Assessment', 'https://example.com', 'Staging environment', 'Web Application', 'OAuth 2.0', 
 'Admin, User, Guest', 'Cookie-based', 30, 25, 'Text, Number, Date', 'PII, Payment Data', 
 'MySQL Database', 15, TRUE, TRUE, TRUE, 'WAF, Input Validation', 'AWS', 
 'Authentication, Payment Processing', 'PCI-DSS, GDPR', '2024-01-15', '8 hours per day', 
 'No production testing', 'Executive Summary, Technical Details', '2025-03-25', '2025-04-10', '2025-04-20'),

(2, 'Network Infrastructure Audit', 'https://network.example.org', 'Test lab', 'Network', 'Certificate-based', 
 'Admin, Auditor', 'Token-based', 60, 0, 'None', 'Network Configurations', 
 'Configuration files', 30, TRUE, FALSE, TRUE, 'Firewall, IDS/IPS', 'On-premises', 
 'Routing, Access Control', 'ISO 27001', '2024-02-20', 'After business hours', 
 'No downtime allowed', 'Risk Assessment, Remediation Plan', '2025-03-28', '2025-04-15', '2025-04-25'),

(3, 'Mobile App Security Review', 'https://mobileapp.example.com/api', 'Development environment', 'Mobile Application', 'JWT', 
 'User, Premium', 'Token-based', 45, 18, 'Text, Image, Location', 'Location Data, User Profiles', 
 'Firebase', 12, TRUE, TRUE, FALSE, 'Cert Pinning, App Signing', 'Google Cloud', 
 'User Authentication, Data Sync', 'OWASP MASVS', NULL, 'Business hours only', 
 'iOS testing limited to simulators', 'OWASP Top 10 Mobile', '2025-04-01', '2025-04-20', '2025-04-30'),

(4, 'Cloud Infrastructure Assessment', 'https://cloud.example.net', 'Sandbox account', 'Cloud Service', 'IAM Roles', 
 'Admin, DevOps, Developer', 'Role-based', 120, 5, 'Configuration, Commands', 'Infrastructure Secrets', 
 'S3, DynamoDB', 25, TRUE, TRUE, TRUE, 'Security Groups, KMS', 'AWS', 
 'Data Processing, Storage', 'SOC 2, HIPAA', '2023-11-10', 'No restrictions', 
 'Read-only access to production', 'Cloud Security Posture Report', '2025-04-05', '2025-04-22', '2025-05-05'),

(5, 'API Security Testing', 'https://api.example.io', 'QA environment', 'API', 'API Keys', 
 'Service Accounts', 'Stateless', 0, 35, 'JSON, XML', 'Business Data', 
 'PostgreSQL', 40, TRUE, TRUE, TRUE, 'Rate Limiting, Request Validation', 'Microsoft Azure', 
 'Data Exchange, Business Logic', 'OpenAPI Spec Compliance', '2024-03-01', 'Weekend testing preferred', 
 'No load testing', 'API Security Assessment', '2025-04-10', '2025-04-28', '2025-05-10');

 
INSERT INTO reports (project_id, report_type, content, status) VALUES 
(1, 'REQUIREMENT_VALIDATION', '{"findings": ["Application uses outdated framework", "Insufficient input validation"], "recommendations": ["Update to latest framework version", "Implement proper input validation"]}', 'DRAFT'),
(2, 'RISK_ASSESSMENT', '{"risk_level": "Medium", "vulnerabilities": ["Weak network segmentation", "Default credentials"], "impact": "Potential unauthorized access"}', 'SENT'),
(3, 'DRAFT_SOW', '{"executive_summary": "This SOW outlines the mobile application security testing...", "deliverables": ["Vulnerability report", "Remediation plan"], "timeline": "2 weeks", "cost": 15000}', 'APPROVED'),
(4, 'FINAL_SOW', '{"executive_summary": "This SOW details the cloud infrastructure assessment...", "deliverables": ["Security findings", "Compliance gaps", "Recommendations"], "timeline": "4 weeks", "cost": 25000}', 'APPROVED'),
(5, 'REQUIREMENT_VALIDATION', '{"findings": ["API lacks rate limiting", "Insufficient authentication"], "recommendations": ["Implement API gateway with rate limiting", "Add multi-factor authentication"]}', 'DRAFT');

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

