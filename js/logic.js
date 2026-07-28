document.addEventListener("DOMContentLoaded", () => {

    // --- 1. INYECCIÓN CSS PARA ANIMACIÓN EN PANTALLAS < 1300PX ---
    const style = document.createElement("style");
    style.textContent = `
        @media (max-width: 1299px) {
            .project-newversion.is-animated .bg-video-trigger-visual,
            .project-newversion.is-animated .bg-video-trigger-visual-img {
                opacity: 1;
                transform: translateY(0) rotateX(0deg);
                transition: backdrop-filter 1s, transform 0.5s cubic-bezier(0.25, 0, 0.25, 1), backdrop-filter 0.85s;
            }
        }
    `;
    document.head.appendChild(style);

    // --- 2. LENIS (Smooth Scroll) ---
    const lenis = new Lenis({
        autoRaf: true,
    });

    // --- 3. SVG ANIMATIONS & INTERSECTION OBSERVER ---
    const videosConfig = [
        { containerId: "impact-video", frameClass: "impact-frame", frameDuration: 100 },
        { containerId: "signal-video", frameClass: "impact-frame", frameDuration: 120 },
        { containerId: "original-video", frameClass: "impact-frame", frameDuration: 120 },
        { containerId: "featured-video", frameClass: "impact-frame", frameDuration: 120 },

        { containerId: "nebula-preview", frameClass: "impact-frame", frameDuration: 1200, triggerOnHover: true, parentClass: ".project-newversion" },
        { containerId: "sound-preview", frameClass: "impact-frame", frameDuration: 1200, triggerOnHover: true, parentClass: ".project-newversion" },
        { containerId: "regenlab-preview", frameClass: "impact-frame", frameDuration: 1200, triggerOnHover: true, parentClass: ".project-newversion" },
        { containerId: "portimmo-preview", frameClass: "impact-frame", frameDuration: 1200, triggerOnHover: true, parentClass: ".project-newversion" },
        { containerId: "reunio-preview", frameClass: "impact-frame", frameDuration: 1200, triggerOnHover: true, parentClass: ".project-newversion" },
        { containerId: "beyondbusiness-preview", frameClass: "impact-frame", frameDuration: 1200, triggerOnHover: true, parentClass: ".project-newversion" },
        { containerId: "konfigurator-preview", frameClass: "impact-frame", frameDuration: 1200, triggerOnHover: true, parentClass: ".project-newversion" },
        { containerId: "foodiebuddy-preview", frameClass: "impact-frame", frameDuration: 1200, triggerOnHover: true, parentClass: ".project-newversion" },
            { containerId: "horoscopeapp-preview", frameClass: "impact-frame", frameDuration: 1200, triggerOnHover: true, parentClass: ".project-newversion" }

    ];

    function isVisible(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    function animateFrames(container, frames, frameDuration) {
        let index = 0;
        setInterval(() => {
            if (!isVisible(container)) return;
            frames.forEach((f, i) => (f.style.display = i === index ? "block" : "none"));
            index = (index + 1) % frames.length;
        }, frameDuration);
    }

    function setupHoverAnimation(container, frames, frameDuration, parentClass) {
        let intervalId = null;

        const showFrame = (index) => {
            frames.forEach((f, i) => (f.style.display = i === index ? "block" : "none"));
        };

        const hoverElement = parentClass ? container.closest(parentClass) : container;
        
        if (!hoverElement) {
            console.warn(`No se encontró el elemento objetivo para hover en ${container.id}`);
            return;
        }

        const startSequence = () => {
            if (intervalId) return;
            let index = 0;
            showFrame(index);
            intervalId = setInterval(() => {
                index = (index + 1) % frames.length;
                showFrame(index);
            }, frameDuration);
        };

        const stopSequence = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            showFrame(0);
        };

        // Eventos hover para escritorio (>= 1300px)
        hoverElement.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 1300) startSequence();
        });

        hoverElement.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 1300) stopSequence();
        });

        // Exponer métodos para el IntersectionObserver en móviles/pantallas pequeñas
        hoverElement._startSequence = startSequence;
        hoverElement._stopSequence = stopSequence;
    }

    videosConfig.forEach((config) => {
        const container = document.getElementById(config.containerId);
        if (!container) return;

        const frames = container.querySelectorAll(`.${config.frameClass}`);
        if (!frames.length) return;

        if (config.triggerOnHover) {
            setupHoverAnimation(container, frames, config.frameDuration, config.parentClass);
        } else {
            animateFrames(container, frames, config.frameDuration);
        }
    });

    // --- 4. INTERSECTION OBSERVER (Gatillo al 25% de visibilidad en < 1300px) ---
    const observer = new IntersectionObserver((entries) => {
        const isSmallScreen = window.innerWidth < 1300;

        entries.forEach((entry) => {
            const el = entry.target;

            if (isSmallScreen) {
                if (entry.isIntersecting) {
                    // Activa la clase inyectada para el transform CSS
                    el.classList.add("is-animated");
                    // Dispara la secuencia de marcos/imágenes
                    if (typeof el._startSequence === "function") el._startSequence();
                } else {
                    // Resetea animación si sale del 25% de visibilidad
                    el.classList.remove("is-animated");
                    if (typeof el._stopSequence === "function") el._stopSequence();
                }
            } else {
                // En pantallas grandes se remueve la clase y se confía exclusivamente en el CSS :hover
                el.classList.remove("is-animated");
            }
        });
    }, { threshold: 0.25 });

    document.querySelectorAll(".project-newversion").forEach((el) => observer.observe(el));

    // --- 5. SPLASH SCREEN / LOADING ---
    const span = document.getElementById("loading-artielstudio");
    const splash = document.getElementById("splash-artielstudio");
    if (span && splash) {
        document.body.classList.add("splash-active");
        const pauses = [0, 6, 91, 100];
        let percent = 0;
        let paused = false;

        const interval = setInterval(() => {
            if (paused) return;
            span.textContent = percent + "%";
            if (pauses.includes(percent)) {
                paused = true;
                setTimeout(() => {
                    paused = false;
                    if (percent === 100) {
                        setTimeout(() => {
                            splash.style.opacity = "0";
                            splash.style.visibility = "hidden";
                            setTimeout(() => {
                                document.body.classList.remove("splash-active");
                                splash.remove();
                            }, 300);
                        }, 500);
                    }
                }, 600);
            }
            if (percent < 100) percent++;
            else clearInterval(interval);
        }, 10);
    }

    // --- 6. GSAP: ANIMACIÓN FAN CARDS ---
    if (window.matchMedia("(max-width: 500px)").matches) {
        document.querySelectorAll(".container-fan-work").forEach(card => {
            card.classList.remove(
                "work-first",
                "work-second",
                "work-third",
                "work-four"
            );
        });
    }

    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray(".container-fan-work");
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".container-fan",
            start: "top 100%",
            end: "bottom 80%",
            scrub: 0.5,
        }
    });

    cards.forEach((card, index) => {
        if (index === 0) return;
        let startRot = 0, startX = 0, startY = 0, varName = "", startColor = "";

        if (index === 1) {
            startRot = -3; startX = -10; startY = -20;
            varName = "--bg-color-top-second"; startColor = "#e6e6e6";
        }
        if (index === 2) {
            startRot = -4; startX = -20; startY = -160;
            varName = "--bg-color-top-third"; startColor = "rgb(207, 207, 207)";
        }
        if (index === 3) {
            startRot = -5; startX = -30; startY = -300;
            varName = "--bg-color-top-four"; startColor = "rgb(188, 188, 188)";
        }

        const fromProps = { rotate: startRot, x: startX, y: startY };
        fromProps[varName] = startColor;

        const toProps = { rotate: 0, x: 0, y: 0, ease: "power1.inOut" };
        toProps[varName] = "#F3F3F3";

        tl.fromTo(card, fromProps, toProps, 0);
    });

    // --- 7. GSAP: PARALLAX PROFILE PICTURE & VISUAL BACKGROUNDS ---
    const mm = gsap.matchMedia();
    mm.add({
        isDesktop: "(min-width: 1024px)",
        isTablet: "(max-width: 1023px) and (min-width: 500px)",
        isMobile: "(max-width: 500px)",
    }, (context) => {
        const { isTablet, isMobile } = context.conditions;
        let yStart = "-20%", yEnd = "18%";
        if (isTablet) { yStart = "-25%"; yEnd = "10%"; }
        else if (isMobile) { yStart = "-20%"; yEnd = "10%"; }

        gsap.utils.toArray(".section-profile-picture, .project-newversion-visual").forEach((section) => {
            const image = section.querySelector(".index-profile-picture, .bg-trigger-visual");
            if (image) {
                gsap.fromTo(image, { y: yStart }, {
                    y: yEnd,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            }
        });
    });
});

// --- 8. RESIZE DEBOUNCE ---
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 200);
});