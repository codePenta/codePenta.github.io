import { Notion } from "../scripts/notion.js";

class Navigation {
  constructor() {
    this.links = document.querySelectorAll('nav a');
    this.prefixes = document.querySelectorAll('nav .prefix');
    this.sections = document.querySelectorAll('section');
    this.age = document.querySelector('#age');
    this.notion = new Notion();

    this.observer = new IntersectionObserver(this.observe.bind(this), { threshold: .4 });
    this.sections.forEach(section => this.observer.observe(section));
  }

  observe(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('lighter')) {
          this.links.forEach(element => {
            element.style.setProperty('color', 'var(--primary)');
          });
          this.prefixes.forEach(element => {
            element.style.setProperty('background', 'var(--primary)');
          });
        } else {
          this.links.forEach(element => {
            element.style.setProperty('color', 'var(--tertiary)');
          });
          this.prefixes.forEach(element => {
            element.style.setProperty('background', 'var(--tertiary)');
          });
        }
      }
    });
  }

  calculateAge(birthDate, otherDate) {
    birthDate = new Date(birthDate);
    otherDate = new Date(otherDate);

    let years = (otherDate.getFullYear() - birthDate.getFullYear());

    if (otherDate.getMonth() < birthDate.getMonth() ||
        otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
      years--;
    }

    return years;
  }

  displayAge() {
    this.age.innerHTML = this.calculateAge('2001-03-29', new Date());
  }
}

const nav = new Navigation();
nav.displayAge();