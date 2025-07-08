import { observeSections } from "./services/web/observers/IntersectionObserver";
import { createProjectsSection } from "./services/web/provider/NavContentProvider";

async function initializeWebComponents(): Promise<void>
{
    console.log("Initializing web components...");

    try
    {
        createProjectsSection();
    }
    catch (error)
    {
        console.error("Error initializing web components:", error);
    }
}

function boostrap(): void
{
    console.log("Boostrap function called");
    document.addEventListener("DOMContentLoaded", () =>
    {
        console.log("DOM fully loaded and parsed");
        observeSections();
        initializeWebComponents().catch((error) =>
        {
            console.error("Error during web components initialization:", error);
        });
    });
}

boostrap();