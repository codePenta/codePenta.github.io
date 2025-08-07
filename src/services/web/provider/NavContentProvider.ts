import { Filter } from "../../../api/github/entities/FilterEntity";
import { NavLinkProjectProps, renderNavLink } from "../../../components/NavLink";
import { state } from "../../../store";

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