import { Project } from '../api/github/entities/ProjectEntity';

export function createProjectCard(project: Project): HTMLElement
{
    const card = document.createElement("div");
    card.className = "project-card"; // CSS-Klasse für die Karte

    const h2 = document.createElement("h2");
    h2.textContent = project.name;

    const language = document.createElement("p");
    language.textContent = `Language: ${project.language}`; // Bessere Beschriftung

    const description = document.createElement("p");
    description.textContent = project.description;

    const url = document.createElement("a");
    url.textContent = `View on GitHub`; // Besserer Link-Text
    url.href = project.url; // 'url' ist jetzt der korrekte Property-Name
    url.target = "_blank"; // Link in neuem Tab öffnen
    url.rel = "noopener noreferrer"; // Sicherheitsmaßnahme für target="_blank"

    // Optional: Projekt-Tags anzeigen
    if (project.tags && project.tags.length > 0)
    {
        const tagsContainer = document.createElement("div");
        tagsContainer.className = "project-tags";
        project.tags.forEach(tag =>
        {
            const span = document.createElement("span");
            span.className = "tag";
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });
        card.appendChild(tagsContainer);
    }

    card.append(h2, language, description, url); // Reihenfolge kann angepasst werden
    return card;
}