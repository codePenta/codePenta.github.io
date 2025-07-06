import { RepoEntity } from "../../../api/entities/RepoEntity";

type Project = {
    name: string;
    language: string;
    description: string;
    html_url: string;
}

function toClassName(className: string)
{
    return className.toLowerCase().replace(/\s+/g, " - ");
}

export function createProjectCard(project: Project): HTMLElement
{
    const card = document.createElement("div");
    card.className = "project-card";

    const img = document.createElement("img");
    img.alt = project.name

    const h2 = document.createElement("h2");
    h2.textContent = project.name;

    const language = document.createElement("p");
    language.textContent = project.language;

    const url = document.createElement("a");
    url.textContent = `Click here`;
    url.href = project.html_url;

    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.textContent = project.description;

    card.append(h2, language, img, url, descriptionParagraph);
    console.log(card);
    return card;
}

export async function loadProjects(projects: Promise<any>)
{
    const projectContainer = document.getElementById("projects");
    if (!projectContainer)
        return;
    projectContainer.innerHTML = "";
    for (const project of await projects)
    {
        console.log(project);

        projectContainer.appendChild(createProjectCard(project));
    }
}
