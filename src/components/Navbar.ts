import { createNavLink, NavLinkProps } from './NavLink';

type NavbarProps = {
    links: NavLinkProps[];
};

// Diese Funktion erstellt die ul und hängt die links an.
// Sie kann neu aufgerufen werden, um die Navbar zu aktualisieren.
export function createNavbar(props: NavbarProps): HTMLUListElement
{
    const ul = document.createElement("ul");

    const fragment = document.createDocumentFragment();
    props.links.forEach(link =>
    {
        fragment.appendChild(createNavLink(link));
    });

    ul.appendChild(fragment);
    return ul;
}