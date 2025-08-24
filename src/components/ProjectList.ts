import { Project } from '../api/github/entities/ProjectEntity'; // Importiere den Project-Typ
import { formatWithoutPrefix, Tags } from '../constants';
import { createProjectCard } from './ProjectCard'; // Importiere die Funktion zum Erstellen einer einzelnen Karte

type ProjectListProps = {
    projects: Project[];
    // Optional: Könntest hier weitere Props übergeben, z.B. für eine Überschrift, CSS-Klassen etc.
    // headingText?: string;
    // className?: string;
};

export function renderProjectList(props: ProjectListProps)
{
    const projectListContainer = document.querySelector(Tags.PROJECTS_LIST_ID);
    if (!projectListContainer)
        return

    projectListContainer.innerHTML = "";

    if (!props.projects || props.projects.length === 0)
    {
        const noProjectsMessage = document.createElement("p");
        noProjectsMessage.textContent = "No projects available at the moment. Please check back later!";
        noProjectsMessage.className = formatWithoutPrefix(Tags.ERROR_NO_PROJECTS_CLASSNAME);
        projectListContainer.appendChild(noProjectsMessage);
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