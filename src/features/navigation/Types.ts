export type SectionConfig = {
    id: string;
    label: string;
    expandable: boolean;
}

export type NavLinkProps =
    | { kind: 'section'; id: string; label: string; isActiveSection: boolean; isBackLink: boolean; onClick: () => void }
    | { kind: 'heading'; id: string; label: string }
    | { kind: 'filter'; id: string; label: string; isActive: boolean; onClick: () => void }
    | { kind: 'group'; direction: 'up' | 'down'; links: { id: string; label: string; onClick: () => void }[] };