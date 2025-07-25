import { NavLinkProps } from "../../../components/NavLink";

const projectsPath = "/public/data/projects.json";

var projects: Project[] = [];

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

function createNavLink(props: NavLinkProps): HTMLLIElement
{
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = props.name;
    a.href = props.href;
    li.appendChild(a);
    return li;
}

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