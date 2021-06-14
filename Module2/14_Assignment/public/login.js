document.getElementById("submit").onclick = function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/tokens", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    }).then(response => Promise.all([response.json(), response.status]))
        .then((response) => {
            const data = response[0];
            const status = response[1];
            if (status === 200) {
                localStorage.setItem("token", data.id);
                location.replace("items.html");
            } else {
                const errorElement = document.getElementById("error");
                errorElement.innerText = data.Error;
            }
        })
}

const token = localStorage.getItem("token");
fetch(`tokens?id=${token}`, {
    method: "GET",
}).then(response => {
    if (response.status === 200) {
        location.replace("items.html");
    }
})


