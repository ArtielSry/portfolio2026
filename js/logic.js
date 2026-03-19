document.addEventListener("DOMContentLoaded", () => {

    // --- 1. LENIS (Smooth Scroll) ---
    const lenis = new Lenis({
        autoRaf: true,
    });

    // --- 2. SVG animations ---
    const videosConfig = [
        { containerId: "impact-video", frameClass: "impact-frame", frameDuration: 100 },
        { containerId: "signal-video", frameClass: "impact-frame", frameDuration: 120 },
        { containerId: "original-video", frameClass: "impact-frame", frameDuration: 120 },
        { containerId: "featured-video", frameClass: "impact-frame", frameDuration: 120 },
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

    videosConfig.forEach((config) => {
        const container = document.getElementById(config.containerId);
        if (container) {
            const frames = container.querySelectorAll(`.${config.frameClass}`);
            if (frames.length) animateFrames(container, frames, config.frameDuration);
        }
    });

    // --- 3. SPLASH SCREEN / LOADING ---
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

    // --- 4. GSAP: ANIMACIÓN FAN CARDS ---
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



    

    // --- 5. GSAP: PARALLAX PROFILE PICTURE ---
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

        gsap.utils.toArray(".section-profile-picture").forEach((section) => {
            const image = section.querySelector(".index-profile-picture");
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

// --- 6. RESIZE DEBOUNCE ---
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 200);
});