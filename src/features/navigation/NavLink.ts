import { NavLinkProps } from './Types';

export class NavLink
{
    public createLink(props: NavLinkProps): HTMLLIElement
    {
        const li = document.createElement("li");

        if (props.kind === 'heading')
        {
            const span = document.createElement("span");
            span.textContent = props.label;
            span.classList.add("nav-heading");
            if (props.id.endsWith("-filters")) span.classList.add("filter-heading");
            li.appendChild(span);
            return li;
        }

        if (props.kind === 'group')
        {
            li.classList.add("nav-group");
            li.dataset.direction = props.direction;

            if (props.direction === 'up')
            {
                const arrow = document.createElement("span");
                arrow.className = "arrow";
                arrow.textContent = "↑";
                li.appendChild(arrow);
            }

            props.links.forEach((link, index) =>
            {
                if (index > 0)
                {
                    const divider = document.createElement("span");
                    divider.className = "nav-group-divider";
                    divider.textContent = "·";
                    li.appendChild(divider);
                }

                const a = document.createElement("a");
                a.textContent = link.label;
                a.href = `#${link.id}`;
                a.classList.add("back-link");
                a.addEventListener("click", (event) =>
                {
                    event.preventDefault();
                    link.onClick();
                });
                li.appendChild(a);
            });

            if (props.direction === 'down')
            {
                const arrow = document.createElement("span");
                arrow.className = "arrow";
                arrow.textContent = "↓";
                li.appendChild(arrow);
            }

            return li;
        }

        const a = document.createElement("a");
        a.textContent = props.label;
        a.href = `#${props.id}`;
        a.addEventListener("click", (event) =>
        {
            event.preventDefault();
            props.onClick();
        });

        if (props.kind === 'section')
        {
            a.classList.toggle("active", props.isActiveSection);
        }
        else
        {
            a.classList.toggle("active", props.isActive);
            a.classList.add("filter-link");
        }

        li.appendChild(a);
        return li;
    }

    public createChip(props: Extract<NavLinkProps, { kind: 'filter' }>): HTMLButtonElement
    {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.textContent = props.label;
        chip.classList.add("chip");
        chip.classList.toggle("active", props.isActive);
        chip.addEventListener("click", props.onClick);
        return chip;
    }
}