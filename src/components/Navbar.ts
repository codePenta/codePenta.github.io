import { createNavLink, NavLinkProjectProps } from './NavLink';

type NavbarProps = {
    links: NavLinkProjectProps[];
};

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