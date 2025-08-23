import { Project } from '../api/github/entities/ProjectEntity';
import { formatWithoutPrefix, Tags } from '../constants';

export function createProjectCard(project: Project): HTMLElement
{
    const card = document.createElement("div");
    card.className = formatWithoutPrefix(Tags.PROJECT_CARD_CLASSNAME);

    const cardHeading = document.createElement("div");
    cardHeading.className = "project-card-heading";

    const h2 = document.createElement("h2");
    h2.textContent = project.name;

    cardHeading.append(h2);

    const cardContent = document.createElement("div");
    cardContent.className = "project-card-details";

    const language = document.createElement("img");
    language.src = `${project.languageIconUrl}`;
    language.alt = project.language;
    language.width = 40;
    language.height = 40;

    const description = document.createElement("p");
    description.textContent = project.description;
    cardContent.append(language, description);

    const url = document.createElement("a");
    url.textContent = `View on GitHub`;
    url.href = project.url;
    url.target = "_blank";
    url.rel = "noopener noreferrer";

    const cardFooter = document.createElement("div");
    cardFooter.className = "project-card-footer";

    const imgDiv = document.createElement("div");
    imgDiv.className = "author-img-container";

    const authorImg = document.createElement("img");
    authorImg.src = project.imageUrl;
    authorImg.alt = "Author image"
    imgDiv.appendChild(authorImg);

    cardFooter.append(url, imgDiv);

    card.append(cardHeading, cardContent, cardFooter);
    return card;
}