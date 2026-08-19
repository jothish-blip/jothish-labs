import { notFound } from "next/navigation";
import { Metadata } from "next";
import { googleSpecializations } from "@/components/sections/about/data";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return googleSpecializations.map((cert) => ({
    slug: cert.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cert = googleSpecializations.find((c) => c.slug === slug);

  if (!cert) {
    return { title: "Certificate Not Found" };
  }

  return {
    title: `${cert.title} | Jothish Gandham`,
    description: cert.shortDescription,
    openGraph: {
      title: cert.title,
      description: cert.shortDescription,
      type: "article",
      url: `https://webjothishanalyst.site/certificates/${cert.slug}`,
      images: cert.professionalCertificate.image ? [{ url: cert.professionalCertificate.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: cert.title,
      description: cert.shortDescription,
      images: cert.professionalCertificate.image ? [cert.professionalCertificate.image] : undefined,
    },
  };
}

export default async function CertificatePage({ params }: Props) {
  const { slug } = await params;
  const cert = googleSpecializations.find((c) => c.slug === slug);

  if (!cert) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: cert.title,
    description: cert.shortDescription,
    credentialCategory: "Professional Certificate",
    recognizedBy: {
      "@type": "Organization",
      name: cert.provider,
    },
    url: cert.professionalCertificate.credentialUrl || `https://webjothishanalyst.site/certificates/${cert.slug}`,
    image: cert.professionalCertificate.image ? `https://webjothishanalyst.site${cert.professionalCertificate.image}` : undefined,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://webjothishanalyst.site/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Certificates",
        item: "https://webjothishanalyst.site/#about"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cert.title,
        item: `https://webjothishanalyst.site/certificates/${cert.slug}`
      }
    ]
  };

  return (
    <main className="max-w-4xl mx-auto py-24 px-6 flex-1 w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      
      <Link href="/#about" className="text-muted hover:text-foreground text-sm mb-8 inline-flex items-center gap-2">
        &larr; Back to Portfolio
      </Link>

      <article className="space-y-8">
        <header className="space-y-4">
          <div className="text-sm font-mono tracking-widest uppercase text-accent">
            {cert.provider}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{cert.title}</h1>
          <p className="text-xl text-muted">{cert.shortDescription}</p>
        </header>

        {cert.professionalCertificate.image && (
          <div className="rounded-lg overflow-hidden border border-surface">
            <img 
              src={cert.professionalCertificate.image} 
              alt={`${cert.title} Certificate`} 
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Overview</h2>
            <p className="text-muted leading-relaxed">
              {cert.professionalCertificate.overview}
            </p>

            <div className="pt-4">
              <h3 className="font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc list-inside space-y-1 text-muted">
                {cert.professionalCertificate.learningOutcomes.map((outcome, i) => (
                  <li key={i}>{outcome}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Core Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {cert.professionalCertificate.coreTechnologies.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-surface/50 border border-surface rounded-md text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Professional Skills</h2>
              <div className="flex flex-wrap gap-2">
                {cert.professionalCertificate.professionalSkills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-surface/50 border border-surface rounded-md text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {cert.professionalCertificate.credentialUrl && (
              <div className="pt-4">
                <a 
                  href={cert.professionalCertificate.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-foreground text-background font-medium rounded-md hover:bg-foreground/90 transition-colors inline-flex items-center gap-2"
                >
                  Verify Credential
                </a>
              </div>
            )}
          </section>
        </div>
      </article>
    </main>
  );
}
