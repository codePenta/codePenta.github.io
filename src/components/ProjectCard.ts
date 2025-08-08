import { Project } from '../api/github/entities/ProjectEntity';

export function createProjectCard(project: Project): HTMLElement
{
    const card = document.createElement("div");
    card.className = "project-card";

    const h2 = document.createElement("h2");
    h2.textContent = project.name;

    const language = document.createElement("p");
    language.textContent = `Language: ${project.language}`;

    const description = document.createElement("p");
    description.textContent = project.description;

    const url = document.createElement("a");
    url.textContent = `View on GitHub`;
    url.href = project.url;
    url.target = "_blank";
    url.rel = "noopener noreferrer";

    const imgDiv = document.createElement("div");
    imgDiv.className = "author-img-container";

    const authorImg = document.createElement("img");
    authorImg.src = project.imageUrl;
    authorImg.alt = "Author image"

    imgDiv.appendChild(authorImg);

    card.append(h2, language, description, url, imgDiv);
    return card;
}