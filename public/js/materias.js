const formAlta = document.querySelector(".form-alta");
const contenedor = document.querySelector(".tabla-materias-contenedor");
const buttonCerrarSesion = document.querySelector(".menu-principal-cerrar-sesion");

const modal = document.getElementById("modal-editar-materia");
const formEditar = document.getElementById("form-editar-materia");
const buttonCerrarSesionModal = document.getElementById(("cerrar-modal"));

const renderMaterias = (materias) => {
    contenedor.innerHTML="";

    materias.forEach(materia => {
        const diasItems = (materia.dias_clase || []).map(dia => `<li>${dia}</li>`).join("");
        
        const card = `
        <article class="card">
                <header class="card-header">
                    <h3 class="card-title">${materia.nombre}</h3>
                </header>
                <div class="card-listado-contenedor">
                    <p class="listado-titulo"><strong>Días de clase:</strong></p>
                    <ul class="dias-lista">${diasItems}</ul>
                </div>
                <button class="card-button-editar">Editar</button>
                <button class="card-button-eliminar">Eliminar</button>
            </article>
        `;

        contenedor.innerHTML += card;
    });
}

formAlta.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombreMateria = document.getElementById("form-materia").value;
    const listaDias = Array.from(document.querySelectorAll(".dia-semana:checked")).map(cb => cb.value);

    const response = await fetch("/api/materias", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({nombre: nombreMateria, dias_clase: listaDias})
    });
    
    const data = await response.json();

    if(response.ok){
        formAlta.reset();
        cargarMateria();
    }else{
        console.error("Error al guardar: ", data.error);
    }
})

const cargarMateria = async () => {
    const response = await fetch("/api/materias");
    const data = await response.json();

    renderMaterias(data);
}

cargarMateria();