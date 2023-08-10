import Repo from "./repos/Repo";
import ReposReader from "./repos/ReposReader";

class Main {
  sections: NodeListOf<HTMLElement>;
  divs: NodeListOf<HTMLDivElement>;
  navigationBarItems: NodeListOf<HTMLAnchorElement>;
  hamburgerMenuButton: HTMLElement | null;
  hamburgerMenuItems: HTMLElement | null;
  closeHamburgerMenu: HTMLElement | null;
  mobileMenu: HTMLElement | null;
  reposReader: ReposReader;

  constructor() {
    this.sections = document.querySelectorAll("section");
    this.divs = document.querySelectorAll("main > div");
    this.navigationBarItems = document.querySelectorAll("nav ul a");
    this.hamburgerMenuButton = document.querySelector(".hamburger");
    this.mobileMenu = document.querySelector(".mobile-menu");
    this.hamburgerMenuItems = document.querySelector(
      ".mobile-menu .menu-items"
    );

    this.closeHamburgerMenu = document.querySelector(
      ".mobile-menu .menu-items .close-hamburger-wrapper"
    );

    this.initializePage();

    this.reposReader = new ReposReader();
    let data = this.reposReader.getData();
    this.reposReader.parseData(data);
  }

  private initializePage() {
    window.addEventListener("scroll", () => {
      const current = this.getCurrentSection();
      this.updateNavigation(current);
    });

    this.observeSections();
    this.calculateAge();

    if (this.hamburgerMenuButton) {
      this.hamburgerMenuButton.addEventListener("click", () => {
          this.mobileMenu.classList.add("open");
      });
    }

    if (this.closeHamburgerMenu) {
      console.log(this.closeHamburgerMenu);
      this.closeHamburgerMenu.addEventListener("click", () => {
          this.mobileMenu.classList.remove("open");
      });
    }
  }

  private getCurrentSection(): string {
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

  private updateNavigation(current: string) {
    this.navigationBarItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href")?.includes(current)) {
        link.classList.add("active");
      }
    });
  }

  private observeSections() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains("lighter")) {
              this.setNavigationBarColor("var(--primary)", "var(--primary)");
            } else {
              this.setNavigationBarColor("var(--tertiary)", "var(--tertiary)");
            }

            if (entry.target.classList.contains("projects-container")) {
              const projectsList = document.createElement("ul");
              projectsList.id = "projects-list";

              this.reposReader.getResults().forEach((repo) => {
                const project = document.createElement("li");
                project.classList.add(repo.name);
                project.innerText = repo.name;
                project.style.setProperty('color', 'var(--primary)')
                projectsList.appendChild(project);
              });

              this.navigationBarItems.item(1).insertAdjacentElement("afterend", projectsList);
            } else {
              const projectsList = document.querySelector("#projects-list");
              if (projectsList) {
                projectsList.remove();
              }
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    this.sections.forEach((section) => {
      observer.observe(section);
    });
  }

  private setNavigationBarColor(textColor: string, backgroundColor: string) {
    this.navigationBarItems.forEach((element) => {
      element.style.setProperty("color", textColor);
      if (element.children[0] instanceof HTMLElement) {
        element.children[0].style.setProperty("background", backgroundColor);
      }
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
}

const main = new Main();
