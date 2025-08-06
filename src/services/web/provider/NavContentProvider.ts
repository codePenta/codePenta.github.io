import { NavLinkProps } from "../../../components/NavLink";
import { createProjectCard } from "../../../components/ProjectCard";
import { Project } from "../../../api/github/entities/ProjectEntity";
import { state } from "../../../store";

const projectsPath = "/public/data/projects.json";

var projects: Project[] = [];

async function loadProjects(): Promise<any>
{
    try
    {
        const res = await fetch("/data/projects.json");
        projects = await res.json();
        console.log(projects);

        return projects
    } catch (error)
    {
        console.error(`Failed loading projects: ${error}`)
    }
}

export async function createProjectsSection()
{
    if (projects.length == 0)
    {
        projects = await loadProjects();
    }

    const projectContainer = document.querySelector("#projects");
    if (!projectContainer)
        return;
    projectContainer.innerHTML = "";
    for (const project of projects)
    {
        projectContainer.appendChild(createProjectCard(project));
    }
}

function renderNavbar(links: { name: string, href: string }[])
{
    const navbarList = document.querySelector("nav ul");
    if (!navbarList) return;
    navbarList.innerHTML = "";

    for (const link of links)
    {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.textContent = link.name;
        a.href = link.href;
        li.appendChild(a);
        navbarList.appendChild(li);
    }
}

export async function loadProjectsIntoNavbar()
{
    if (projects.length === 0)
    {
        projects = await loadProjects();
    }

    renderNavbar(projects.map(project => ({ name: project.name, href: project.url })));
}

export function unloadProjectsFromNavbar()
{
    renderNavbar(state.navbarLinks);
}