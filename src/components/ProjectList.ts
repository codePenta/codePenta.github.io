import { Project } from '../api/github/entities/ProjectEntity'; // Importiere den Project-Typ
import { createProjectCard } from './ProjectCard'; // Importiere die Funktion zum Erstellen einer einzelnen Karte

type ProjectListProps = {
    projects: Project[];
    // Optional: Könntest hier weitere Props übergeben, z.B. für eine Überschrift, CSS-Klassen etc.
    // headingText?: string;
    // className?: string;
};

export function createProjectList(props: ProjectListProps): HTMLDivElement
{
    const projectListContainer = document.createElement("div");
    projectListContainer.className = "projects-list-container";

    if (!props.projects || props.projects.length === 0)
    {
        const noProjectsMessage = document.createElement("p");
        noProjectsMessage.textContent = "No projects available at the moment. Please check back later!";
        noProjectsMessage.className = "no-projects-message";
        projectListContainer.appendChild(noProjectsMessage);
        return projectListContainer;
    }

    const fragment = document.createDocumentFragment();

    for (const project of props.projects)
    {
        const projectCard = createProjectCard(project);
        fragment.appendChild(projectCard);
    }

    projectListContainer.appendChild(fragment);

    return projectListContainer;
}