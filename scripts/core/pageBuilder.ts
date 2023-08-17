import Reader from "../api/ReposReader";
import ProjectBuilder from "../core/projectBuilder";

export default class Builder {
    containers: NodeListOf<HTMLElement>;
    containerWrappers: NodeListOf<HTMLDivElement>;
    navigationBarItems: NodeListOf<HTMLAnchorElement>;
    hamburgerMenuButton: HTMLElement | null;
    hamburgerMenuItems: HTMLElement | null;
    closeHamburgerMenu: HTMLElement | null;
    mobileMenu: HTMLElement | null;
    projectsNavigation: HTMLElement | null;
    projectsSection: HTMLElement | null;

    reposReader: Reader;
    projectBuilder: ProjectBuilder;

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
        this.projectBuilder.createSummaryContents();
    }

    build() {
        this.setupEvents();
        this.calculateAge();
        this.buildProjectsNavigation();
        this.buildSections();
        this.buildProjectSummary();
    }

    buildProjectSummary() {
        // this.reposReader.getResults().filter(repo => repo.languageUsed === 'C++').forEach(repo => {
        //     const project = document.createElement('div');
        //     project.classList.add('project');
        //     project.id = repo.name.toLowerCase();

        //     const projectTitle = document.createElement('h3');
        //     projectTitle.innerHTML = repo.name;

        //     const projectDescription = document.createElement('p');
        //     projectDescription.innerHTML = repo.description;

        //     const projectLanguage = document.createElement('p');
        //     projectLanguage.innerHTML = repo.languageUsed;

        //     const projectLink = document.createElement('a');
        //     projectLink.href = repo.url;
        //     projectLink.innerHTML = 'View on GitHub';

        //     project.appendChild(projectTitle);
        //     project.appendChild(projectDescription);
        //     project.appendChild(projectLanguage);
        //     project.appendChild(projectLink);

        //     console.log(project);

        //     this.projectsSection.appendChild(project);
        // });
    }

    private updateNavbar(current: string) {
        this.navigationBarItems.forEach((link: HTMLAnchorElement) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href && href.includes(current) ? true : false);
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

        // Can you give me the code for mobile devices? So if someone clicks on #projects-wrapper, the menu will change to all the projects

        if (window.innerWidth < 768) {
            this.mobileMenu.querySelector('a[href="#projects-wrapper"]').addEventListener('click', () => {

            });
        }
        setTimeout(() => {
            const projectsList = document.createElement("ul");
            projectsList.id = "projects-list";

            this.reposReader.getResults().finally(() => {
                this.reposReader.results.forEach((repo, index) => {
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