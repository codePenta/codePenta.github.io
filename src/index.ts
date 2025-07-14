// src/main.ts

// Importiere alles, was die App orchestriert
import { observeSections } from "./services/web/observers/IntersectionObserver";
// createProjectsSection aus NavContentProvider.ts ist nicht mehr nötig, da der Store die Daten verwaltet
// und ProjectList.ts die Darstellung macht.

import { createNavbar } from './components/Navbar'; // Deine Navbar-Komponente
import { createProjectList } from "./components/ProjectList"; // Deine ProjectList-Komponente

import { subscribe, updateProjects } from './store'; // Dein zentraler Store
import { fetchProjects } from './api/github/services/projectsAPI'; // Die Funktion, die Projekte holt


// DOM-Referenzen, die für die UI-Updates benötigt werden
// Hier können sie direkt sein, da sie nur einmal zu Beginn abgefragt werden
const navElement = document.querySelector("nav");
const projectsSection = document.querySelector("#projects");
const appRootElement = document.getElementById("app-root"); // Optional: Ein zentrales Element, wo alles gerendert wird
// Oder eben direkt body/main/sections


// --- Initialisierung der Anwendung ---
async function initializeApp(): Promise<void>
{
    console.log("Initializing application...");

    // 1. Initialisiere den Intersection Observer
    observeSections();

    // 2. Lade die initialen Projektdaten und aktualisiere den Store
    try
    {
        // Optionale Ladeanzeige, BEVOR die Daten geladen werden
        if (projectsSection)
        {
            projectsSection.innerHTML = "<p>Loading projects...</p>";
        }

        const initialProjects = await fetchProjects(); // Daten laden
        updateProjects(initialProjects); // Store aktualisieren -> triggert den subscribe-Callback!

    } catch (error)
    {
        console.error("Error loading initial project data:", error);
        // Fallback: Store mit leeren Projekten aktualisieren oder Fehlermeldung setzen
        updateProjects([]); // Oder du hast eine "setError" Funktion im Store
        if (projectsSection)
        {
            projectsSection.innerHTML = "<p class='error-message'>Failed to load projects. Please try again later.</p>";
        }
    }
    console.log("Application initialized.");
}

subscribe(state =>
{
    console.log("Store state updated, rendering UI...", state);

    // Aktualisiere die Navbar
    if (navElement)
    {
        // Die alte Navbar entfernen, falls vorhanden
        // ACHTUNG: Hier keine Transition-Logik, das wäre im createNavbar oder über MutationObserver
        while (navElement.firstChild)
        {
            navElement.removeChild(navElement.firstChild);
        }
        navElement.appendChild(createNavbar({ links: state.navbarLinks }));
    }

    // Aktualisiere die Projektsektion
    if (projectsSection)
    {
        // Hier wäre die Logik für Animationen relevant, z.B. wenn Projektkarten ein- und ausfaden sollen
        // Das ist komplexer als einfach innerHTML = "" oder replaceChild.
        // Für einfache Ersetzung:
        while (projectsSection.firstChild)
        {
            projectsSection.removeChild(projectsSection.firstChild);
        }
        projectsSection.appendChild(createProjectList({ projects: state.projects }));
    }
});


// --- Start der Anwendung nach DOM-Bereitschaft ---
// Nur ein DOMContentLoaded-Listener, der die Hauptinitialisierungsfunktion aufruft
document.addEventListener("DOMContentLoaded", initializeApp);