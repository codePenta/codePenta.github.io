import Main from "../main";

const mockDocument = {
  querySelector: jest.fn(),
}

describe("Main", () => {
  let main: Main;

  beforeEach(() => {
    jest.clearAllMocks();

    document.body.innerHTML = `
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#projects">Projects</a></li>
        </ul>
      </nav>
      <main>
        <div id="home"></div>
        <div id="projects"></div>
      </main>
    `;
    main = new Main();

  });

  describe("getCurrentSection", () => {
    it("should return 'home' when at the top of the page", () => {
      window.scrollY = 0;
      expect(main.getCurrentSection()).toEqual("home");
    });

    it("should return 'projects' when scrolled to the projects section", () => {
      window.scrollY = (mockDocument.querySelector("#projects") as HTMLElement).offsetTop;
      expect(main.getCurrentSection()).toEqual("projects");
    });
  });

  describe("updateNavigation", () => {
    it("should add 'active' class to Home link when at the top of the page", () => {
      window.scrollY = 0;
      main.updateNavigation("home");
      const homeLink = mockDocument.querySelector("nav ul a[href='#home']");
      expect(homeLink?.classList.contains("active")).toBe(true);
    });

    it("should add 'active' class to Projects link when scrolled to the projects section", () => {
      window.scrollY = (mockDocument.querySelector("#projects") as HTMLElement).offsetTop;
      main.updateNavigation("projects");
      const projectsLink = mockDocument.querySelector("nav ul a[href='#projects']");
      expect(projectsLink?.classList.contains("active")).toBe(true);
    });
  });

  describe("updateProjectsList", () => {
    it("should add a list of projects to the navigation bar", () => {
      main.updateProjectsList();
      const projectsList = mockDocument.querySelector("#projects-list");
      expect(projectsList).not.toBeNull();
      expect(projectsList?.children.length).toEqual(2);
      expect(projectsList?.children[0].textContent).toEqual("codepenta.github.io");
      expect(projectsList?.children[1].textContent).toEqual("other-project");
    });
  });
});