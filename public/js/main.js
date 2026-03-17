const botonCerrarSesion = document.querySelector(".menu-principal-cerrar-sesion");

botonCerrarSesion.addEventListener("click", async () => {
    const response = await fetch("/api/auth/logout", {
        method: "POST"
    });

    if(response.ok){
        window.location.href = "/";
    }
});
