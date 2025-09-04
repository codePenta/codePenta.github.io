import { Project } from "../api/github/entities/Project";
import { state } from "../store";
import { ProjectList } from "./ProjectList";

export type NavLinkProjectProps = {
    href: string;
    name: string;
    ignoredByObserver: boolean;
};

export class NavLink
{
    public createNavLink(navLinkProps: NavLinkProjectProps): HTMLLIElement
    {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.textContent = navLinkProps.name;
        a.href = navLinkProps.href;

        if (navLinkProps.ignoredByObserver)
        {
            this.setupNavLinkForUserClick(a);
        }

        li.appendChild(a);
        return li;
    }

    public renderNavLink(parent: DocumentFragment, navLinkProps: NavLinkProjectProps)
    {
        const li = document.createElement("li");
        const a = document.createElement("a");

        a.textContent = navLinkProps.name;
        a.href = navLinkProps.href;

        if (navLinkProps.ignoredByObserver)
        {
            this.setupNavLinkForUserClick(a);
        }

        li.appendChild(a);
        parent.appendChild(li);
    }

    private setupNavLinkForUserClick(a: HTMLAnchorElement)
    {
        a.addEventListener('click', (event) => this.handleClick(event));
    }

    private handleClick(event: any)
    {
        event.preventDefault();

        state.selectedFilter = event.target.innerText;
        if (state.selectedFilter === 'All')
        {
            new ProjectList().renderProjectList({ projects: state.projects });
            return;
        }

        const filteredProjets: Project[] = state.projects.filter(this.isProjectInFilter);
        new ProjectList().renderProjectList({ projects: filteredProjets });
    }

    private isProjectInFilter(value: Project)
    {
        var isInFilter = value.language === state.selectedFilter;

        return isInFilter;
    }
}