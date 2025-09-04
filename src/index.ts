import { Observer } from "./services/web/observers/IntersectionObserver";
import { createNavbar } from './components/Navbar';
import { renderProjectList } from "./components/ProjectList";

import { state, updateState } from './store';
import { fetchProjects } from './api/github/services/projectsAPI';

const navElement = document.querySelector("nav");
const projectsList = document.querySelector("#projects-list");

export class App
{
    private observer;

    constructor()
    {
        this.observer = new Observer();
    }

    async initialize(): Promise<void>
    {
        console.log("Initializing application...");

        try
        {
            this.renderPageContents(projectsList, navElement);
            this.observer.observeSections();

        } catch (error)
        {
            this.renderErrorMessage(error, projectsList);
        }

        console.log("Application initialized.");
    }

    private async renderPageContents(projectsList: Element | null, navElement: HTMLElement | null)
    {
        if (projectsList)
        {
            this.renderProjects(projectsList);
        }

        if (navElement)
        {
            this.renderNavbar(navElement);
        }
    }


    private async renderProjects(projectsListTag: Element): Promise<void>
    {
        const initialProjects = await fetchProjects();
        updateState(initialProjects);

        projectsListTag.innerHTML = "<p>Loading projects...</p>";

        while (projectsListTag.firstChild)
        {
            projectsListTag.removeChild(projectsListTag.firstChild);
        }
        renderProjectList({ projects: state.projects });
    }

    private async renderNavbar(navbarElement: HTMLElement)
    {
        while (navbarElement.firstChild)
        {
            navbarElement.removeChild(navbarElement.firstChild);
        }

        navbarElement.appendChild(createNavbar({ links: state.navbarLinks }))
    }

    private async renderErrorMessage(error: any, elementToShowOn?: null | Element)
    {
        console.error("Error loading initial project data:", error);
        updateState([]);
        if (elementToShowOn)
        {
            elementToShowOn.innerHTML = "<p class='error-message'>Failed loading this element.</p>";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => new App().initialize());