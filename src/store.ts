import { Project } from './api/github/entities/Project';
import { Filter } from './api/github/entities/Filter';
import { createFilters } from './services/web/provider/FilterProvider';

export type AppState = {
    projects: Project[];
    navbarLinks: { name: string; href: string, navigate: boolean, ignoredByObserver: boolean }[];
    filter: Filter[];
    selectedFilter: string;
    previousSection: string;
    nextSection: string;
};

export const state: AppState = {
    projects: [],
    navbarLinks: [
        { name: "Home", href: "#home", navigate: true, ignoredByObserver: false },
        { name: "Projects", href: "#projects", navigate: true, ignoredByObserver: false },
    ],
    filter: [],
    selectedFilter: "",
    previousSection: "",
    nextSection: "",
};

export function updateState(newProjects: Project[])
{
    state.projects = newProjects;
    state.filter = createFilters(newProjects);
}