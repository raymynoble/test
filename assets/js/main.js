document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav__toggle");
    const navLinks = document.querySelector(".nav__links");
    const yearSpan = document.getElementById("year");

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (navToggle && navLinks) {
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
    }

    const swatchGroups = document.querySelectorAll(".product-card__swatches");
    swatchGroups.forEach(group => {
        const buttons = Array.from(group.querySelectorAll(".swatch"));
        const selectionLabel = group.closest(".product-card")?.querySelector("[data-selected-color]");

        buttons.forEach(button => {
            button.addEventListener("click", () => {
                buttons.forEach(control => {
                    control.classList.remove("is-active");
                    control.setAttribute("aria-pressed", "false");
                });

                button.classList.add("is-active");
                button.setAttribute("aria-pressed", "true");

                if (selectionLabel && button.dataset.color) {
                    selectionLabel.textContent = `Selected: ${button.dataset.color}`;
                }
            });
        });
    });

    const checkout = document.querySelector(".checkout");
    if (checkout) {
        const qtyInputs = Array.from(checkout.querySelectorAll(".checkout-item__qty"));
        const shippingOptions = Array.from(checkout.querySelectorAll('input[name="shipping"]'));
        const subtotalEl = checkout.querySelector("[data-checkout-subtotal]");
        const shippingEl = checkout.querySelector("[data-checkout-shipping]");
        const totalEl = checkout.querySelector("[data-checkout-total]");
        const itemTotalEls = qtyInputs.map(input => input.closest(".checkout-item__controls")?.querySelector("[data-item-total]"));

        const formatCurrency = value =>
            new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

        const sanitizeQuantity = input => {
            const value = Number.parseInt(input.value, 10);
            if (!Number.isFinite(value) || value < 1) {
                input.value = "1";
            }
        };

        const updateTotals = () => {
            let subtotal = 0;

            qtyInputs.forEach((input, index) => {
                sanitizeQuantity(input);
                const quantity = Number.parseInt(input.value, 10) || 1;
                const price = Number.parseFloat(input.dataset.price || "0");
                const lineTotal = price * quantity;
                subtotal += lineTotal;

                const lineTotalEl = itemTotalEls[index];
                if (lineTotalEl) {
                    lineTotalEl.textContent = formatCurrency(lineTotal);
                }
            });

            const shippingValue = Number.parseFloat(
                shippingOptions.find(option => option.checked)?.value || "0"
            );

            shippingOptions.forEach(option => {
                const parentLabel = option.closest("label");
                if (parentLabel) {
                    parentLabel.classList.toggle("is-selected", option.checked);
                }
            });

            if (subtotalEl) {
                subtotalEl.textContent = formatCurrency(subtotal);
            }

            if (shippingEl) {
                shippingEl.textContent = shippingValue === 0 ? "Free" : formatCurrency(shippingValue);
            }

            if (totalEl) {
                totalEl.textContent = formatCurrency(subtotal + shippingValue);
            }
        };

        qtyInputs.forEach(input => {
            input.addEventListener("change", updateTotals);
            input.addEventListener("input", () => {
                if (input.value.length > 3) {
                    input.value = input.value.slice(0, 3);
                }
                updateTotals();
            });
        });

        shippingOptions.forEach(option => {
            option.addEventListener("change", updateTotals);
        });

        updateTotals();
    }

    const faqTriggers = document.querySelectorAll("[data-faq-trigger]");
    faqTriggers.forEach(trigger => {
        const answer = trigger.nextElementSibling;
        const container = trigger.closest(".faq__item");

        if (!answer) {
            return;
        }

        trigger.addEventListener("click", () => {
            const isExpanded = trigger.getAttribute("aria-expanded") === "true";
            trigger.setAttribute("aria-expanded", String(!isExpanded));
            answer.hidden = isExpanded;

            if (container) {
                container.classList.toggle("is-open", !isExpanded);
            }
        });
    });
});
