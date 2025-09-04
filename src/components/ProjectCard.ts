import { Project } from '../api/github/entities/Project';
import { Tags } from '../utils/constants';
import { removePrefixFromTag } from '../utils/Helpers';

export function createProjectCard(project: Project): HTMLElement
{
    const card = document.createElement("div");
    card.className = removePrefixFromTag(Tags.PROJECT_CARD_CLASSNAME);

    const cardHeading = document.createElement("div");
    cardHeading.className = removePrefixFromTag(Tags.PROJECT_CARD_HEADING);

    const h2 = document.createElement("h2");
    h2.textContent = project.name;

    cardHeading.append(h2);

    const cardContent = document.createElement("div");
    cardContent.className = removePrefixFromTag(Tags.PROJECT_CARD_DETAILS);

    const programmingLanguage = document.createElement("img");
    programmingLanguage.src = `${project.languageIconUrl}`;
    programmingLanguage.alt = project.language;
    programmingLanguage.width = 40;

    const description = document.createElement("p");
    description.textContent = project.description;
    cardContent.append(programmingLanguage, description);

    const url = document.createElement("a");
    url.href = project.url;
    url.target = "_blank";
    url.rel = "noopener noreferrer";

    const versionControlImg = document.createElement("img");
    versionControlImg.src = `${project.versionControl}`;
    versionControlImg.alt = project.url;
    versionControlImg.width = 40;
    url.append(versionControlImg);

    const cardFooter = document.createElement("div");
    cardFooter.className = removePrefixFromTag(Tags.PROJECT_CARD_FOOTER);

    cardFooter.append(url);

    card.append(cardHeading, cardContent, cardFooter);
    return card;
}