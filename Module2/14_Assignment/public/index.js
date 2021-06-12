document.getElementById("submit").onclick = function () {
    const firstName = document.getElementById("fName").value;
    const lastName = document.getElementById("lName").value;
    const address = document.getElementById("address").value;
    const tosAgreement = document.getElementById("tos").value === "on" ? true : false;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    fetch("/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ firstName, lastName, address, tosAgreement, email, password })
    }).then(response => Promise.all([response.json(), response.status]))
        .then((response) => {
            const data = response[0];
            const status = response[1];
            if (status === 200) {
                location.replace("login.html");
            } else {
                const errorElement = document.getElementById("error");
                errorElement.innerText = data.Error;
            }
        })
}
