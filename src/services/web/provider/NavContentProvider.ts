import { NavLinkProjectProps, renderNavLink } from "../../../components/NavLink";
import { createProjectCard } from "../../../components/ProjectCard";
import { state } from "../../../store";

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

function renderNavbar(props: NavLinkProjectProps[])
{
    const navbarList = document.querySelector("nav ul");
    if (!navbarList)
    {
        console.warn("Navigation list not found");
        return;
    }

    navbarList.innerHTML = "";

    const fragment = document.createDocumentFragment();

    props.forEach(link =>
    {
        renderNavLink(fragment, {
            name: link.name,
            href: link.href,
            ignoredByObserver: link.ignoredByObserver
        });
    });

    // Füge alles auf einmal ein
    navbarList.appendChild(fragment);
}

export async function loadProjectsIntoNavbar()
{
    renderNavbar(state.filter.map(filter => ({ href: filter.filterName, name: filter.filterName, ignoredByObserver: true })));
}

export function unloadProjectsFromNavbar()
{
    renderNavbar(state.navbarLinks);
}