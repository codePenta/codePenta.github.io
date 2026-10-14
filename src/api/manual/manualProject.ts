import { Locale, Project } from '../github/entities/Project';
import { ProjectContexts } from '../../shared/constants';
import { IconService } from '../../services/IconService';

type ManualProject = {
    name: string;
    description: { de: string; en: string };
    language: string;
    context: string;
    tags: string[];
    caseStudyUrl: string;
};

const MANUAL_PROJECTS: ManualProject[] = [
    {
        name: "Homelab",
        description: {
            de: "Selbst betriebene Infrastruktur auf einer Synology DS220+ – Forgejo, MariaDB, Pi-hole und Arcane, erreichbar über Tailscale unter *.pentanet.work.",
            en: "Self-hosted infrastructure on a Synology DS220+ – Forgejo, MariaDB, Pi-hole and Arcane, reachable via Tailscale under *.pentanet.work.",
        },
        language: "Infrastructure",
        context: "context-hobby",
        tags: ["self-hosting", "docker", "forgejo", "tailscale"],
        caseStudyUrl: "/case-studies/homelab/",
    },
];

export function getManualProjects(locale: Locale): Project[]
{
    const iconService = new IconService();

    return MANUAL_PROJECTS.map(project => ({
        name: project.name,
        owner: "codePenta",
        description: project.description[locale],
        url: project.caseStudyUrl,
        imageUrl: "",
        language: project.language,
        context: ProjectContexts.LABELS[project.context]?.[locale] ?? null,
        tags: project.tags,
        languageIconUrl: iconService.getLanguageIconUrl(project.language),
        versionControl: null,
        caseStudyUrl: project.caseStudyUrl,
    }));
}