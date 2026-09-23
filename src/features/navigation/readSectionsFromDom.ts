import { SectionConfig } from './Types';

export function readSectionsFromDom(): SectionConfig[]
{
    return Array.from(document.querySelectorAll<HTMLElement>('section[data-nav-label]'))
        .map(el => ({
            id: el.id,
            label: el.dataset.navLabel!,
            expandable: el.dataset.navExpandable === 'true',
        }));
}
