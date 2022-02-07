let NavBurger = document.querySelector('.nav-burger');
NavBurger.onclick = function () {
    if (NavBurger.classList.contains('nav-burger_active')) {
        NavBurger.classList.remove('nav-burger_active');
    } else {
        NavBurger.classList.add('nav-burger_active');
    }
};
