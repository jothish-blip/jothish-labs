import { CaseData } from "./types";

export const caseFiles: CaseData[] = [
  {
    id: "CASE-BT01",
    category: "Security Audit",
    title: "Botium Toys Audit",
    status: "High Risk",
    riskScore: 8,
    riskLevel: "High",
    vulnerabilities: 4,
    failedControls: 4,
    description: "Comprehensive security audit for Botium Toys assessing assets, internal networks, and compliance posture against NIST CSF.",
    summary: "The audit revealed a high-risk score due to inadequate asset management and lack of core technical controls. Key vulnerabilities include unencrypted PII/SPII and absent disaster recovery protocols.",
    timeline: [
      { title: "Scope Definition", desc: "Established audit boundaries aligning with NIST CSF standards.", tag: "Compliance" },
      { title: "Asset Discovery", desc: "Mapped internal network assets and identified shadow IT components.", tag: "Reconnaissance" },
      { title: "Vulnerability Scan", desc: "Detected plaintext PII storage and missing core technical controls.", tag: "Scan" },
      { title: "Control Assessment", desc: "Evaluated firewall, IDS, and disaster recovery implementations.", tag: "Audit" },
      { title: "Findings & Reporting", desc: "Compiled critical risk register and actionable mitigation plan.", tag: "Result" }
    ],
    checklist: [
      { control: "Firewall", status: "Verified", note: "Security rules defined" },
      { control: "Antivirus Software", status: "Verified", note: "Monitored regularly" },
      { control: "Least Privilege", status: "Failed", note: "Unrestricted internal data access" },
      { control: "Data Encryption", status: "Failed", note: "Local PII stored in plaintext" },
      { control: "Intrusion Detection", status: "Failed", note: "IDS not implemented" },
      { control: "Disaster Recovery", status: "Failed", note: "No backups or recovery plan" },
    ],
    recommendations: [
      "Enforce Least Privilege and Separation of Duties.",
      "Deploy AES-256 encryption for PCI DSS compliance.",
      "Establish a centralized Password Management system.",
      "Develop a Disaster Recovery and Backup strategy."
    ],
    assets: [
      { name: "Full Audit Report", type: "pdf", url: "/reports/botium-risk.pdf", isPrimary: true },
      { name: "Checklist", type: "pdf", url: "/reports/botium-checklist.pdf", isPrimary: false }
    ]
  },
  {
    id: "CASE-DNS02",
    category: "Network Analysis",
    title: "DNS Failure Analysis",
    status: "Investigated",
    riskScore: 6,
    riskLevel: "Moderate",
    vulnerabilities: 2,
    failedControls: 1,
    description: "Analyzed network traffic using tcpdump to determine why the website was unreachable. Focus on ICMP & UDP protocol investigation.",
    summary: "Users reported that the website was not loading, showing the error 'Destination port unreachable'. Traffic analysis revealed that the system sent DNS requests using UDP (port 53), but the DNS server responded with an ICMP error ('port 53 unreachable'). This indicates the DNS service was not accessible.",
    timeline: [
      { title: "Alert Received", desc: "Users reported destination port unreachable errors on web access.", tag: "Incident" },
      { title: "Packet Capture", desc: "Initiated tcpdump to monitor and log active network traffic.", tag: "Packet Capture" },
      { title: "UDP Inspection", desc: "Isolated outbound DNS requests communicating over UDP port 53.", tag: "Protocol Analysis" },
      { title: "ICMP Analysis", desc: "Identified returning ICMP error messages confirming port 53 was unreachable.", tag: "Error" },
      { title: "Root Cause Identified", desc: "Determined DNS service outage was responsible for network failure.", tag: "Result" }
    ],
    checklist: [
      { control: "tcpdump Capture", status: "Verified", note: "Network traffic successfully captured" },
      { control: "UDP Inspection", status: "Verified", note: "Identified port 53 requests" },
      { control: "ICMP Analysis", status: "Verified", note: "Error response confirmed" },
      { control: "DNS Service", status: "Failed", note: "Service down or unreachable" },
      { control: "Firewall Config", status: "Failed", note: "Potential block on port 53" },
    ],
    recommendations: [
      "Restart the DNS service.",
      "Check firewall rules to ensure port 53 is open.",
      "Verify DNS server configuration parameters.",
      "Implement continuous monitoring for DNS availability."
    ],
    assets: [
      { name: "Traffic Log", type: "image", url: "/reports/tcpdump-screenshot.png", isPrimary: true },
      { name: "Analysis Document", type: "pdf", url: "/reports/dns-analysis.pdf", isPrimary: false }
    ]
  },
  {
    id: "CASE-LNX03",
    category: "Linux Security",
    title: "Linux Permissions Hardening",
    status: "Secured",
    riskScore: 7,
    riskLevel: "High",
    vulnerabilities: 3,
    failedControls: 3,
    description: "Performed a system-wide audit and remediation of Linux file permissions to enforce the Principle of Least Privilege (PoLP).",
    summary: "Initial system scan revealed critical directory vulnerabilities where 'Others' and 'Group' had unauthorized write access. Sensitive hidden project files were exposed to the entire user environment. Remediation involved recursive permission stripping and specific owner-only locks.",
    timeline: [
      { title: "Scan Initiated", desc: "Used ls -la to audit directory permissions across the system.", tag: "Audit" },
      { title: "Vulnerability Mapped", desc: "Identified exposed hidden files and unauthorized group write access.", tag: "Exposure" },
      { title: "Permission Stripping", desc: "Recursively removed 'others' write privileges across project files.", tag: "Chmod" },
      { title: "Owner Locks Applied", desc: "Secured hidden .project files strictly to owner-only access.", tag: "Secure" },
      { title: "Verification", desc: "Confirmed PoLP enforcement across all targeted system directories.", tag: "Result" }
    ],
    checklist: [
      { control: "Permission Audit", status: "Verified", note: "Used ls -la to map vulnerabilities" },
      { control: "Group Write Lock", status: "Verified", note: "chmod g-w enforced on project root" },
      { control: "Others Access Strip", status: "Verified", note: "chmod o-w applied to system drafts" },
      { control: "Hidden File Shield", status: "Verified", note: ".project_x.txt restricted to owner" },
      { control: "Dir Access Control", status: "Verified", note: "Restricted drafts directory to 700" },
    ],
    recommendations: [
      "Implement automated cron jobs to audit file permissions weekly.",
      "Standardize on 755 for public dirs and 700 for private data.",
      "Audit hidden files (.dotfiles) for SPII leaks.",
      "Enforce umask settings to prevent insecure default permissions."
    ],
    assets: [
      { name: "Security Report", type: "pdf", url: "/linux/project.pdf", isPrimary: true }
    ]
  },
  {
    id: "CASE-SQL04",
    category: "Threat Analysis",
    title: "SQL Login Activity Analysis",
    status: "Investigated",
    riskScore: 7,
    riskLevel: "High",
    vulnerabilities: 3,
    failedControls: 2,
    description: "Security-focused SQL analysis of login attempts and employee records using logical filters (AND, OR, NOT).",
    summary: "The analysis focused on identifying suspicious login behavior and system vulnerabilities using SQL queries. By applying logical operators, multiple anomalies were detected including after-hours failed logins, unusual geographic access patterns, and department-based system exposure. Pattern matching and conditional filtering helped isolate high-risk activities effectively.",
    playback: [
      {
        step: "01",
        title: "After-hours Failed Logins",
        intent: "Identify failed login attempts occurring outside standard working hours to detect automated or unauthorized access patterns.",
        query: `SELECT user_id, login_time, status \nFROM log_in_attempts \nWHERE login_time > '18:00' \nAND success = 0;`,
        delta: "Initial filter applied (84 → 12 records)",
        logs: ["[LOG] Connection established", "[LOG] Executing query block 1", "[LOG] 12 suspicious records isolated"],
        linkedControl: "After-hours Login Detection",
        resultRows: [
          { user_id: "U102", login_time: "19:34:02", status: "FAILED" },
          { user_id: "U221", login_time: "21:12:45", status: "FAILED" },
          { user_id: "U305", login_time: "23:01:12", status: "FAILED" }
        ]
      },
      {
        step: "02",
        title: "Date-based Investigation",
        intent: "Cross-reference the after-hours logins with the known incident window (May 8 - May 9) to isolate the primary threat vector.",
        query: `SELECT user_id, login_date, status \nFROM log_in_attempts \nWHERE login_date = '2022-05-08' \nOR login_date = '2022-05-09';`,
        delta: "Isolated specific event dates (12 → 8 records)",
        logs: ["[LOG] Date parameters applied", "[LOG] Out-of-scope dates purged", "[LOG] 8 critical records retained"],
        linkedControl: "Date-based Filtering",
        resultRows: [
          { user_id: "U102", login_date: "2022-05-08", status: "FAILED" },
          { user_id: "U221", login_date: "2022-05-09", status: "FAILED" }
        ]
      },
      {
        step: "03",
        title: "Geo Filtering",
        intent: "Exclude known secure locations (Mexico headquarters) to detect anomalous external access points using wildcards.",
        query: `SELECT user_id, country, status \nFROM log_in_attempts \nWHERE NOT country LIKE 'MEX%';`,
        delta: "Removed MEX entries (8 → 3 records)",
        anomaly: "Anomaly detected: High concentration of targeted failed logins originating from non-MEX external regions.",
        logs: ["[LOG] NOT LIKE pattern executed", "[LOG] Internal IP ranges excluded", "[LOG] External threat signatures identified"],
        linkedControl: "Geolocation Filtering",
        resultRows: [
          { user_id: "U102", country: "RUS", status: "FAILED" },
          { user_id: "U221", country: "CHN", status: "FAILED" },
          { user_id: "U305", country: "PRK", status: "FAILED" }
        ]
      },
      {
        step: "04",
        title: "Department Analysis",
        intent: "Correlate the compromised user IDs with internal employee databases to determine lateral movement risk and target value.",
        query: `SELECT user_id, department, office \nFROM employees \nWHERE department = 'Marketing' \nAND office LIKE 'East%';`,
        delta: "Correlated users to departments (3 → 2 high-risk profiles)",
        logs: ["[LOG] Cross-referencing employee_db", "[LOG] Marketing department isolated", "[LOG] Risk assigned to East Building"],
        linkedControl: "Department Filtering",
        resultRows: [
          { user_id: "U102", department: "Marketing", office: "East-A" },
          { user_id: "U221", department: "Marketing", office: "East-B" }
        ]
      }
    ],
    checklist: [
      { control: "After-hours Login Detection", status: "Verified", note: "Filtered failed logins after 18:00" },
      { control: "Date-based Filtering", status: "Verified", note: "Identified activity on May 8 & 9" },
      { control: "Geolocation Filtering", status: "Verified", note: "Excluded Mexico using NOT + LIKE" },
      { control: "Department Filtering", status: "Verified", note: "Marketing & East building isolated" },
      { control: "Multi-condition Queries", status: "Verified", note: "Used AND / OR effectively" },
      { control: "Advanced Correlation", status: "Failed", note: "No JOIN operations applied" },
    ],
    recommendations: [
      "Implement real-time monitoring for after-hours login attempts.",
      "Introduce geolocation-based access restrictions.",
      "Automate anomaly detection using scheduled SQL queries.",
      "Integrate SQL analysis with SIEM tools for better visibility."
    ],
    assets: [
      { name: "SQL Report", type: "pdf", url: "/sql/SQL-report.pdf", isPrimary: true },
      { name: "Table Formats", type: "pdf", url: "/sql/table-formats.pdf", isPrimary: false }
    ]
  }
];