import { Filter } from "../../../api/github/entities/Filter";
import { NavLink, NavLinkProjectProps } from "../../../components/NavLink";
import { state } from "../../../store";
import { getElementFromQuerySelector } from "../../../utils/Helpers";
import { Observer } from "../observers/IntersectionObserver";

export class ContentProvider
{
    public async loadProjectsIntoNavbar(observer: Observer)
    {
        const filteredProjectLinks = state.filter.map(filter => ({
            href: filter.filterName,
            name: filter.filterName,
            isContentFetched: false,
            ignoredByObserver: true
        }));

        const dynamicLinks = this.generatePreviousAndNextLinks(observer);

        this.renderNavbar([...dynamicLinks, ...filteredProjectLinks], true, true);
    }

    public unloadProjectsFromNavbar()
    {
        const defaultLinks = state.navbarLinks;
        this.renderNavbar(defaultLinks);
    }

    private renderNavbar(props: NavLinkProjectProps[], hasPreviousSection?: boolean, hasFollowingSection?: boolean)
    {
        const navbarList = getElementFromQuerySelector("nav ul");
        navbarList.innerHTML = "";

        const mainFragment = document.createDocumentFragment();

        props.forEach(link =>
        {
            let navLink = new NavLink();
            navLink.renderNavLink(mainFragment, {
                name: link.name,
                href: link.href,
                isContentFetched: link.isContentFetched,
                ignoredByObserver: link.ignoredByObserver
            });
        });

        navbarList.appendChild(mainFragment);
    }

    private generatePreviousAndNextLinks(observer: Observer): NavLinkProjectProps[]
    {
        const links: NavLinkProjectProps[] = [];

        if (observer.HasPrevious())
        {
            const previousSectionName = observer.getSectionNameByIndex(observer.currentSectionId - 1);
            console.log(`Previous: ${previousSectionName} with id ${observer.currentSectionId - 1}`);

            if (previousSectionName)
            {
                links.unshift({
                    name: this.getNameOfSection(previousSectionName),
                    href: `#$${previousSectionName}`,
                    isContentFetched: false,
                    ignoredByObserver: false
                })
            }
        }

        if (observer.HasNext())
        {
            const nextSectionName = observer.getSectionNameByIndex(observer.currentSectionId + 1);
            console.log(`Next: ${nextSectionName} with id ${observer.currentSectionId + 1}`);

            if (nextSectionName)
            {
                links.push({
                    name: this.getNameOfSection(nextSectionName),
                    href: `#$${nextSectionName}`,
                    isContentFetched: false,
                    ignoredByObserver: false
                })
            }
        }

        return links;
    }

    getNameOfSection = (section: string) => 
    {
        return section.charAt(0).toUpperCase() + section.slice(1);
    }
}