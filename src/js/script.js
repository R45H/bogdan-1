window.addEventListener('load', function () {
    console.log('Страница полностью загружена');
    let NavBurger = document.querySelector('.nav-burger');
    let BurgerIcon = document.querySelector('.nav-burger__icon');

    NavBurger.onclick = function () {
        console.log('Нажата иконка меню');
        if (BurgerIcon.classList.contains('nav-burger__icon_on')) {
            BurgerIcon.classList.remove('nav-burger__icon_on');
        } else {
            BurgerIcon.classList.add('nav-burger__icon_on');
        }
    };
});
