import { RepoEntity } from "../../../api/github/entities/ProjectEntity";

var projects: Project[] = [];
var navbarBackup: string;

type Project = {
    name: string;
    language: string;
    description: string;
    html_url: string;
}

const defaultNavLinks = [
    { name: "Home", href: "#home" },
    { name: "Projects", href: "#projects-section" }
];

async function loadProjects(): Promise<any>
{
    const res = await fetch('data/projects.json');
    projects = await res.json();
    return projects
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

function createProjectCard(project: Project): HTMLElement
{
    const card = document.createElement("div");
    card.className = "project-card";

    const h2 = document.createElement("h2");
    h2.textContent = project.name;

    const language = document.createElement("p");
    language.textContent = project.language;

    const url = document.createElement("a");
    url.textContent = `Click here`;
    url.href = project.html_url;

    const description = document.createElement("p");
    description.textContent = project.description;

    card.append(h2, language, url, description);
    return card;
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

    renderNavbar(projects.map(project => ({ name: project.name, href: project.html_url })));
}

export function unloadProjectsFromNavbar()
{
    renderNavbar(defaultNavLinks);
}