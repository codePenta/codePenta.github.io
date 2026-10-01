import { NavLink } from './NavLink';
import { NavLinkProps, SectionConfig } from './Types';
import { state } from '../../store';
import { ProjectList } from '../projects/ProjectList';
import { getElementFromQuerySelector, waitForScrollEnd } from '../../shared/Helpers';
import { FilterConstants, Tags } from '../../shared/constants';

export class NavigationController
{
    private navLink = new NavLink();
    private activeSectionId: string;
    private activeFilter: string = FilterConstants.DEFAULT_FILTER_STATE;
    private static readonly GROUP_COLLAPSE_THRESHOLD = 3;

    /**
     * FIX (Scroll-Lock): Solange WIR die Seite scrollen (Klick auf Nav-Link, Filter-Wechsel),
     * ignorieren wir die Meldungen des Observers – sonst springt die Navbar unterwegs durch jede
     * Section, über die das smooth scroll hinwegfährt, oder reagiert auf Layout-Sprünge.
     * Zähler statt boolean, damit sich zwei schnell hintereinander ausgelöste Scrolls nicht gegenseitig entsperren.
     */
    private scrollLocks = 0;

    /** Was der Observer zuletzt gemeldet hat – auch während des Locks. Wird nach dem Scrollen nachgezogen. */
    private lastObservedSectionId: string | null = null;

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
            const filter = state.filter.find(f => f.name === filterName);
            if (filter)
            {
                this.activeFilter = filterName;
                new ProjectList().renderProjectList({ projects: filter.content });
            }
        }
    }

    public onSectionActivate(id: string, viaScroll: boolean): void
    {
        if (viaScroll)
        {
            this.lastObservedSectionId = id;
            if (this.scrollLocks > 0) return; // wird nach Scroll-Ende per syncWithObservedSection() nachgeholt
        }

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

        const filter = state.filter.find(f => f.name === filterName);
        if (!filter) return;

        this.activeFilter = filterName;
        window.history.pushState(null, '', `#${this.activeSectionId}/${filterName}`);

        /*
         * FIX (Filter springt eine Section weiter):
         * Ein Filter macht die Projektliste fast immer KÜRZER (z. B. 9 → 2 Karten).
         * Alles darunter (Kontakt) rutscht dadurch nach oben ins Sichtfeld bzw. der Browser
         * klemmt die Scroll-Position, weil die Seite plötzlich kürzer ist.
         * Folge: Der Observer sieht "Kontakt" in der Bildmitte → Navbar wechselt weg vom Filter,
         * und für den Nutzer sieht es aus, als wäre eine Section weiter gescrollt worden.
         * Lösung: Während des Neu-Renderns Observer sperren und den Bereich wieder an seinen Anfang holen.
         */
        const sectionId = this.activeSectionId;
        void this.runWithScrollLock(() =>
        {
            new ProjectList().renderProjectList({ projects: filter.content });
            this.revealSectionStart(sectionId);
        });

        this.render();
    }

    public scrollTo(id: string): void
    {
        this.onSectionActivate(id, false);
        this.closeMobileSheet();
        void this.runWithScrollLock(() =>
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }));
    }

    /** Führt eine programmatische Scroll-Aktion aus und blendet den Observer bis zum Scroll-Ende aus. */
    private async runWithScrollLock(action: () => void): Promise<void>
    {
        this.scrollLocks++;
        try
        {
            action();
            await waitForScrollEnd();
        }
        finally
        {
            this.scrollLocks--;
        }

        if (this.scrollLocks === 0) this.syncWithObservedSection();
    }

    /**
     * Nach dem Scrollen gilt wieder: Der Observer ist die Wahrheit für "wo bin ich gerade".
     * Ein Klick ist nur die Absicht – falls das Ziel z. B. zu kurz ist, um die Bildmitte zu erreichen,
     * korrigieren wir hier auf das, was tatsächlich zu sehen ist.
     */
    private syncWithObservedSection(): void
    {
        if (this.lastObservedSectionId && this.lastObservedSectionId !== this.activeSectionId)
        {
            this.onSectionActivate(this.lastObservedSectionId, true);
        }
    }

    /** Scrollt nur, wenn der Anfang der Section oberhalb des Bildschirms liegt (Nutzer ist schon "drin"). */
    private revealSectionStart(id: string): void
    {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top < 0)
        {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    public render(): void
    {
        this.sections.forEach(section =>
        {
            const element = document.getElementById(section.id);
            if (element?.dataset.navLabel) section.label = element.dataset.navLabel;
        });

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
        let activeScroller: HTMLElement | null = null;

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
                    if (filterProps.isActive)
                    {
                        activeChip = chip;
                        activeScroller = scroller;
                    }
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
        if (activeChip && activeScroller) this.centerChipInScroller(activeScroller, activeChip);
    }

    /**
     * FIX (Seite springt beim Filter / Section-Wechsel):
     * Vorher: `activeChip.scrollIntoView(...)`. scrollIntoView scrollt ALLE scrollbaren Vorfahren –
     * je nach Browser (v. a. iOS Safari) also auch die Seite selbst. Besonders heikel, weil render()
     * bei jedem Section-Wechsel läuft, auch wenn das Sheet zugeklappt UNTERHALB des Viewports hängt:
     * dann "holt" der Browser den Chip ins Bild und scrollt dafür die Seite.
     * Jetzt: Wir scrollen gezielt nur die horizontale Chip-Leiste.
     */
    private centerChipInScroller(scroller: HTMLElement, chip: HTMLElement): void
    {
        const scrollerRect = scroller.getBoundingClientRect();
        const chipRect = chip.getBoundingClientRect();
        const left = scroller.scrollLeft
            + (chipRect.left - scrollerRect.left)
            - (scroller.clientWidth - chipRect.width) / 2;

        scroller.scrollTo({ left, behavior: 'smooth' });
    }

    private buildNavItems(): NavLinkProps[]
    {
        this.sections.forEach(section =>
        {
            const element = document.getElementById(section.id);
            if (element?.dataset.navLabel) section.label = element.dataset.navLabel;
        });

        const expandedIndex = this.sections.findIndex(s => s.expandable && s.id === this.activeSectionId);

        if (expandedIndex === -1)
        {
            return this.sections.map(section => ({
                kind: 'section' as const,
                id: section.id,
                label: section.label,
                isActiveSection: section.id === this.activeSectionId,
                isBackLink: false,
                onClick: () => this.scrollTo(section.id),
            }));
        }

        const items: NavLinkProps[] = [];
        const before = this.sections.slice(0, expandedIndex);
        const after = this.sections.slice(expandedIndex + 1);
        const expandedSection = this.sections[expandedIndex];

        if (before.length > 0) items.push(this.buildDirectionalGroup(before, 'up'));

        items.push({ kind: 'heading', id: expandedSection.id, label: expandedSection.label });
        items.push({
            kind: 'heading',
            id: `${expandedSection.id}-filters`,
            label: document.documentElement.lang === 'en' ? 'Filter by language' : 'Filtern nach Sprache',
        });
        items.push(...this.buildFilterItems());

        if (after.length > 0) items.push(this.buildDirectionalGroup(after, 'down'));

        return items;
    }
    private buildDirectionalGroup(sections: SectionConfig[], direction: 'up' | 'down'): NavLinkProps
    {
        if (sections.length <= NavigationController.GROUP_COLLAPSE_THRESHOLD)
        {
            return {
                kind: 'group',
                direction,
                links: sections.map(s => ({ id: s.id, label: s.label, onClick: () => this.scrollTo(s.id) })),
            };
        }

        const nearest = direction === 'up' ? sections[sections.length - 1] : sections[0];
        const remaining = sections.length - 1;

        return {
            kind: 'group',
            direction,
            links: [{
                id: nearest.id,
                label: `${nearest.label} +${remaining}`,
                onClick: () => this.scrollTo(nearest.id),
            }],
        };
    }

    private buildFilterItems(): NavLinkProps[]
    {
        return state.filter.map(filter => ({
            kind: 'filter' as const,
            id: filter.name,
            label: filter.name,
            isActive: filter.name === this.activeFilter,
            onClick: () => this.onFilterSelect(filter.name),
        }));
    }
}