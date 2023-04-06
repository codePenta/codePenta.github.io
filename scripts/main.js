let nav = document.querySelector('nav > ul > li').querySelectorAll('a');
const navbar = document.querySelector('nav > ul > li > a');
const sections = document.querySelectorAll('div');

nav.forEach((item) => {
    item.addEventListener('hover', (e) => {
        item.style.color = "red";
        e.preventDefault();
        let target = e.target.getAttribute('href');
        let targetElement = document.querySelector(target);
        targetElement.scrollIntoView({ behavior: "smooth" });
    });
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
