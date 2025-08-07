import { state } from "../store";

export type NavLinkProps = {
    href: string;
    name: string;
    ignoredByObserver: boolean;
};
export function createNavLink(navLinkProps: NavLinkProps): HTMLLIElement
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

function setupNavLinkForUserClick(a: HTMLAnchorElement)
{
    state.clickedProject = a.textContent;
    a.addEventListener('click', handleClick);
}

function handleClick(event: MouseEvent)
{
    event.preventDefault();
}