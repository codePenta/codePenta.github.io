export type NavLinkProps = {
    name: string;
    href: string;
};

export function createNavLink(props: NavLinkProps): HTMLLIElement
{
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = props.name;
    a.href = props.href;
    li.appendChild(a);
    return li;
}