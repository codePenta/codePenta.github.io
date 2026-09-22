import { Project } from './api/github/entities/Project';
import { Filter } from './api/github/entities/Filter';
import { createFilters } from './services/web/provider/FilterProvider';

export type AppState = {
    projects: Project[];
    filter: Filter[];
};

export const state: AppState = { projects: [], filter: [] };

export function updateState(newProjects: Project[])
{
    state.projects = newProjects;
    state.filter = createFilters(newProjects);
}