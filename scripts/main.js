let navbarLinks = document.querySelectorAll('nav > ul > .line > li > a');
let navbarItems = document.querySelectorAll('nav > ul > .line');
console.log(navbarLinks);
const sections = document.querySelectorAll('section');
let age = document.querySelector('#age');

const obServer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('lighter')) {
                navbarLinks.forEach(element => {
                    element.style.setProperty('color', 'var(--primary)');
                });

                navbarItems.forEach(element => {
                    element.style.setProperty('background-color', 'var(--primary)');
                });
            } else {
                navbarLinks.forEach(element => {
                    element.style.setProperty('color', 'var(--tertiary)');
                });

window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - sectionHeight / 3) {
            currentSection = section.getAttribute('id');
        }
    });

    setActiveClass(currentSection);
});

function setActiveClass(currentSection) {
    sections.forEach((section) => {
        if (section.getAttribute('id') !== currentSection) {
            section.classList.remove('active');
        } else {
            section.classList.add('active');
            navbar.style.color = (section.classList.contains('light-background')) ? 'var(--tertiary-2)' : 'var(--tertiary)';
        }
    });
}

age.innerHTML = calculateAge('2001-03-29', new Date());