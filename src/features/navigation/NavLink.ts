export type NavLinkProps = {
    id: string;
    label: string;
    isActiveSection: boolean;
    isHeading: boolean;
    isActiveFilter?: boolean;
    isBackLink?: boolean;
    backDirection?: 'up' | 'down';
    onClick?: () => void;
};

export class NavLink
{
    public createLink(props: NavLinkProps): HTMLLIElement
    {
        const li = document.createElement("li");

        if (props.isHeading)
        {
            const span = document.createElement("span");
            span.textContent = props.label;
            span.classList.add("nav-heading");
            li.appendChild(span);
            return li;
        }

        const a = document.createElement("a");
        a.textContent = props.label;
        a.href = `#${props.id}`;
        a.classList.toggle("active", props.isActiveSection || !!props.isActiveFilter);
        a.classList.toggle("back-link", !!props.isBackLink);
        if (props.backDirection) a.dataset.direction = props.backDirection;

        if (props.onClick)
        {
            a.addEventListener("click", (event) =>
            {
                event.preventDefault();
                props.onClick!();
            });
        }

        li.appendChild(a);
        return li;
    }
}