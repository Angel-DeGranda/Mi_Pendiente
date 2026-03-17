const formAlta = document.querySelector(".tablas-materias-contenedor");
const contenedor = document.querySelector(".tabla-materias-contenedor");
const buttonCerrarSesion = document.querySelector(".menu-principal-cerrar-sesion");

const modal = document.getElementById("modal-editar-materia");
const formEditar = document.getElementById("form-editar-materia");
const buttonCerrarSesionModal = document.getElementById(("cerrar-modal"));

const cargarMateria = async () => {
    const response = await fetch("/api/materias");
    const data = await response.json();

    renderMaterias(data);
}

cargarMateria();