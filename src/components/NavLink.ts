import { Project } from "../api/github/entities/ProjectEntity";
import { state } from "../store";
import { renderProjectList } from "./ProjectList";

export type NavLinkProjectProps = {
    href: string;
    name: string;
    ignoredByObserver: boolean;
};

export function createNavLink(navLinkProps: NavLinkProjectProps): HTMLLIElement
{
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = navLinkProps.name;
    a.href = navLinkProps.href;

    if (navLinkProps.ignoredByObserver)
    {
        setupNavLinkForUserClick(a);
    }

    li.appendChild(a);
    return li;
}

export function renderNavLink(parent: DocumentFragment, navLinkProps: NavLinkProjectProps)
{
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = navLinkProps.name;
    a.href = navLinkProps.href;

    if (navLinkProps.ignoredByObserver)
    {
        setupNavLinkForUserClick(a);
    }

    li.appendChild(a);
    parent.appendChild(li);
}

function setupNavLinkForUserClick(a: HTMLAnchorElement)
{
    a.addEventListener('click', handleClick);
}

function handleClick(event: any)
{
    event.preventDefault();

    state.selectedFilter = event.target.innerText;
    if (state.selectedFilter === 'All')
    {
        renderProjectList({ projects: state.projects });
        return;
    }

    const filteredProjets: Project[] = state.projects.filter(isProjectInFilter);
    renderProjectList({ projects: filteredProjets });
}

function isProjectInFilter(value: Project)
{
    var isInFilter = value.language === state.selectedFilter;

    return isInFilter;
}