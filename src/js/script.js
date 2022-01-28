window.addEventListener('load', function () {
    console.log('Страница полностью загружена')
    let NavBurger = document.querySelector('.nav-burger');
    NavBurger.onclick = function () {
        if (NavBurger.classList.contains('nav-burger_on')) {
            NavBurger.classList.remove('nav-burger_on')
        } else {
            NavBurger.classList.add('nav-burger_on')
        }
    }
});
