let navBurger = document.querySelectorAll('.nav-burger');

for (let i = 0; i < navBurger.length; i++) {
    navBurger[i].onclick = function () {
        if (navBurger[i].classList.contains('nav-burger_active')) {
            navBurger[i].classList.remove('nav-burger_active');
        } else {
            navBurger[i].classList.add('nav-burger_active');
        }
    };
}
