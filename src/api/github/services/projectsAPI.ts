// src/api/github/services/GitHubApiService.ts (oder projectsApi.ts)

import { GitHubRepoApiResponse, Project } from '../entities/ProjectEntity';
import { mapGitHubReposToProjects } from '../mappers/GitHubRepoMapper';

const PROJECTS_DATA_PATH = "/data/projects.json"; // Pfad relativ zum public-Ordner/Root der Deployment-Seite

export async function fetchProjects(): Promise<Project[]>
{
    try
    {
        const response = await fetch(PROJECTS_DATA_PATH); // Lädt die generierte JSON
        if (!response.ok)
        {
            throw new Error(`Failed to load projects.json: ${response.status} ${response.statusText}`);
        }
        const rawProjects: GitHubRepoApiResponse[] = await response.json(); // Annahme, dass JSON-Struktur wie API-Antwort ist

        // Verwende den Mapper, um die Rohdaten in dein Project-Format zu überführen
        return mapGitHubReposToProjects(rawProjects);
    } catch (error)
    {
        console.error("Error fetching projects from local JSON:", error);
        throw error; // Fehler weiterwerfen zur Behandlung in der aufrufenden Komponente/Logik
    }
}