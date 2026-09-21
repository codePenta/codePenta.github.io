import { Observer } from "./services/web/observers/IntersectionObserver";
import { Navbar } from './features/navigation/Navbar';
import { ProjectList } from "./features/projects/ProjectList";

import { state, updateState } from './store';
import { fetchProjects } from './api/github/services/projectsAPI';
import { renderGlobalError, renderError as showError } from "./shared/Helpers";

const navElement = document.querySelector("nav");
const projectsList = document.querySelector("#projects-list");

export class App
{
    private observer;
    private navbar;

    constructor()
    {
        this.observer = new Observer();
        this.navbar = new Navbar();
    }

    async initialize()
    {
        console.log("Initializing application...");
        try
        {
            await this.renderPageContents(projectsList, navElement);
            this.observer.observeSections();

        } catch (error)
        {
            renderGlobalError(projectsList, error);
        }

        console.log("Application initialized.");
    }

    private async renderPageContents(projectsList: Element | null, navElement: HTMLElement | null)
    {
        const initialProjects = await fetchProjects();
        updateState(initialProjects);

        if (projectsList)
        {
            this.renderProjects(projectsList);
        }

        if (navElement)
        {
            this.buildNavbar(navElement);
        }
    }

    private renderProjects(projectsListTag: Element): void
    {
        projectsListTag.innerHTML = "<p>Loading projects...</p>";

        while (projectsListTag.firstChild)
        {
            projectsListTag.removeChild(projectsListTag.firstChild);
        }

        new ProjectList().renderProjectList({ projects: state.projects });
    }

    private buildNavbar(navbarElement: HTMLElement): void
    {
        while (navbarElement.firstChild)
        {
            navbarElement.removeChild(navbarElement.firstChild);
        }

        navbarElement.appendChild(this.navbar.createNavbar({ links: state.navbarLinks }));
    }
}

document.addEventListener("DOMContentLoaded", () =>
{
    // init application
    new App().initialize();
});