import { Filter } from "../../../api/github/entities/Filter";
import { NavLink, NavLinkProjectProps } from "../../../components/NavLink";
import { state } from "../../../store";
import { getElementFromQuerySelector } from "../../../utils/Helpers";

export class ContentProvider
{
    private navLink;

    constructor()
    {
        this.navLink = new NavLink();
    }

    public async loadProjectsIntoNavbar()
    {
        this.renderNavbar(state.filter.map(filter => ({ href: filter.filterName, name: filter.filterName, ignoredByObserver: true })));
        state.projects.forEach((project: any) => 
        {
            console.log(project);
        })
    }

    public unloadProjectsFromNavbar()
    {
        this.renderNavbar(state.navbarLinks);
    }

    private renderNavbar(props: NavLinkProjectProps[])
    {
        const navbarList = getElementFromQuerySelector("nav ul")
        navbarList.innerHTML = "";

        const fragment = document.createDocumentFragment();

        props.forEach(link =>
        {

            this.navLink.renderNavLink(fragment, {
                name: link.name,
                href: link.href,
                ignoredByObserver: link.ignoredByObserver
            });
        });

        navbarList.appendChild(fragment);
    }
}