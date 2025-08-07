import { createNavLink, NavLinkProps } from "../../../components/NavLink";
import { createProjectCard } from "../../../components/ProjectCard";
import { Project } from "../../../api/github/entities/ProjectEntity";
import { state } from "../../../store";
import { createNavbar } from "../../../components/Navbar";

export async function createProjectsSection()
{

    const projectContainer = document.querySelector("#projects-list");
    if (!projectContainer)
        return;
    projectContainer.innerHTML = "";
    for (const project of state.projects)
    {
        projectContainer.appendChild(createProjectCard(project));
    }
}

function renderNavbar(links: { href: string, name: string, ignoredByObserver: boolean }[])
{
    const navbarList = document.querySelector("nav ul");
    if (!navbarList) return;
    navbarList.innerHTML = "";

    for (const link of links)
    {
        var navProps: NavLinkProps = { name: link.name, href: link.href, ignoredByObserver: link.ignoredByObserver }
        const li = createNavLink(navProps);
        navbarList.appendChild(li);
    }
}

export async function loadProjectsIntoNavbar()
{
    renderNavbar(state.projects.map(project => ({ href: project.language, name: project.name, ignoredByObserver: true })));
}

export function unloadProjectsFromNavbar()
{
    renderNavbar(state.navbarLinks);
}