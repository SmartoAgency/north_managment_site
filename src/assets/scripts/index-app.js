import gsap, { ScrollTrigger } from 'gsap/all';
import lenis from './modules/scroll/leniscroll';
import './modules/form';
import Headroom from 'headroom.js';
import Swiper, { FreeMode, Scrollbar } from 'swiper';

gsap.registerPlugin(ScrollTrigger);
gsap.core.globals('ScrollTrigger', ScrollTrigger);


ScrollTrigger.create({
    trigger: '.screen1',
    start: 'top top',
    end: 'bottom top',
    onEnter: () => {
        gsap.set('[data-logo-header]', { opacity: 0 });
        console.log('enter');
        
    },
    onEnterBack: () => {
        gsap.set('[data-logo-header]', { opacity: 0 });
        console.log('enter back');
    },
    onLeave: () => {
        gsap.set('[data-logo-header]', { opacity: 1 });
        console.log('leave');
    }
});

gsap.timeline({
    ease: 'none',
    scrollTrigger: {
        trigger: '.home-about-us',
        start: '0% bottom',
        end: `${window.innerHeight} top`,
        scrub: 0.1,
    }
})
.to('.video-screen video', {
    y: window.innerHeight,
    ease: 'none'
})



const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    if (window.screen.width < 600) return;
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

document.querySelectorAll('[data-up-arrow]').forEach(el => {
    el.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });




const transformationValues = (type) => {
    switch (type) {
        case 'tablet':
            return {
                from: {
                    y: -100,
                }, 
                to: {
                    y: 100,
                }
            }
        case 'mobile':
            return {
                from: {
                    y: -50,
                }, 
                to: {
                    y: 50,
                }
            }
    
        default:
            return {
                from: {}, 
                to: {}
            }
    }
}


function paralaxesScreens(deviceType = 'desktop') {

    document.querySelectorAll('.paralax-screen').forEach(el => {

        gsap.timeline({
            defaults: {
                force3D: true,
                ease: 'none'
            },
            scrollTrigger: {
                trigger: el,
                scrub: true,
            }
            
        })
            .fromTo(el.querySelector('.paralax-screen-wrapper-transform'), {
                y: el.dataset.transform ? +(el.dataset.transform) * -1 : -200,
                ...transformationValues(deviceType).from
            }, {
                y: el.dataset.transform ? +el.dataset.transform : 200,
                ...transformationValues(deviceType).to
            })
            .fromTo(el.querySelector('.paralax-screen-wrapper-scale'), {
                scale: el.dataset.scale ? el.dataset.scale : 1.4
            }, {
                scale: 1
            }, '<');
    })
}
paralaxesScreens();



document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[href="#contacts"]');
    if (target){
        evt.preventDefault();
        const contacts = document.querySelector('#contacts');
        contacts.scrollIntoView({ behavior: 'smooth' });
    }
});   


var myElement = document.querySelector("header");
// construct an instance of Headroom, passing the element
var headroom  = new Headroom(myElement);
// initialise
headroom.init();


function splitToLinesAndFadeUp(selector, gsap) {
    document.querySelectorAll(selector).forEach(text => {
        let mathM = text.innerHTML.match(/<\s*(\w+\b)(?:(?!<\s*\/\s*\1\b)[\s\S])*<\s*\/\s*\1\s*>|\S+/g);
        if (mathM === null) return;
        mathM = mathM.map(el => `<span style="display:inline-flex"><span>${el}</span></span>`);
        text.innerHTML = mathM.join(' ');
        gsap.set(text.children, { overflow: 'hidden' });
        gsap.set(text.querySelectorAll('span>span'), { overflow: 'initial', display: 'inline-block' });
        let tl = gsap
            .timeline({
                // paused: true,
                scrollTrigger: {
                    trigger: text,
                    once: true,
                },
            })
            .fromTo(
                text.querySelectorAll('span>span'),
                { yPercent: 100, },
                { yPercent: 0, stagger: 0.05, duration: 1, ease: 'power4.out' },
            )
            .add(() => {
                text.innerHTML = text.textContent;
            })
            ;

        // text.addEventListener('click',function(evt){
        //   tl.progress(0).play();
        // });
    });
}

splitToLinesAndFadeUp('.g-title, .screen1__text div, .home-about-us__subtitle, .home-about-us__text', gsap);
splitToLinesAndFadeUp('.home-missions__subtitle, .leadership-screen__text', gsap);
splitToLinesAndFadeUp('.home-project__paragraph, .home-project__description, .leadership-screen__list-item-title, .leadership-screen__list-item-text, .home-project__title2', gsap);
splitToLinesAndFadeUp('.home-technology__subtitle, .home-technology__paragraph', gsap);
splitToLinesAndFadeUp('.home-partners__title2, .contact-screen__title2', gsap);


// pause video when is out of view
document.querySelectorAll('video').forEach(video => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    });
    observer.observe(video);
});

Swiper.use([Scrollbar, FreeMode]);

function mobilePartnersSlider() {
    new Swiper('[data-mobile-partners-slider]', {
        slidesPerView: 1.25,
        spaceBetween: 24,
        freeMode: true,
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
        }
    });
}

if (window.screen.width <= 600) {
    mobilePartnersSlider();
}