const botonCerrarSesion = document.querySelector(".menu-principal-cerrar-sesion");

botonCerrarSesion.addEventListener("click", async () => {
    const response = await fetch("/api/auth/logout", {
        method: "POST"
    });

    if(response.ok){
        window.location.href = "/";
    }
});

//navbar
const menuHamburger = document.getElementById("menu-hamburger");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

const abrirSidebar = () => {
    sidebar.classList.add("sidebar-abierto");
    sidebarOverlay.classList.add("sidebar-overlay-activo");
}

const cerrarSidebar = () => {
    sidebar.classList.remove("sidebar-abierto");
    sidebarOverlay.classList.remove("sidebar-overlay-activo");
}

menuHamburger.addEventListener("click", abrirSidebar);
sidebarOverlay.addEventListener("click", cerrarSidebar);

const paginaActual = window.location.pathname.split("/").pop();
document.querySelectorAll(".menu-links a, .sidebar-nav a").forEach(link => {
    if(link.getAttribute("href")===paginaActual){
        link.classList.add("menu-link-activo");
    }
});
