import { NavLink, NavLinkProjectProps } from './NavLink';

type NavbarProps = { links: NavLinkProjectProps[] };

export class Navbar
{
    public createNavbar(props: NavbarProps): HTMLUListElement
    {
        const navLink: NavLink = new NavLink();
        const ul = document.createElement("ul");

        const fragment = document.createDocumentFragment();
        props.links.forEach(link =>
        {
            fragment.appendChild(navLink.createNavLink(link));
        });

        ul.appendChild(fragment);
        return ul;
    }
}