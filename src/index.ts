import { observeSections } from "./services/web/observers/IntersectionObserver";
import { createNavbar } from './components/Navbar';
import { renderProjectList } from "./components/ProjectList";

import { state, updateState } from './store';
import { fetchProjects } from './api/github/services/projectsAPI';

const navElement = document.querySelector("nav");
const projectsList = document.querySelector("#projects-list");

async function initializeApp(): Promise<void>
{
    console.log("Initializing application...");

    try
    {
        if (projectsList)
        {
            const initialProjects = await fetchProjects();
            updateState(initialProjects);

            projectsList.innerHTML = "<p>Loading projects...</p>";

            while (projectsList.firstChild)
            {
                projectsList.removeChild(projectsList.firstChild);
            }
            renderProjectList({ projects: state.projects });
        }

        if (navElement)
        {
            while (navElement.firstChild)
            {
                navElement.removeChild(navElement.firstChild);
            }

            navElement.appendChild(createNavbar({ links: state.navbarLinks }))
        }

        observeSections();

    } catch (error)
    {
        console.error("Error loading initial project data:", error);
        updateState([]);
        if (projectsList)
        {
            projectsList.innerHTML = "<p class='error-message'>Failed to load projects. Please try again later.</p>";
        }
    }
    console.log("Application initialized.");
}

document.addEventListener("DOMContentLoaded", initializeApp);