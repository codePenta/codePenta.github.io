import { SectionConfig } from './Types';

export function read(): SectionConfig[]
{
    return Array.from(document.querySelectorAll<HTMLElement>('section[data-nav-label]'))
        .map(section => ({
            id: section.id,
            label: section.dataset.navLabel!,
            expandable: section.dataset.navExpandable === 'true',
        }));
}