import { Project } from '../api/github/entities/Project';
import { Tags } from '../utils/constants';
import { removePrefixFromTag as removePrefix } from '../utils/Helpers';

export class ProjectCard
{
    public createProjectCard(project: Project): HTMLElement
    {
        const cardHeading: HTMLDivElement = this.buildHeader(project);
        const cardContent: HTMLDivElement = this.buildContent(project);
        const cardFooter: HTMLDivElement = this.buildFooter(project);

        const card: HTMLDivElement = this.buildCard(cardHeading, cardContent, cardFooter);
        return card;
    }

    private buildCard(...children: (Node | string)[]): HTMLDivElement
    {
        const card = document.createElement("div");
        card.className = removePrefix(Tags.PROJECT_CARD_CLASSNAME);

        card.append(...children);
        return card;
    }

    private buildHeader(project: Project): HTMLDivElement
    {
        const cardHeading = document.createElement("div");
        cardHeading.className = removePrefix(Tags.PROJECT_CARD_HEADING);

        const h2 = document.createElement("h2");
        h2.textContent = project.name;

        const programmingLanguageContainer = document.createElement("div");
        programmingLanguageContainer.className = "languageContainer";

        const programmingLanguage = document.createElement("img");
        programmingLanguage.src = `${project.languageIconUrl}`;
        programmingLanguage.alt = project.language;

        programmingLanguageContainer.append(programmingLanguage);

        cardHeading.append(h2, programmingLanguageContainer);
        return cardHeading;
    }

    private buildContent(project: Project): HTMLDivElement
    {
        const cardContent = document.createElement("div");
        cardContent.className = removePrefix(Tags.PROJECT_CARD_DETAILS);

        const description = document.createElement("p");
        description.textContent = project.description;
        cardContent.append(description);
        return cardContent;
    }

    private buildFooter(project: Project): HTMLDivElement
    {
        const cardFooter = document.createElement("div");
        cardFooter.className = removePrefix(Tags.PROJECT_CARD_FOOTER);

        const url = document.createElement("a");
        url.href = project.url;
        url.target = "_blank";
        url.rel = "noopener noreferrer";

        const versionControlImg = document.createElement("img");
        versionControlImg.src = `${project.versionControl}`;
        versionControlImg.alt = project.url;
        versionControlImg.width = 40;
        url.append(versionControlImg);

        cardFooter.append(url);
        return cardFooter;
    }
}