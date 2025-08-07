import { state } from "../store";

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

function handleClick(event: MouseEvent)
{
    event.preventDefault();
}