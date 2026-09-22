import { Project } from '../../api/github/entities/Project';
import { Tags } from '../../shared/constants';
import { getElementFromQuerySelector, removePrefixFromTag } from '../../shared/Helpers';
import { ProjectCard } from './ProjectCard';

type ProjectListProps = {
    projects: Project[];
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
            const projectCard: ProjectCard = new ProjectCard();
            const projectCardElement = projectCard.createProjectCard(project);
            fragment.appendChild(projectCardElement);
        }

        projectListContainer.appendChild(fragment);
    }

    private showError(projectListContainer: Element)
    {
        const noProjectsMessage = document.createElement("p");
        noProjectsMessage.textContent = document.documentElement.lang === "en"
            ? "No projects available at the moment. Please check back later!"
            : "Zurzeit sind keine Projekte verfügbar. Bitte schau später noch einmal vorbei!";
        noProjectsMessage.className = removePrefixFromTag(Tags.ERROR_NO_PROJECTS_CLASSNAME);
        projectListContainer.appendChild(noProjectsMessage);
    }
}
