const navBurgers = document.querySelectorAll('.nav-burger');

navBurgers.forEach((item, i) => {
    handleClick(navBurgers[i]);
});

function handleClick(navBurger) {
    navBurger.addEventListener('click', function () {
        if (navBurger.classList.contains('nav-burger_active')) {
            navBurger.classList.remove('nav-burger_active');
        } else {
            navBurger.classList.add('nav-burger_active');
        }
    });
}
