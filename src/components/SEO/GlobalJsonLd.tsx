export default function GlobalJsonLd() {
  const personLd = {
    "@context": "https://schema.org",
    "@type": ["Person", "Organization"],
    "@id": "https://webjothishanalyst.site/#person",
    name: "Jothish Gandham",
    alternateName: ["Gandham Jothish", "Gandham Jothish Guru Karthikeya Reddy", "Jothish", "Guru", "Karthikeya", "Reddy"],
    url: "https://webjothishanalyst.site",
    jobTitle: ["Cybersecurity Analyst", "SOC Analyst", "Detection Engineer"],
    worksFor: {
      "@type": "Organization",
      name: "Cybersecurity Portfolio"
    },
    sameAs: [
      "https://github.com/jothish-blip",
      "https://linkedin.com/in/jothish-gandham"
    ],
    knowsAbout: [
      "Blue Team",
      "Detection Engineer",
      "Security Research",
      "Threat Detection",
      "Threat Hunting",
      "SIEM",
      "SOC Operations",
      "Incident Response",
      "Malware Analysis",
      "Digital Forensics",
      "Network Security",
      "Cloud Security",
      "Linux",
      "Windows Security",
      "MITRE ATT&CK",
      "Splunk",
      "Microsoft Sentinel",
      "Wazuh",
      "Security Automation",
      "Detection Engineering",
      "Purple Team"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "professional",
      email: "karthikeya10514@gmail.com",
      url: "https://webjothishanalyst.site/#contact"
    }
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://webjothishanalyst.site/#website",
    url: "https://webjothishanalyst.site",
    name: "Jothish Gandham — Security Analyst Portfolio",
    description: "Security-focused portfolio of Jothish Gandham showcasing systems architecture, offensive and defensive security skills.",
    publisher: {
      "@id": "https://webjothishanalyst.site/#person"
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://webjothishanalyst.site/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
    </>
  );
}
