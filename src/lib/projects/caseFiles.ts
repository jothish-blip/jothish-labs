import { CaseData } from "./types";

export const caseFiles: CaseData[] = [
  {
    id: "CASE-BT01",
    category: "SECURITY_AUDIT",
    title: "Botium Toys Audit",
    status: "CRITICAL_RISK",
    riskScore: "8/10",
    riskLevel: "HIGH",
    vulnerabilities: 4,
    controlsFailed: 4,
    description: "Comprehensive security audit for Botium Toys to assess assets, internal networks, and compliance posture against NIST CSF.",
    investigationNotes: "The audit revealed a high-risk score due to inadequate asset management and lack of core technical controls. Key vulnerabilities include unencrypted PII/SPII and absent disaster recovery protocols.",
    timeline: [
      { title: "Scope Definition", desc: "Established audit boundaries aligning with NIST CSF standards.", tag: "COMPLIANCE" },
      { title: "Asset Discovery", desc: "Mapped internal network assets and identified shadow IT components.", tag: "RECON" },
      { title: "Vulnerability Scan", desc: "Detected plaintext PII storage and missing core technical controls.", tag: "SCAN" },
      { title: "Control Assessment", desc: "Evaluated firewall, IDS, and disaster recovery implementations.", tag: "AUDIT" },
      { title: "Findings & Reporting", desc: "Compiled critical risk register and actionable mitigation plan.", tag: "RESULT" }
    ],
    checklist: [
      { control: "Firewall", status: "YES", note: "Security rules defined" },
      { control: "Antivirus Software", status: "YES", note: "Monitored regularly" },
      { control: "Least Privilege", status: "NO", note: "Unrestricted internal data access" },
      { control: "Data Encryption", status: "NO", note: "Local PII stored in plaintext" },
      { control: "Intrusion Detection", status: "NO", note: "IDS not implemented" },
      { control: "Disaster Recovery", status: "NO", note: "No backups or recovery plan" },
    ],
    recommendations: [
      "Enforce Least Privilege and Separation of Duties.",
      "Deploy AES-256 encryption for PCI DSS compliance.",
      "Establish a centralized Password Management system.",
      "Develop a Disaster Recovery and Backup strategy."
    ],
    assets: [
      { name: "Open_Full_Audit.pdf", type: "pdf", url: "/reports/botium-risk.pdf", isPrimary: true },
      { name: "Download_Checklist.pdf", type: "pdf", url: "/reports/botium-checklist.pdf", isPrimary: false }
    ]
  },
  {
    id: "CASE-DNS02",
    category: "NETWORK_ANALYSIS",
    title: "DNS Failure Analysis",
    status: "INVESTIGATED",
    riskScore: "6/10",
    riskLevel: "MODERATE",
    vulnerabilities: 2,
    controlsFailed: 1,
    description: "Analyze network traffic using tcpdump to identify why a website was unreachable. Focus on ICMP & UDP protocol investigation.",
    investigationNotes: "Users reported that the website was not loading, showing the error 'Destination port unreachable'. Traffic analysis revealed that the system sent DNS requests using UDP (port 53), but the DNS server responded with an ICMP error ('port 53 unreachable'). This indicates the DNS service was not accessible.",
    timeline: [
      { title: "Alert Received", desc: "Users reported destination port unreachable errors on web access.", tag: "INCIDENT" },
      { title: "Packet Capture", desc: "Initiated tcpdump to monitor and log active network traffic.", tag: "TCPDUMP" },
      { title: "UDP Inspection", desc: "Isolated outbound DNS requests communicating over UDP port 53.", tag: "PROTOCOL" },
      { title: "ICMP Analysis", desc: "Identified returning ICMP error messages confirming port 53 was unreachable.", tag: "ERROR" },
      { title: "Root Cause Identified", desc: "Determined DNS service outage was responsible for network failure.", tag: "RESULT" }
    ],
    checklist: [
      { control: "tcpdump Capture", status: "YES", note: "Network traffic successfully captured" },
      { control: "UDP Inspection", status: "YES", note: "Identified port 53 requests" },
      { control: "ICMP Analysis", status: "YES", note: "Error response confirmed" },
      { control: "DNS Service", status: "NO", note: "Service down or unreachable" },
      { control: "Firewall Config", status: "NO", note: "Potential block on port 53" },
    ],
    recommendations: [
      "Restart the DNS service.",
      "Check firewall rules to ensure port 53 is open.",
      "Verify DNS server configuration parameters.",
      "Implement continuous monitoring for DNS availability."
    ],
    assets: [
      { name: "View_Traffic_Log.png", type: "image", url: "/reports/tcpdump-screenshot.png", isPrimary: true },
      { name: "Open_Analysis_Doc.pdf", type: "pdf", url: "/reports/dns-analysis.pdf", isPrimary: false }
    ]
  },
  {
    id: "CASE-LNX03",
    category: "LINUX_SECURITY",
    title: "Linux Permissions Hardening",
    status: "SECURED",
    riskScore: "7/10",
    riskLevel: "HIGH",
    vulnerabilities: 3,
    controlsFailed: 3,
    description: "System-wide audit and remediation of Linux file permissions to enforce the Principle of Least Privilege (PoLP).",
    investigationNotes: "Initial system scan revealed critical directory vulnerabilities where 'Others' and 'Group' had unauthorized write access. Sensitive hidden project files were exposed to the entire user environment. Remediation involved recursive permission stripping and specific owner-only locks.",
    timeline: [
      { title: "Scan Initiated", desc: "Executed ls -la to perform a comprehensive directory permission audit.", tag: "AUDIT" },
      { title: "Vulnerability Mapped", desc: "Identified exposed hidden files and unauthorized group write access.", tag: "EXPOSURE" },
      { title: "Permission Stripping", desc: "Recursively removed 'others' write privileges across project files.", tag: "CHMOD" },
      { title: "Owner Locks Applied", desc: "Secured hidden .project files strictly to owner-only access.", tag: "SECURE" },
      { title: "Verification", desc: "Confirmed PoLP enforcement across all targeted system directories.", tag: "RESULT" }
    ],
    checklist: [
      { control: "Permission Audit", status: "YES", note: "Used ls -la to map vulnerabilities" },
      { control: "Group Write Lock", status: "YES", note: "chmod g-w enforced on project root" },
      { control: "Others Access Strip", status: "YES", note: "chmod o-w applied to system drafts" },
      { control: "Hidden File Shield", status: "YES", note: ".project_x.txt restricted to owner" },
      { control: "Dir Access Control", status: "YES", note: "Restricted drafts directory to 700" },
    ],
    recommendations: [
      "Implement automated cron jobs to audit file permissions weekly.",
      "Standardize on 755 for public dirs and 700 for private data.",
      "Audit hidden files (.dotfiles) for SPII leaks.",
      "Enforce umask settings to prevent insecure default permissions."
    ],
    assets: [
      { name: "Open_Security_Report.pdf", type: "pdf", url: "/linux/project.pdf", isPrimary: true }
    ]
  },
  {
    id: "CASE-SQL04",
    category: "THREAT_ANALYSIS",
    title: "SQL Login Activity Analysis",
    status: "INVESTIGATED",
    riskScore: "7/10",
    riskLevel: "HIGH",
    vulnerabilities: 3,
    controlsFailed: 2,
    description: "Security-focused SQL investigation analyzing login attempts and employee records using logical filters (AND, OR, NOT).",
    investigationNotes: "The analysis focused on identifying suspicious login behavior and system vulnerabilities using SQL queries. By applying logical operators, multiple anomalies were detected including after-hours failed logins, unusual geographic access patterns, and department-based system exposure. Pattern matching and conditional filtering helped isolate high-risk activities effectively.",
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
        anomaly: "⚠ ANOMALY DETECTED: High concentration of targeted failed logins originating from non-MEX external regions.",
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
      { control: "After-hours Login Detection", status: "YES", note: "Filtered failed logins after 18:00" },
      { control: "Date-based Filtering", status: "YES", note: "Identified activity on May 8 & 9" },
      { control: "Geolocation Filtering", status: "YES", note: "Excluded Mexico using NOT + LIKE" },
      { control: "Department Filtering", status: "YES", note: "Marketing & East building isolated" },
      { control: "Multi-condition Queries", status: "YES", note: "Used AND / OR effectively" },
      { control: "Advanced Correlation", status: "NO", note: "No JOIN operations applied" },
    ],
    recommendations: [
      "Implement real-time monitoring for after-hours login attempts.",
      "Introduce geolocation-based access restrictions.",
      "Automate anomaly detection using scheduled SQL queries.",
      "Integrate SQL analysis with SIEM tools for better visibility."
    ],
    assets: [
      { name: "Open_SQL_Report.pdf", type: "pdf", url: "/sql/SQL-report.pdf", isPrimary: true },
      { name: "View_Table_Formats.pdf", type: "pdf", url: "/sql/table-formats.pdf", isPrimary: false }
    ]
  }
];