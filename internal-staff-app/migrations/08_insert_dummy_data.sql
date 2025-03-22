INSERT INTO users (name, role) VALUES 
('John Smith', 'SALES'),
('Jane Doe', 'TECH_PRE_SALES'),
('Robert Johnson', 'PROJECT_MANAGER'),
('Emily Chen', 'TECH_PRE_SALES'),
('Michael Brown', 'SALES');

INSERT INTO clients (company_name, contact_name, email) VALUES 
('Acme Corporation', 'Wile E. Coyote', 'wile@acme.com'),
('Wayne Enterprises', 'Bruce Wayne', 'bruce@wayne.com'),
('Stark Industries', 'Tony Stark', 'tony@stark.com'),
('Cyberdyne Systems', 'Miles Dyson', 'miles@cyberdyne.com'),
('Umbrella Corporation', 'Albert Wesker', 'wesker@umbrella.com');

INSERT INTO pentest_requests (client_id, user_id, description, request_status) VALUES 
(1, 1, '{"project_name": "Web Application Security Assessment", "scope": "Full application pentest", "timeline": "4 weeks"}', 'NEW'),
(2, 1, '{"project_name": "Network Infrastructure Audit", "scope": "External and internal network", "timeline": "3 weeks"}', 'SOW_DRAFTED'),
(3, 2, '{"project_name": "Mobile App Security Review", "scope": "Android and iOS applications", "timeline": "2 weeks"}', 'SOW_APPROVED'),
(4, 3, '{"project_name": "Cloud Infrastructure Assessment", "scope": "AWS environment", "timeline": "4 weeks"}', 'COMPLETED'),
(5, 4, '{"project_name": "API Security Testing", "scope": "REST and GraphQL APIs", "timeline": "3 weeks"}', 'NEW');

INSERT INTO reports (pentest_request_id, report_type, content, status, created_by) VALUES 
(1, 'REQUIREMENT_VALIDATION', '{"findings": ["Application uses outdated framework", "Insufficient input validation"], "recommendations": ["Update to latest framework version", "Implement proper input validation"]}', 'DRAFT', 2),
(2, 'RISK_ASSESSMENT', '{"risk_level": "Medium", "vulnerabilities": ["Weak network segmentation", "Default credentials"], "impact": "Potential unauthorized access"}', 'SENT', 4),
(3, 'DRAFT_SOW', '{"executive_summary": "This SOW outlines the mobile application security testing...", "deliverables": ["Vulnerability report", "Remediation plan"], "timeline": "2 weeks", "cost": 15000}', 'APPROVED', 2),
(4, 'FINAL_SOW', '{"executive_summary": "This SOW details the cloud infrastructure assessment...", "deliverables": ["Security findings", "Compliance gaps", "Recommendations"], "timeline": "4 weeks", "cost": 25000}', 'APPROVED', 3),
(5, 'REQUIREMENT_VALIDATION', '{"findings": ["API lacks rate limiting", "Insufficient authentication"], "recommendations": ["Implement API gateway with rate limiting", "Add multi-factor authentication"]}', 'DRAFT', 4);

INSERT INTO activity_logs (user_id, pentest_request_id, action_type) VALUES 
(1, 1, 'CREATE_REQUEST'),
(1, 2, 'CREATE_REQUEST'),
(2, 3, 'CREATE_REQUEST'),
(2, 1, 'GENERATE_REPORT'),
(3, 4, 'GENERATE_REPORT'),
(3, 2, 'UPDATE_REQUEST'),
(4, 5, 'GENERATE_REPORT'),
(4, 5, 'CREATE_REQUEST'),
(5, 3, 'UPDATE_REQUEST');

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

