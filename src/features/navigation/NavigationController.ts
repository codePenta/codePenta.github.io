import { NavLink, NavLinkProps } from './NavLink';
import { SectionConfig } from './Types';
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
        // activeFilter bleibt bewusst erhalten — kein Reset

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
    }

    public render(): void
    {
        const navList = getElementFromQuerySelector(Tags.NAVBAR_LIST_SELECTOR);
        navList.innerHTML = '';

        const fragment = document.createDocumentFragment();
        this.buildNavItems().forEach(props => fragment.appendChild(this.navLink.createLink(props)));
        navList.appendChild(fragment);
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
                items.push({ id: section.id, label: section.label, isActiveSection: true, isHeading: true });
                items.push(...this.buildFilterItems());
                return;
            }

            const isBackLink = expandedIndex !== -1;

            items.push({
                id: section.id,
                label: section.label,
                isActiveSection: isActive,
                isHeading: false,
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
            id: f.filterName,
            label: `${f.filterName} (${f.count})`,
            isActiveSection: false,
            isHeading: false,
            isActiveFilter: f.filterName === this.activeFilter,
            onClick: () => this.onFilterSelect(f.filterName),
        }));
    }
}