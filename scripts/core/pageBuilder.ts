import ReposReader from "../repos/ReposReader";

export default class Builder {
    public containers: NodeListOf<HTMLElement>;
    containerWrappers: NodeListOf<HTMLDivElement>;
    navigationBarItems: NodeListOf<HTMLAnchorElement>;
    hamburgerMenuButton: HTMLElement | null;
    hamburgerMenuItems: HTMLElement | null;
    closeHamburgerMenu: HTMLElement | null;
    mobileMenu: HTMLElement | null;
    projectsNavigation: HTMLElement | null;
    reposReader: ReposReader;

    constructor() {
        this.containerWrappers = document.querySelectorAll('main > div');
        this.containers = document.querySelectorAll('section');

        this.navigationBarItems = document.querySelectorAll('nav ul a');

        this.hamburgerMenuButton = document.querySelector('.hamburger');
        this.hamburgerMenuItems = document.querySelector('.mobile-menu .menu-items');
        this.closeHamburgerMenu = document.querySelector('.close-hamburger-wrapper');
        this.mobileMenu = document.querySelector('.mobile-menu');

        this.projectsNavigation = document.querySelector('#projects-navigation');
        this.reposReader = new ReposReader();
    }

    build() {
        this.setupEvents();
        this.calculateAge();
        this.buildProjectsNavigation();
        this.buildSections();
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

        const projectsList = document.createElement("ul");
        projectsList.id = "projects-list";

        this.reposReader.getResults().forEach((repo, index) => {
            const project = document.createElement("a");
            project.href = `#${repo.name.toLowerCase()}`;
            project.classList.add(repo.name.toLowerCase());

            const projectName = document.createElement("li");
            projectName.innerHTML = repo.name;
            projectName.style.setProperty("color", "var(--primary)");

            project.appendChild(projectName);
            // Set initial position of project element
            project.style.transform = "translateX(-100%)";

            // Append project element to projectsList
            projectsList.appendChild(project);

            // Animate project element
            project.animate(
                [
                    { transform: "translateX(-100%)" },
                    { transform: "translateX(0)" },
                ],
                {
                    duration: 1000,
                    easing: "cubic-bezier(0.52, 0.17, 0, 0.99)",
                    fill: "forwards",
                    delay: index * 20,
                }
            );
        });

        this.navigationBarItems[1].insertAdjacentElement(
            "afterend",
            projectsList
        );
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