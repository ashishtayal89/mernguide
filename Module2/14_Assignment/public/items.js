const api = {
    _get: function (url, headers) {
        let finalHeaders = { "Content-Type": "application/json", ...headers }
        return fetch(url, {
            method: "GET",
            headers: finalHeaders,
        })
            .then(response => Promise.all([response.json(), response.status]))
            .then((response) => {
                const data = response[0];
                const status = response[1];
                return { data, status };
            });
    },
    _post: function (url, body, headers) {
        let finalHeaders = { "Content-Type": "application/json", ...headers };
        return fetch(url, {
            method: "POST",
            headers: finalHeaders,
            body: JSON.stringify(body)
        })
            .then(response => Promise.all([response.json(), response.status]))
            .then((response) => {
                const data = response[0];
                const status = response[1];
                return { data, status };
            });
    },
    _delete: function (url, body, headers) {
        let finalHeaders = { "Content-Type": "application/json", ...headers };
        return fetch(url, {
            method: "DELETE",
            headers: finalHeaders,
            body: JSON.stringify(body)
        })
            .then(response => Promise.all([response.json(), response.status]))
            .then((response) => {
                const data = response[0];
                const status = response[1];
                return { data, status };
            });
    },
    carts: {
        read: function () {
            const url = "/carts";
            const headers = { token: localStorage.getItem("token") }
            return api._get(url, headers);
        },
        createUpdate: function (itemId, quantity) {
            const url = "/carts";
            const headers = { token: localStorage.getItem("token") };
            const body = { itemId, quantity };
            return api._post(url, body, headers);
        },
        remove: function (itemId) {
            const url = "/carts";
            const headers = { token: localStorage.getItem("token") };
            const body = { itemIds: [itemId] };
            return api._delete(url, body, headers);
        },
    },
    items: {
        read: function () {
            const url = "/items";
            const headers = { token: localStorage.getItem("token") }
            return api._get(url, headers);
        }
    }
}

const items = {
    status: null,
    data: null,
    error: null,
    init: async function () {
        const response = await api.items.read();
        this.status = response.status;
        if (response.status === 200) {
            this.data = response.data;
            itemsRenderer.render(this.data);
        } else {
            this.error = response.data;
            itemsRenderer.renderError();
        }

    }
}

const itemsRenderer = {
    render: function (items) {
        const productsContainer = document.getElementById("products");
        productsContainer.innerHTML = '';
        const products = this.getItemsToRender(items);
        for (let product of products) {
            productsContainer.appendChild(product);
        }
    },
    renderError: function () {
        const productsContainer = document.getElementById("products");
        if (items.status === 401 || items.status === 403) {
            productsContainer.innerHTML = 'Please login to access the items';
        }
    },
    getItemsToRender: function (items) {
        const products = [];
        for (item of items) {
            // Create all elements
            const product = document.createElement("div");
            const head = document.createElement("div");
            const title = document.createElement("div");
            const rating = document.createElement("div");
            const description = document.createElement("div");
            const action = document.createElement("div");
            const price = document.createElement("div");
            const add = document.createElement("div");
            const addButton = document.createElement("button");

            // Compute head
            title.appendChild(document.createTextNode(item.title));
            title.className = "title";
            rating.appendChild(document.createTextNode(`${item.rating}`));
            rating.className = "rating";
            head.appendChild(title);
            head.appendChild(rating);
            head.className = "head";

            // Compute description
            description.appendChild(document.createTextNode(item.description));
            description.className = "desc";

            // Compute action
            price.appendChild(document.createTextNode(`USD ${item.price}`));
            price.className = "price";
            addButton.appendChild(document.createTextNode("Add"));
            addButton.addEventListener("click", this.handleAddItem.bind(this, item.id));
            add.appendChild(addButton);
            add.className = 'add';
            action.appendChild(price);
            action.appendChild(add);
            action.className = "action";

            // Compute product
            product.appendChild(head);
            product.appendChild(description);
            product.appendChild(action);
            product.className = "product";

            // Add product in products
            products.push(product);
        }
        return products;
    },
    handleAddItem: async function (itemId, e) {
        if (cart.data) {
            const cartItem = cart.data.find((cartItem) => cartItem.id === itemId);
            const quantity = cartItem && cartItem.quantity || 0;
            const response = await api.carts.createUpdate(itemId, quantity + 1);
            cart.status = response.status;
            if (response.status === 200) {
                cart.data = response.data;
            } else {
                cart.error = response.data;
            }
            cartRenderer.render(cart.data);
        }
    }
}


const cart = {
    status: null,
    data: null,
    error: null,
    init: async function () {
        const response = await api.carts.read();
        this.status = response.status;
        if (response.status === 200 && response.data) {
            this.data = response.data;
            cartRenderer.render(this.data);
        } else {
            this.error = response.data;
            cartRenderer.renderError();
        }
    }
}

const cartRenderer = {
    render: function (cartItems) {
        const cartItemsContainer = document.getElementById("items");
        const cartItemsToRender = this.getCartItemsToRender(cartItems);
        cartItemsContainer.innerHTML = '';
        for (let cartItemToRender of cartItemsToRender) {
            cartItemsContainer.appendChild(cartItemToRender);
        }

        const totalQuantity = cartItems.reduce((quantity, item) => quantity + item.quantity, 0);
        document.getElementById("totalQuantity").innerHTML = '';
        document.getElementById("totalQuantity").appendChild(document.createTextNode(totalQuantity));
    },
    renderError: function () {
        const cartItemsContainer = document.getElementById("items");
        if (cart.status === 401 || cart.status === 403) {
            cartItemsContainer.innerHTML = 'Please login to access the cart';
        } else if (!cart.data) {
            cartItemsContainer.innerHTML = 'No item in the cart';
        }
    },
    getCartItemsToRender: function (cartItems) {
        const sortedCartItems = cartItems.sort((item1, item2) => item1.price - item2.price);
        const items = [];
        let totalItemsPrice = 0;
        let totalItemsQuantity = 0;
        for (let cartItem of cartItems) {
            const item = document.createElement("div");
            const name = document.createElement("div");
            const price = document.createElement("div");
            const quantity = document.createElement("div");
            const quantitySelect = document.createElement("select");
            const remove = document.createElement("div");

            // Compose name
            name.className = "name";
            name.appendChild(document.createTextNode(cartItem.title));

            // Compose price
            price.className = "price";
            price.appendChild(document.createTextNode(`$${cartItem.price.toFixed(2)}`));

            // Compose quantity
            for (let i = 1; i <= 10; i++) {
                const quantityOption = document.createElement("option");
                quantityOption.setAttribute("key", i);
                if (i === cartItem.quantity) {
                    quantityOption.setAttribute("selected", true);
                }
                quantityOption.appendChild(document.createTextNode(i));
                quantitySelect.appendChild(quantityOption);
            }
            quantitySelect.addEventListener("change", this.handleCartUpdate.bind(this, cartItem.id));
            quantity.className = "quantity";
            quantity.appendChild(quantitySelect);

            // Compose remove
            remove.className = "delete";
            remove.appendChild(document.createTextNode("Remove"));
            remove.addEventListener("click", this.handleRemoveItem.bind(this, cartItem.id));

            // Compose item
            item.className = "item";
            item.appendChild(name);
            item.appendChild(price);
            item.appendChild(quantity);
            item.appendChild(remove);

            // Add item to items
            items.push(item);

            // Update totalPrice and totalQuatity
            totalItemsPrice += cartItem.price * cartItem.quantity;
            totalItemsQuantity += cartItem.quantity;
        }

        const total = document.createElement("div");
        const totalName = document.createElement("div");
        const totalPrice = document.createElement("div");
        const totalQuantity = document.createElement("div");
        const totalEmptySpace = document.createElement("div");

        // Compute totalName
        totalName.className = "name";
        totalName.appendChild(document.createTextNode("Total"));

        // Compute totalPrice
        totalPrice.className = "price";
        totalPrice.appendChild(document.createTextNode(`$${totalItemsPrice.toFixed(2)}`));

        // Compute totalQuantity
        totalQuantity.className = "quantity";
        totalQuantity.appendChild(document.createTextNode(totalItemsQuantity));

        totalEmptySpace.className = "delete";

        // Compute total
        total.className = "item total";
        total.appendChild(totalName);
        total.appendChild(totalPrice);
        total.appendChild(totalQuantity);
        total.appendChild(totalEmptySpace);
        items.push(total);

        return items;
    },
    handleCartUpdate: async function (itemId, e) {
        const quantity = e.target.value * 1;
        const response = await api.carts.createUpdate(itemId, quantity);
        cart.status = response.status;
        if (response.status === 200) {
            cart.data = response.data;
            this.render(cart.data);
        } else {
            cart.error = response.data;
            this.renderError(cart.error);
        }

    },
    handleRemoveItem: async function (itemId) {
        const response = await api.carts.remove(itemId);
        cart.status = response.status;
        if (response.status === 200) {
            cart.data = response.data;
            this.render(cart.data);
        } else {
            cart.error = response.data;
            this.renderError(cart.error);
        }
    }
}


function allowOpenCloseCart() {
    document.getElementById("carticon").addEventListener("click", () => {
        if (document.getElementById("cart").className.indexOf("hide") !== -1) {
            document.getElementById("cart").className = "cart show";
        } else {
            document.getElementById("cart").className = "cart hide";
        }
    });

    document.getElementById("close").addEventListener("click", () => {
        if (document.getElementById("cart").className.indexOf("hide") !== -1) {
            document.getElementById("cart").className = "cart show";
        } else {
            document.getElementById("cart").className = "cart hide";
        }
    });
}

function allowCheckout() {
    document.getElementById("checkout").addEventListener("click", () => {
        location.replace("checkout.html");
    });
}

function allowLogout() {
    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("token");
        location.replace("login.html");
    });
}

(async function () {
    const isAutherized = await autherize();
    if (isAutherized) {
        items.init();
        cart.init();
        allowOpenCloseCart();
        allowCheckout();
        allowLogout();
    }
})()