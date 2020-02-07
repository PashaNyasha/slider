class Slider {
    constructor() {
        this.gallery = document.querySelector(`.gallery`);
        this.slidesY = this.gallery.getElementsByClassName(`slide`);
        this.slideCount = 0;
        this.rocks = this.gallery.querySelectorAll(`.rock`);
        this.range = this.gallery.querySelector(`#range`);
        this.calcPages();
        this.nextSlide();
        this.changeXSlides();
        this.timer();
        this.showLeftMenu();
    }

    calcPages() {
        // Считаю сколько вертикальных слайдов
        // По этому кол-ву создаю индикаторы
        this.pages = this.gallery.querySelector('.pages');
        for (let i = 0; i < this.slidesY.length; i++) {
            const li = document.createElement(`li`);
            li.classList.add('not-current');
            this.pages.append(li);
        }
        this.li = this.pages.getElementsByTagName(`li`);
        this.li[0].classList.add('current-page');
    }

    // Вертикальная прокрутка слайдов
    nextSlide() {
        // Указываю на индикаторе справа
        // Какой по счёту вертикальный слайд показан
        const currentPage = n => {
            for (let i = 0; i < this.li.length; i++) {
                this.li[i].classList.remove('current-page');
            }
            this.li[n].classList.add('current-page');
        }


        // Проскроллить страницу к начальной точке следующего блока
        const slide = () => {
            window.scrollBy({
                top: this.slidesY[this.slideCount]
                    .getBoundingClientRect().y,
                behavior: `smooth`
            })
            currentPage(this.slideCount);
        }

        // При спуске на второй слайд камушки всплывут
        const rockUp = () => {
            this.rocks.forEach(elem => {
                if (this.slideCount < 1 ) {
                    elem.classList.remove(`rock-up`)
                    document.querySelector('.one').classList.remove('hide-down');
                } else {
                    elem.classList.add(`rock-up`);
                    document.querySelector('.one').classList.add('hide-down');
                }
            })
        }

        // При свайпе сменить слайд
        const swapSlide = dir => {
            if (dir > 0) {
                this.slideCount += this.slideCount >= this.slidesY.length - 1 ?
                    0 : 1;
                slide();
            } else {
                this.slideCount -= this.slideCount <= 0 ? 0 : 1;
                slide();
            }
            rockUp();
        }

        // При прокрутке колесом мыши
        window.onwheel = e => swapSlide(e.deltaY)

        // При прокрутке касанием
        let event = null;
        let direction = null;
        window.ontouchstart = e => {
            event = e;
            window.ontouchmove = e => {
                direction = e.touches[0].pageY - event.touches[0].pageY;
            }
        }

        window.ontouchend = e => {
            swapSlide(-direction)
            event = null;
        }
    }

    // Горизонтальная прокрутка слайдов
    changeXSlides() {
        this.range.value = this.range.max;
        // Индикатор заполнения полоски
        const fullRange = this.gallery.querySelector(`.full-range`);

        const getFull = () => {
            fullRange.style = `
            width: ${(+this.range.value / this.range.max) * 100}%;
            `;
        };
        getFull();

        const xSlidesBox = this.gallery.querySelector(`.x-slides`);
        let counter = 3;
        // Листаем горизонтальные слайды
        this.range.oninput = () => {
            getFull();
            counter = Math.round(((+this.range.value) / this.range.max) * 2);
            xSlidesBox.style = `
            transform: translateX(-${(100 / 3) * counter}%);
            `;
        }
    }

    timer() {
        // Таймер
        const timer = this.gallery.querySelector(`.timer`);
        const minSpan = timer.querySelector(`.min`);
        const secSpan = timer.querySelector(`.sec`);
        let min = 9;
        let sec = 59;

        const setZero = n => `0${n}`;

        const startTimer = () => {
            sec--;
            if (sec < 0) {
                sec = 59;
                min--;
            } else if (min <= 0 && sec <= 0) clearInterval(timerGo)

            minSpan.textContent = min < 10 ? setZero(min) : min;
            secSpan.textContent = sec < 10 ? setZero(sec) : sec;
        }

        const timerGo = setInterval(startTimer, 1000);
    }

    showLeftMenu() {
        // Кнопка и список
        const button = this.gallery.querySelector(`.button`);
        const ul = this.gallery.querySelector('.menu');

        // При нажатии на кнопку, или ведению мышкой/пальцем
        // по списку, список убираться не будет
        // Иначе через 5 секунд он исчезнет
        let hideMenu;
        const startTimer = () => {
            hideMenu = setTimeout(() => {
                ul.classList.add('hide-menu');
            }, 5000);
        }

        const dontHideMenu = () => clearTimeout(hideMenu);

        let show = false;
        button.onmousedown = () => {
            show = !show;
            show ? ul.classList.remove('hide-menu') :
            ul.classList.add('hide-menu');
        };

        button.onmouseup = startTimer;
        ul.onmousemove = dontHideMenu;
        ul.onmouseout = startTimer;
        ul.ontouchmove = dontHideMenu;
        ul.ontouchend = startTimer;
    }
}

new Slider();