const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-form-email").value;
    const password = document.getElementById("login-form-password").value;

    const response = await fetch("/api/auth/login",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password})
    });

    const data = await response.json();

    if(!response.ok){
        document.querySelector(".login-form-mensaje-error").hidden = false;
    }else{
        window.location.href = "/dashboard.html";
    }
});

