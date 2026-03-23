const formAlta = document.querySelector(".form-alta");
const contenedor = document.querySelector(".tabla-materias-contenedor");
const buttonCerrarSesion = document.querySelector(".menu-principal-cerrar-sesion");

const inputNombreAlta = document.getElementById("form-materia");
const soloPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s/]+$/;
const spanErrorAlta = document.querySelector(".error-nombre-alta");

const modalEliminar = document.getElementById("modal-eliminar-materia");
const spanNombreEliminar = document.querySelector(".materia-titulo-eliminar");
const inputIdEliminar = document.getElementById("form-eliminar-materia-id");
const buttonCancelarEliminar = document.querySelector(".boton-confirmar-cancelar");
const formEliminar = document.getElementById("form-eliminar-materia");

const modalEditar = document.getElementById("modal-editar-materia");
const formEditar = document.getElementById("form-editar-materia");
const buttonCerrarSesionModal = document.getElementById(("cerrar-modal"));
const checkboxesEditar = document.querySelectorAll(".dia-semana-editar");
const inputIdEditar = document.getElementById("form-editar-materia-id");
const inputNombreEditar = document.getElementById("form-editar-nombre-materia");
const spanErrorEditar = document.querySelector(".error-nombre-editar");


const abrirModalEliminar = (materia) => {
    inputIdEliminar.value = materia.id;
    spanNombreEliminar.textContent = materia.nombre;
    modalEliminar.classList.add("activo");
}

buttonCancelarEliminar.addEventListener("click", () => {
    modalEliminar.classList.remove("activo");
});

formEliminar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = inputIdEliminar.value;

    const response = await fetch(`/api/materias/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    if(response.ok){
        modalEliminar.classList.remove("activo");
        cargarMateria();
    }else{
        console.error("Error al eliminar: ", data.error);
    }
});

const abrirModalEditar = (materia) => {
    inputIdEditar.value = materia.id;
    inputNombreEditar.value = materia.nombre;

    checkboxesEditar.forEach(cb =>{
        cb.checked = (materia.dias_clase || []).includes(cb.value);
    });

   modalEditar.classList.add("activo");

}

buttonCerrarSesionModal.addEventListener("click", () => {
    modalEditar.classList.remove("activo");
});

inputNombreEditar.addEventListener("input", () => {
    const valor = inputNombreEditar.value;
    if(valor.length>0){
        inputNombreEditar.value = valor.charAt(0).toUpperCase() + valor.slice(1);
    }
    spanErrorEditar.textContent = `${inputNombreEditar.value.length}/60 caracteres`;
});

formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = inputIdEditar.value;
    const nombre = inputNombreEditar.value;
    const nombreLimpio = nombre.trim();

    if(nombreLimpio === "" || !soloPermitidos.test(nombreLimpio)){
        spanErrorEditar.classList.add("visible");
        return;
    }

    spanErrorEditar.classList.remove("visible");

    const dias_clase = Array.from(checkboxesEditar)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
    
    const response = await fetch(`/api/materias/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({nombre: nombreLimpio, dias_clase})
    });

    const data = await response.json();

    if(response.ok){
        modalEditar.classList.remove("activo");
        cargarMateria();
    }else{
        console.log("Error al editar: ", data.error);
    }
});

const renderMaterias = (materias) => {
    contenedor.innerHTML="";

    materias.forEach(materia => {

        const card = document.createElement("article");
        card.className = "card";

        const header = document.createElement("header");
        header.className = "card-header";
        
        const titulo = document.createElement("h3");
        titulo.className = "card-title";
        titulo.textContent = materia.nombre;
        
        const div = document.createElement("div");
        div.className = "card-listado-contenedor";
        
        const parrafo = document.createElement("p");
        parrafo.className = "listado-titulo";
        parrafo.innerHTML = "<strong>Días de clase:</strong>";
        
        const ul = document.createElement("ul");
        ul.className = "dias-lista";

        (materia.dias_clase || []).forEach(dia => {
            const li = document.createElement("li");
            li.textContent = dia;
            ul.appendChild(li);
        });

        const botonEditar = document.createElement("button");
        botonEditar.className = "card-button-editar";
        botonEditar.textContent = "Editar";
        botonEditar.addEventListener("click", () => {
            abrirModalEditar(materia);
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.className = "card-button-eliminar";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", () => {
            abrirModalEliminar(materia);
        });

        header.appendChild(titulo);
        div.appendChild(parrafo);
        div.appendChild(ul);
        card.appendChild(header);
        card.appendChild(div);
        card.appendChild(botonEditar);
        card.appendChild(botonEliminar);
        contenedor.appendChild(card);

    });
}

inputNombreAlta.addEventListener("input", () => {
    const valor = inputNombreAlta.value;
    if(valor.length>0){
        inputNombreAlta.value = valor.charAt(0).toUpperCase() + valor.slice(1);
    }
    spanErrorAlta.textContent = `${inputNombreAlta.value.length}/60 caracteres`;
});

formAlta.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombreMateria = document.getElementById("form-materia").value;
    const listaDias = Array.from(document.querySelectorAll(".dia-semana:checked")).map(cb => cb.value);
    const nombreMateriaLimpio = nombreMateria.trim();

    if(nombreMateriaLimpio === "" || !soloPermitidos.test(nombreMateriaLimpio)){
        spanErrorAlta.classList.add("visible");
        return;
    }

    spanErrorAlta.classList.remove("visible");

    const response = await fetch("/api/materias", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({nombre: nombreMateriaLimpio, dias_clase: listaDias})
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

    if(response.ok){
        renderMaterias(data);
    }else{
        console.error("Error al cargar materias: ", data.error);
    }
    
}

cargarMateria();