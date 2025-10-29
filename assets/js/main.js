document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav__toggle");
    const navLinks = document.querySelector(".nav__links");
    const yearSpan = document.getElementById("year");

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (!navToggle || !navLinks) {
        return;
    }

    const toggleNav = () => {
        const isOpen = navLinks.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    };

    navToggle.addEventListener("click", toggleNav);

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            if (navLinks.classList.contains("is-open")) {
                toggleNav();
            }
        });
    });
});
