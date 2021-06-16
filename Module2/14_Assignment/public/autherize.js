function autherize() {
    const token = localStorage.getItem("token");
    if (token) {
        return fetch(`tokens?id=${token}`, {
            method: "GET",
        }).then(response => {
            if (response.status !== 200) {
                location.replace("login.html");
            } else {
                return true;
            }
        })
    } else {
        location.replace("login.html");
    }
}