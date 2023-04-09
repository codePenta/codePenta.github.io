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

                navbarItems.forEach(element => {
                    element.style.setProperty('background-color', 'var(--tertiary)');
                });
            }
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.2 });

sections.forEach((section) => {
    obServer.observe(section);
});

function calculateAge (birthDate, otherDate) {
    birthDate = new Date(birthDate);
    otherDate = new Date(otherDate);

    let years = (otherDate.getFullYear() - birthDate.getFullYear());

    if (otherDate.getMonth() < birthDate.getMonth() || 
        otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
        years--;
    }

    return years;
}

age.innerHTML = calculateAge('2001-03-29', new Date());