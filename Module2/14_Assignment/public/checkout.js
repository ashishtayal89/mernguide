// A reference to Stripe.js
var stripe;

// Disable the button until we have Stripe set up on the page
document.querySelector("button").disabled = true;

var setupElements = function () {
    stripe = Stripe("pk_test_PV25GYpAamnYOGCCufwxl1C500WbFo8con");
    /* ------- Set up Stripe Elements to use in checkout form ------- */
    var elements = stripe.elements();
    var style = {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4"
            }
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
        }
    };

    var card = elements.create("card", { style: style });
    card.mount("#card-element");

    return {
        stripe: stripe,
        card: card,
    };
};

async function getCartAmount() {
    return fetch("/carts", {
        method: "GET",
        headers: { token: localStorage.getItem("token") },
    })
        .then(response => Promise.all([response.json(), response.status]))
        .then((response) => {
            const cartItems = response[0];
            const status = response[1];
            if (status === 200) {
                let totalAmount = 0;
                for (let cartItem of cartItems) {
                    totalAmount += cartItem.price * cartItem.quantity;
                }
                return totalAmount.toFixed(2) * 1;
            }
        });
}

async function init() {
    const isAutherized = await autherize();
    if (isAutherized) {
        const { stripe, card } = setupElements();
        document.querySelector("button").disabled = false;
        var form = document.getElementById("payment-form");
        const totalAmount = await getCartAmount();
        if (totalAmount) {
            document.getElementById("price").innerText = `Total Amount $${totalAmount}`
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                pay(stripe, card, totalAmount);
            });
        } else {
            location.replace("items.html");
        }
    }
}

var handleAction = function (clientSecret) {
    stripe.handleCardAction(clientSecret).then(function (data) {
        if (data.error) {
            showError("Your card was not authenticated, please try again");
        } else if (data.paymentIntent.status === "requires_confirmation") {
            fetch("/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    paymentIntentId: data.paymentIntent.id
                })
            })
                .then(function (result) {
                    return result.json();
                })
                .then(function (json) {
                    if (json.error) {
                        showError(json.error);
                    } else {
                        orderComplete(clientSecret);
                    }
                });
        }
    });
};

/*
 * Collect card details and pay for the order
 */
var pay = function (stripe, card, totalAmount) {
    changeLoadingState(true);

    // Collects card details and creates a PaymentMethod
    stripe
        .createPaymentMethod("card", card)
        .then(function (result) {
            if (result.error) {
                showError(result.error.message);
            } else {
                const orderData = { paymentMethodId: result.paymentMethod.id, amount: totalAmount };
                return fetch("/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: localStorage.getItem("token")
                    },
                    body: JSON.stringify(orderData)
                });
            }
        })
        .then(function (result) {
            return result.json();
        })
        .then(function (response) {
            if (response.Error) {
                showError(response.Error);
            } else if (response.requiresAction) {
                // Request authentication
                handleAction(response.clientSecret);
            } else {
                orderComplete(response.clientSecret);
            }
        });
};

/* Shows a success / error message when the payment is complete */
var orderComplete = function (clientSecret) {
    stripe.retrievePaymentIntent(clientSecret).then(function (result) {
        var paymentIntent = result.paymentIntent;
        // var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

        document.querySelector(".sr-payment-form").classList.add("hidden");
        document.querySelector("pre").textContent = "Congratulation!!";

        document.querySelector(".sr-result").classList.remove("hidden");
        setTimeout(function () {
            document.querySelector(".sr-result").classList.add("expand");
        }, 200);

        changeLoadingState(false);
    });
};

var showError = function (errorMsgText) {
    changeLoadingState(false);
    var errorMsg = document.querySelector(".sr-field-error");
    errorMsg.textContent = errorMsgText;
    setTimeout(function () {
        errorMsg.textContent = "";
    }, 4000);
};

// Show a spinner on payment submission
var changeLoadingState = function (isLoading) {
    if (isLoading) {
        document.querySelector("button").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("button").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
};

init();