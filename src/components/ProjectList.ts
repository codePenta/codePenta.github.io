import { Project } from '../api/github/entities/Project'; // Importiere den Project-Typ
import { Tags } from '../utils/constants';
import { getElementFromQuerySelector, removePrefixFromTag } from '../utils/Helpers';
import { createProjectCard } from './ProjectCard'; // Importiere die Funktion zum Erstellen einer einzelnen Karte

type ProjectListProps = {
    projects: Project[];
    // Optional: Könntest hier weitere Props übergeben, z.B. für eine Überschrift, CSS-Klassen etc.
    // headingText?: string;
    // className?: string;
};

export class ProjectList
{
    public renderProjectList(props: ProjectListProps)
    {
        const projectListContainer: Element = getElementFromQuerySelector(Tags.PROJECTS_LIST_ID);
        projectListContainer.innerHTML = "";

        if (!props.projects || props.projects.length === 0)
        {
            this.showError(projectListContainer);
        }

        this.renderProjects(props, projectListContainer);

        return projectListContainer;
    }


    private renderProjects(props: ProjectListProps, projectListContainer: Element)
    {
        const fragment = document.createDocumentFragment();

        for (const project of props.projects)
        {
            const projectCard = createProjectCard(project);
            fragment.appendChild(projectCard);
        }

        projectListContainer.appendChild(fragment);
    }

    private showError(projectListContainer: Element)
    {
        const noProjectsMessage = document.createElement("p");
        noProjectsMessage.textContent = "No projects available at the moment. Please check back later!";
        noProjectsMessage.className = removePrefixFromTag(Tags.ERROR_NO_PROJECTS_CLASSNAME);
        projectListContainer.appendChild(noProjectsMessage);
    }
}