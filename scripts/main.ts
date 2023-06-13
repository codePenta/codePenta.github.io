import dotenv from 'dotenv';
dotenv.config();

class Navigation {
  sections: NodeListOf<HTMLElement>;
  divs: NodeListOf<HTMLDivElement>;
  navigationBarItems: NodeListOf<HTMLAnchorElement>;
  hamburgerMenu: HTMLElement | null;
  hamburgerMenuItems: HTMLElement | null;
  closeHamburgerMenu: HTMLElement | null;

  constructor() {
    this.sections = document.querySelectorAll("section");
    this.divs = document.querySelectorAll("main > div");
    this.navigationBarItems = document.querySelectorAll("nav ul a");
    this.hamburgerMenu = document.querySelector(".mobile-menu .hamburger");
    this.hamburgerMenuItems = document.querySelector(
      ".mobile-menu .menu-items"
    );
    this.closeHamburgerMenu = document.querySelector(
      ".mobile-menu .menu-items .close-hamburger"
    );

    this.initialize();
  }

  private initialize() {
    window.addEventListener("scroll", () => {
      const current = this.getCurrentSection();
      this.updateNavigation(current);
    });

    this.observeSections();
    this.calculateAge();

    if (this.hamburgerMenu) {
      this.hamburgerMenu.addEventListener("click", () => {
        if (this.hamburgerMenuItems) {
          this.hamburgerMenuItems.classList.add("open");
        }
      });
    }

    if (this.closeHamburgerMenu) {
      this.closeHamburgerMenu.addEventListener("click", () => {
        if (this.hamburgerMenuItems) {
          this.hamburgerMenuItems.classList.remove("open");
        }
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

  private getProjects() {
    const url = "https://api.github.com/users/cdpenta/repos";
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
}

const navigation = new Navigation();