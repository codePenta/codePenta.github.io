import { Filter } from "../../../api/github/entities/Filter";
import { NavLink, NavLinkProjectProps } from "../../../components/NavLink";
import { state } from "../../../store";
import { getElementFromQuerySelector } from "../../../utils/Helpers";

export class ContentProvider
{
    public async loadProjectsIntoNavbar()
    {
        this.renderNavbar(state.filter.map(filter => ({ href: filter.filterName, name: filter.filterName, isContentFetched: false, ignoredByObserver: true })), true, true);
    }

    public unloadProjectsFromNavbar()
    {
        this.renderNavbar(state.navbarLinks);
    }

    private renderNavbar(props: NavLinkProjectProps[], hasPreviousSection?: boolean, hasFollowingSection?: boolean)
    {
        const navbarList = getElementFromQuerySelector("nav ul")
        navbarList.innerHTML = "";

        const mainFragment = document.createDocumentFragment();

        props.forEach(link =>
        {
            let navLink = new NavLink();
            navLink.renderNavLink(mainFragment, {
                name: link.name,
                href: link.href,
                isContentFetched: false,
                ignoredByObserver: link.ignoredByObserver
            });
        });

        if (hasPreviousSection)
        {

            var previousNav = new NavLink();
            const previousFragment = document.createDocumentFragment();
            previousNav.renderNavLink(previousFragment, {
                name: this.getNameOfPreviousSection(state.previousSection),
                href: "#",
                isContentFetched: true,
                ignoredByObserver: false
            })

            console.log(state.previousSection);
            navbarList.appendChild(previousFragment);
        }

        navbarList.appendChild(mainFragment);
    }

    getNameOfPreviousSection = (section: string) => 
    {
        return section.charAt(0).toUpperCase() + section.slice(1);
    }
}