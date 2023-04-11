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
    let current = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (offsetTop >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    nav.forEach((item) => {
        item.classList.remove('active');
        if (item.classList.contains(current)) {
            item.classList.add('active');
        }
    });
});
