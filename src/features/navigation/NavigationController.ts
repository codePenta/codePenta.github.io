import { NavLink } from './NavLink';
import { NavLinkProps, SectionConfig } from './Types';
import { state } from '../../store';
import { ProjectList } from '../projects/ProjectList';
import { getElementFromQuerySelector } from '../../shared/Helpers';
import { FilterConstants, Tags } from '../../shared/constants';

export class NavigationController
{
    private navLink = new NavLink();
    private activeSectionId: string;
    private activeFilter: string = FilterConstants.DEFAULT_FILTER_STATE;

    constructor(private sections: SectionConfig[])
    {
        this.activeSectionId = sections[0]?.id ?? '';
    }

    public getActiveSectionId(): string
    {
        return this.activeSectionId;
    }

    public initFromLocation(): void
    {
        const hash = window.location.hash.replace('#', '');
        if (!hash) return;

        const [sectionId, filterName] = hash.split('/');
        const section = this.sections.find(s => s.id === sectionId);
        if (!section) return;

        this.activeSectionId = section.id;

        if (section.expandable && filterName)
        {
            const filter = state.filter.find(f => f.filterName === filterName);
            if (filter)
            {
                this.activeFilter = filterName;
                new ProjectList().renderProjectList({ projects: filter.filteredContent });
            }
        }
    }

    public onSectionActivate(id: string, viaScroll: boolean): void
    {
        if (id === this.activeSectionId) return;

        this.activeSectionId = id;

        const section = this.sections.find(s => s.id === id);
        const persistedFilterActive = section?.expandable && this.activeFilter !== FilterConstants.DEFAULT_FILTER_STATE;
        const url = persistedFilterActive ? `#${id}/${this.activeFilter}` : `#${id}`;

        viaScroll
            ? window.history.replaceState(null, '', url)
            : window.history.pushState(null, '', url);

        this.render();
    }

    public onFilterSelect(filterName: string): void
    {
        if (filterName === this.activeFilter) return;

        const filter = state.filter.find(f => f.filterName === filterName);
        if (!filter) return;

        this.activeFilter = filterName;
        window.history.pushState(null, '', `#${this.activeSectionId}/${filterName}`);

        new ProjectList().renderProjectList({ projects: filter.filteredContent });
        this.render();
    }

    public scrollTo(id: string): void
    {
        this.onSectionActivate(id, false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        this.closeMobileSheet();
    }

    public render(): void
    {
        const items = this.buildNavItems();
        this.renderDesktop(items);
        this.renderMobileSheet(items);
    }

    private closeMobileSheet(): void
    {
        const toggle = document.getElementById('menu-toggle') as HTMLInputElement | null;
        if (toggle) toggle.checked = false;
    }

    private renderDesktop(items: NavLinkProps[]): void
    {
        const navList = getElementFromQuerySelector(Tags.NAVBAR_LIST_SELECTOR);
        navList.innerHTML = '';

        const fragment = document.createDocumentFragment();
        items.forEach((props, index) =>
        {
            const li = this.navLink.createLink(props);
            li.style.setProperty('--i', String(index));
            fragment.appendChild(li);
        });
        navList.appendChild(fragment);
    }

    private renderMobileSheet(items: NavLinkProps[]): void
    {
        const sheetList = getElementFromQuerySelector(Tags.MOBILE_SHEET_LIST_SELECTOR);
        sheetList.innerHTML = '';

        const fragment = document.createDocumentFragment();
        let stepIndex = 0;
        let index = 0;
        let activeChip: HTMLButtonElement | null = null;

        while (index < items.length)
        {
            const props = items[index];

            if (props.kind === 'filter')
            {
                const li = document.createElement('li');
                li.className = 'sheet-item';
                li.style.setProperty('--i', String(stepIndex++));

                const scroller = document.createElement('div');
                scroller.className = 'filter-scroller';

                while (index < items.length && items[index].kind === 'filter')
                {
                    const filterProps = items[index] as Extract<NavLinkProps, { kind: 'filter' }>;
                    const chip = this.navLink.createChip(filterProps);
                    if (filterProps.isActive) activeChip = chip;
                    scroller.appendChild(chip);
                    index++;
                }

                li.appendChild(scroller);
                fragment.appendChild(li);
                continue;
            }

            const li = this.navLink.createLink(props);
            li.classList.add('sheet-item');
            li.style.setProperty('--i', String(stepIndex++));
            fragment.appendChild(li);
            index++;
        }

        sheetList.appendChild(fragment);
        activeChip?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    private buildNavItems(): NavLinkProps[]
    {
        const items: NavLinkProps[] = [];
        const expandedIndex = this.sections.findIndex(s => s.expandable && s.id === this.activeSectionId);

        this.sections.forEach((section, index) =>
        {
            const isActive = section.id === this.activeSectionId;

            if (isActive && section.expandable)
            {
                items.push({ kind: 'heading', id: section.id, label: section.label });
                items.push(...this.buildFilterItems());
                return;
            }

            const isBackLink = expandedIndex !== -1;

            items.push({
                kind: 'section',
                id: section.id,
                label: section.label,
                isActiveSection: isActive,
                isBackLink,
                backDirection: isBackLink ? (index < expandedIndex ? 'up' : 'down') : undefined,
                onClick: () => this.scrollTo(section.id),
            });
        });

        return items;
    }

    private buildFilterItems(): NavLinkProps[]
    {
        return state.filter.map(f => ({
            kind: 'filter' as const,
            id: f.filterName,
            label: `${f.filterName} (${f.count})`,
            isActive: f.filterName === this.activeFilter,
            onClick: () => this.onFilterSelect(f.filterName),
        }));
    }
}