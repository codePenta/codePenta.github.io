import Repo from "./repos/Repo";
import ReposReader from "./repos/ReposReader";

export default class Main {
  sections: NodeListOf<HTMLElement>;
  divs: NodeListOf<HTMLDivElement>;
  navigationBarItems: NodeListOf<HTMLAnchorElement>;
  hamburgerMenuButton: HTMLElement | null;
  hamburgerMenuItems: HTMLElement | null;
  closeHamburgerMenu: HTMLElement | null;
  mobileMenu: HTMLElement | null;
  projectsNavigation: HTMLElement | null;
  reposReader: ReposReader;

  constructor() {
    this.initializePage();
    this.reposReader = new ReposReader();
    this.setupEventListeners();
  }

  private initializePage() {
    this.sections = document.querySelectorAll("section");
    this.divs = document.querySelectorAll("main > div");
    this.navigationBarItems = document.querySelectorAll("nav ul a");
    this.hamburgerMenuButton = document.querySelector(".hamburger");
    this.mobileMenu = document.querySelector(".mobile-menu");
    this.hamburgerMenuItems = document.querySelector(".mobile-menu .menu-items");
    this.closeHamburgerMenu = document.querySelector(".close-hamburger-wrapper");
    this.projectsNavigation = document.querySelector('#projects-navigation');

    this.observeSections();
    this.calculateAge();
  }

  private setupEventListeners() {
    window.addEventListener("scroll", () => {
      const current = this.getCurrentSection();
      this.updateNavigation(current);
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
          this.updateProjectsList();
        }, 200);
      }
    });
  }

  getCurrentSection(): string {
    let current: string = "";
    this.divs.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id") || "";
      }
    });
    return current;
  }

  updateNavigation(current: string) {
    this.navigationBarItems.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href && href.includes(current));
    });
  }

  observeSections() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const isLighter = entry.target.classList.contains("lighter");
            this.setNavigationBarColor(isLighter ? "var(--primary)" : "var(--tertiary)", isLighter ? "var(--primary)" : "var(--tertiary)");

            if (entry.target.classList.contains("projects-container")) {
              this.updateProjectsList();
            } else {
              const projectsList = document.querySelector("#projects-list");
              projectsList?.remove();
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    this.divs.forEach((div) => {
      observer.observe(div);
    });
  }

  updateProjectsList() {
    const projectsList = document.createElement("ul");
    projectsList.id = "projects-list";

    this.reposReader.getResults().forEach((repo, index) => {
      const project = document.createElement("a");
      project.href = `#${repo.name.toLowerCase()}`;
      project.classList.add(repo.name.toLowerCase());
      project.innerText = repo.name;
      project.style.setProperty('color', 'var(--primary)')

      project.animate(
        [
          { transform: "translateX(-100%)" },
          { transform: "translateX(0)" },
        ],
        {
          duration: 500,
          easing: "cubic-bezier(0.52, 0.17, 0, 0.99)",
          fill: "forwards",
          delay: index * 20
        }
      );

      projectsList.appendChild(project);
    });

    this.navigationBarItems[1].insertAdjacentElement("afterend", projectsList);
  }

  setNavigationBarColor(textColor: string, backgroundColor: string) {
    this.navigationBarItems.forEach((element) => {
      element.style.setProperty("color", textColor);
      const firstChild = element.children[0] as HTMLElement | undefined;
      firstChild?.style.setProperty("background", backgroundColor);
    });
  }

  calculateAge() {
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
}

const main = new Main();
