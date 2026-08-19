import { notFound } from "next/navigation";
import { Metadata } from "next";
import { projects } from "@/lib/projects/projectData";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Jothish Gandham`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: `https://webjothishanalyst.site/projects/${project.id}`,
      images: project.images?.cover ? [{ url: project.images.cover }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.images?.cover ? [project.images.cover] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Project", "CreativeWork", "SoftwareSourceCode"],
    name: project.title,
    description: project.description,
    url: `https://webjothishanalyst.site/projects/${project.id}`,
    creator: {
      "@type": "Person",
      name: "Jothish Gandham",
    },
    keywords: [...(project.technologies || []), ...(project.skills || [])].join(", "),
    image: project.images?.cover ? `https://webjothishanalyst.site${project.images.cover}` : undefined,
    codeRepository: project.githubUrl,
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
        name: "Projects",
        item: "https://webjothishanalyst.site/#projects"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `https://webjothishanalyst.site/projects/${project.id}`
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
      
      <Link href="/#projects" className="text-muted hover:text-foreground text-sm mb-8 inline-flex items-center gap-2">
        &larr; Back to Portfolio
      </Link>

      <article className="space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-xl text-muted">{project.description}</p>
        </header>

        {project.images?.cover && (
          <div className="rounded-lg overflow-hidden border border-surface">
            {/* Using img for simplicity, next/image is preferred but needs width/height */}
            <img 
              src={project.images.cover} 
              alt={project.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Overview</h2>
            {project.whyBuilt && (
              <div>
                <h3 className="font-medium text-foreground">Why Built</h3>
                <p className="text-muted">{project.whyBuilt}</p>
              </div>
            )}
            {project.whatWorkedOn && (
              <div>
                <h3 className="font-medium text-foreground">What I Worked On</h3>
                <p className="text-muted">{project.whatWorkedOn}</p>
              </div>
            )}
            {project.outcome && (
              <div>
                <h3 className="font-medium text-foreground">Outcome</h3>
                <p className="text-muted">{project.outcome}</p>
              </div>
            )}
          </section>

          <section className="space-y-6">
            {project.technologies && project.technologies.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-surface/50 border border-surface rounded-md text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.skills && project.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Skills Applied</h2>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-surface/50 border border-surface rounded-md text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-4">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-foreground text-background font-medium rounded-md hover:bg-foreground/90 transition-colors"
                >
                  View on GitHub
                </a>
              )}
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
