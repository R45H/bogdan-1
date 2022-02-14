function handleClick(event) {
    if (event.currentTarget.classList.contains('nav-burger_active')) {
        event.currentTarget.classList.remove('nav-burger_active');
    } else {
        event.currentTarget.classList.add('nav-burger_active');
    }
}

const navBurgers = document.querySelectorAll('.nav-burger');

navBurgers.forEach((item) => {
    item.addEventListener('click', handleClick);
});
