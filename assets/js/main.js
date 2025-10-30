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
        const checkoutItems = Array.from(checkout.querySelectorAll(".checkout-item"));
        const paymentButton = checkout.querySelector("[data-payment-button]");
        const paymentStatus = checkout.querySelector("[data-payment-status]");
        let checkoutDisplayItems = [];
        let checkoutTotals = { subtotal: 0, shipping: 0, total: 0, shippingLabel: "Shipping" };

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
            checkoutDisplayItems = [];

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

                const itemLabel = checkoutItems[index]?.querySelector("h3")?.textContent?.trim() || `Item ${index + 1}`;
                checkoutDisplayItems[index] = {
                    label: itemLabel,
                    amount: lineTotal,
                };
            });

            const shippingValue = Number.parseFloat(
                shippingOptions.find(option => option.checked)?.value || "0"
            );
            const selectedShippingLabel = shippingOptions
                .find(option => option.checked)
                ?.closest("label")?.textContent?.replace(/\s+/g, " ")
                ?.trim();

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

            checkoutTotals = {
                subtotal,
                shipping: shippingValue,
                total: subtotal + shippingValue,
                shippingLabel: selectedShippingLabel || "Shipping",
            };
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

        const buildShippingOptions = () =>
            shippingOptions.map((option, index) => {
                const label = option.closest("label")?.textContent?.replace(/\s+/g, " ")?.trim() || `Shipping option ${index + 1}`;
                const amountValue = Number.parseFloat(option.value || "0");
                const id = option.dataset.shippingId || `shipping-${index}`;
                return {
                    id,
                    label,
                    amount: {
                        currency: "USD",
                        value: amountValue.toFixed(2),
                    },
                    selected: option.checked,
                };
            });

        if (paymentButton) {
            if (!window.PaymentRequest) {
                paymentButton.disabled = true;
                if (paymentStatus) {
                    paymentStatus.dataset.state = "error";
                    paymentStatus.textContent = "Payment Request API is not available in this browser.";
                }
            }

            paymentButton.addEventListener("click", async () => {
                if (!window.PaymentRequest) {
                    return;
                }

                const applePayMethod = {
                    supportedMethods: "https://apple.com/apple-pay",
                    data: {
                        version: 3,
                        merchantIdentifier: "merchant.com.novathread.demo",
                        merchantCapabilities: ["supports3DS"],
                        supportedNetworks: ["amex", "discover", "masterCard", "visa"],
                        countryCode: "US",
                    },
                };

                const cardMethod = {
                    supportedMethods: "basic-card",
                    data: {
                        supportedNetworks: ["amex", "discover", "mastercard", "visa"],
                    },
                };

                const displayItems = checkoutDisplayItems.map(item => ({
                    label: item.label,
                    amount: { currency: "USD", value: item.amount.toFixed(2) },
                }));

                displayItems.push({
                    label: checkoutTotals.shippingLabel,
                    amount: { currency: "USD", value: checkoutTotals.shipping.toFixed(2) },
                });

                const paymentDetails = {
                    displayItems,
                    total: {
                        label: "NovaThread Collective",
                        amount: { currency: "USD", value: checkoutTotals.total.toFixed(2) },
                    },
                    shippingOptions: buildShippingOptions(),
                };

                const paymentOptions = {
                    requestPayerEmail: true,
                    requestPayerName: true,
                    requestShipping: true,
                };

                try {
                    const request = new PaymentRequest([applePayMethod, cardMethod], paymentDetails, paymentOptions);

                    if (typeof request.canMakePayment === "function") {
                        try {
                            const canPay = await request.canMakePayment();
                            if (canPay === false && paymentStatus) {
                                paymentStatus.dataset.state = "error";
                                paymentStatus.textContent = "No saved payment methods detected. Continue with secure checkout.";
                            }
                        } catch (canPayError) {
                            console.warn("Payment capability check failed", canPayError);
                        }
                    }

                    const response = await request.show();
                    await response.complete("success");

                    if (paymentStatus) {
                        paymentStatus.dataset.state = "success";
                        paymentStatus.textContent = "Payment details received securely. A receipt has been sent to your email.";
                    }
                } catch (error) {
                    if (paymentStatus) {
                        paymentStatus.dataset.state = "error";
                        if (error && error.name === "NotSupportedError") {
                            paymentStatus.textContent = "Apple Pay requires a verified merchant ID. Update your credentials to enable live payments.";
                        } else {
                            paymentStatus.textContent = "Payment window was closed or is unavailable. Please use the standard checkout.";
                        }
                    }
                    console.error("Payment request error:", error);
                }
            });
        }
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
