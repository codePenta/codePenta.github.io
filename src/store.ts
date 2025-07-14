import { Project } from '../src/api/github/entities/ProjectEntity';

export type AppState = {
    projects: Project[];
    navbarLinks: { name: string; href: string }[];
};

export const state: AppState = {
    projects: [],
    navbarLinks: [
        { name: "Home", href: "#home" },
        { name: "Projects", href: "#projects-section" }
    ]
};

const subscribers: ((state: AppState) => void)[] = [];

export function subscribe(callback: (state: AppState) => void)
{
    subscribers.push(callback);
    callback(state); // Initialen Zustand sofort senden
}

function notifySubscribers()
{
    subscribers.forEach(callback => callback(state));
}

export function updateProjects(newProjects: Project[])
{
    state.projects = newProjects;
    state.navbarLinks = newProjects.map(p => ({ name: p.name, href: p.url }));
    notifySubscribers(); // Informiere alle, die auf Änderungen hören
}