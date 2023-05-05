let sections = document.querySelectorAll('section');
let navigationBar = document.querySelector('nav');

let divs = document.querySelectorAll('main > div');
let navigationBarItems = document.querySelectorAll('nav ul a');

let hamburgerMenu = document.querySelector('.mobile-menu .hamburger');
let hamburgerMenuItems = document.querySelector('.mobile-menu .menu-items');
let closeHamburgerMenu = document.querySelector('.mobile-menu .menu-items .close-hamburger');

window.addEventListener('scroll', () => {
  let current = '';
  divs.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute('id');
    }
  });

  navigationBarItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

let observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('lighter')) {
        navigationBarItems.forEach(element => {
          element.style.setProperty('color', 'var(--primary');
          element.children[0].style.setProperty('background', 'var(--primary)');
        });
      } else {
        navigationBarItems.forEach(element => {
          element.style.setProperty('color', 'var(--tertiary)');
          element.children[0].style.setProperty('background', 'var(--tertiary)');
        });
      }
    }
  });
}, { threshold: 0.7 });

sections.forEach((section) => {
  observer.observe(section);
});

let today = new Date();
let birthDate = new Date('2001-03-29');

(function () {
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  document.querySelector('#age').innerHTML = age;
})();

hamburgerMenu.addEventListener('click', () => {
  hamburgerMenuItems.classList.add('open');
});

closeHamburgerMenu.addEventListener('click', () => {
  hamburgerMenuItems.classList.remove('open');
});

