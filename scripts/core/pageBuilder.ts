import Reader from "../api/ReposReader";
import ProjectBuilder from "../core/projectBuilder";

export default class Builder {
    private containers: NodeListOf<HTMLElement>;
    private containerWrappers: NodeListOf<HTMLDivElement>;
    private navigationBarItems: NodeListOf<HTMLAnchorElement>;
    private readonly hamburgerMenuButton: HTMLElement | null;
    private hamburgerMenuItems: HTMLElement | null;
    private readonly closeHamburgerMenu: HTMLElement | null;
    private mobileMenu: HTMLElement | null;
    private projectsNavigation: HTMLElement | null;
    private projectsSection: HTMLElement | null;

    private readonly reposReader: Reader;
    private projectBuilder: ProjectBuilder;

    constructor() {
        this.containerWrappers = document.querySelectorAll('main > div');
        this.containers = document.querySelectorAll('section');

        this.navigationBarItems = document.querySelectorAll('nav ul a');

        this.hamburgerMenuButton = document.querySelector('.hamburger');
        this.hamburgerMenuItems = document.querySelector('.mobile-menu .menu-items');
        this.closeHamburgerMenu = document.querySelector('.close-hamburger-wrapper');
        this.mobileMenu = document.querySelector('.mobile-menu');

        this.projectsNavigation = document.querySelector('#projects-navigation');
        this.projectsSection = document.querySelector('.projects-container');

        this.reposReader = new Reader();
        this.projectBuilder = new ProjectBuilder(this.reposReader);
    }

    build() {
        this.setupEvents();
        this.calculateAge();
        this.buildSections();
        this.buildProjectSummary();
    }

    buildProjectSummary() {
        this.projectBuilder.getLanguages().then((data) => {
            const summary = document.createElement('div');
            summary.id = 'projects-summary';
            const languages = Object.keys(data);
            const shares = Object.values(data);

            languages.forEach((language: string, index: number) => {
                const languageElement = document.createElement('a');
                languageElement.classList.add('language');

                const languageName = document.createElement('span');
                languageName.classList.add('language-name');
                languageName.textContent = language;

                const languageShare = document.createElement('span');
                languageShare.classList.add('language-share');
                languageShare.textContent = `${shares[index]}`;

                languageElement.appendChild(languageName);
                languageElement.appendChild(languageShare);

                summary.appendChild(languageElement);
            });

            this.projectsSection.appendChild(summary);
        });
    }

    private updateNavbar(current: string) {
        this.navigationBarItems.forEach((link: HTMLAnchorElement) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href && href.includes(current));
        });
    }

    setupEvents() {
        window.addEventListener("scroll", () => {
            const current = this.getCurrentSection();
            this.updateNavbar(current);
        });

        if (this.hamburgerMenuButton) {
            this.hamburgerMenuButton.addEventListener("click", () => {
                this.mobileMenu?.classList.add("open");
            });
        }

        if (this.closeHamburgerMenu) {
            this.closeHamburgerMenu.addEventListener("click", () => {
                this.mobileMenu?.classList.remove("open");
            });
        }

        this.projectsNavigation?.addEventListener("click", () => {
            if (!document.querySelector('#projects-list')) {
                setTimeout(() => {
                    this.buildProjectsNavigation();
                }, 200);
            }
        });
    }

    private buildSections() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const isLighter = entry.target.classList.contains("lighter");
                        this.updateNavbarColor(isLighter ? "var(--primary)" : "var(--tertiary)", isLighter ? "var(--primary)" : "var(--tertiary)");

                        if (entry.target.classList.contains("projects-container")) {
                            this.buildProjectsNavigation();
                        } else {
                            const projectsList = document.querySelector("#projects-list");
                            projectsList?.remove();
                        }
                    }
                });
            },
            { threshold: 0.8 }
        );

        this.containerWrappers.forEach((div) => {
            observer.observe(div);
        });
    }

    private updateNavbarColor(textColor: string, backgroundColor: string) {
        this.navigationBarItems.forEach((element) => {
            element.style.setProperty("color", textColor);
            const firstChild = element.children[0] as HTMLElement | undefined;
            firstChild?.style.setProperty("background", backgroundColor);
        });
    }

    private calculateAge() {
        const today = new Date();
        const birthDate = new Date("2001-03-29");
        const ageContainer = document.querySelector("#age");

        let age: number = today.getFullYear() - birthDate.getFullYear();
        let m: number = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (ageContainer) {
            ageContainer.innerHTML = age.toString();
        }
    }

    private buildProjectsNavigation() {

        if (window.innerWidth < 768) {
            this.mobileMenu.querySelector('a[href="#projects-wrapper"]').addEventListener('click', () => {
            });
        }

        setTimeout(() => {
            const projectsList = document.createElement("ul");
            projectsList.id = "projects-list";

            this.reposReader.getData().then((repo) => {
                repo.forEach((repo: any, index: number) => {

                    const project = document.createElement("a");
                    project.href = `#${repo.name.toLowerCase()}`;

                    const projectName = document.createElement("li");
                    projectName.textContent = repo.name;

                    project.appendChild(projectName);
                    // Set initial position of project element

                    // Append project element to projectsList
                    projectsList.appendChild(project);

                    setTimeout(() => {
                        project.classList.toggle("animate");
                    }, index * 20);
                });
            });

            this.navigationBarItems[1].insertAdjacentElement(
                "afterend",
                projectsList
            );
        }, 200);
    }

    private getCurrentSection(): string {
        let current: string = "";
        this.containerWrappers.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute("id") || "";
            }
        });
        return current;
    }
}