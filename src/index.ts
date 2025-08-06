import { observeSections } from "./services/web/observers/IntersectionObserver";
import { createNavbar } from './components/Navbar';
import { createProjectList } from "./components/ProjectList";

import { state, updateProjects } from './store';
import { fetchProjects } from './api/github/services/projectsAPI';

const navElement = document.querySelector("nav");
const projectsSection = document.querySelector("#projects");

async function initializeApp(): Promise<void>
{
    console.log("Initializing application...");

    observeSections();

    try
    {
        if (projectsSection)
        {
            const initialProjects = await fetchProjects();
            updateProjects(initialProjects);

            projectsSection.innerHTML = "<p>Loading projects...</p>";

            while (projectsSection.firstChild)
            {
                projectsSection.removeChild(projectsSection.firstChild);
            }
            projectsSection.appendChild(createProjectList({ projects: state.projects }));
        }

        if (navElement)
        {
            while (navElement.firstChild)
            {
                navElement.removeChild(navElement.firstChild);
            }

            navElement.appendChild(createNavbar({ links: state.navbarLinks }))
        }


    } catch (error)
    {
        console.error("Error loading initial project data:", error);
        updateProjects([]);
        if (projectsSection)
        {
            projectsSection.innerHTML = "<p class='error-message'>Failed to load projects. Please try again later.</p>";
        }
    }
    console.log("Application initialized.");
}

document.addEventListener("DOMContentLoaded", initializeApp);