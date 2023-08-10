import ReposReader from "../repos/ReposReader";

export default class Builder {
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
        this.sections = document.querySelectorAll('section');
        this.divs = document.querySelectorAll('div');
        this.navigationBarItems = document.querySelectorAll('.navigation-bar-item');
        this.hamburgerMenuButton = document.querySelector('.hamburger-menu-button');
        this.hamburgerMenuItems = document.querySelector('.hamburger-menu-items');
        this.closeHamburgerMenu = document.querySelector('.close-hamburger-menu');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.projectsNavigation = document.querySelector('.projects-navigation');
        this.reposReader = new ReposReader();
    }
    

}