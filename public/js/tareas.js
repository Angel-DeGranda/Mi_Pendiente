const formAlta = document.getElementById("form-alta-tarea");
const selectMateria = document.getElementById("select-materia");
const textareaDescripcion = document.getElementById("textarea-descripcion");
const inputFecha = document.getElementById("input-fecha");
const checkboxTiempo = document.getElementById("checkbox-tiempo");
const labelTiempo = document.querySelector("label[for='input-time']");
const inputTime = document.getElementById("input-time");
const listaTareasActivas = document.getElementById("lista-tareas-activas");
const listaTareasCompletadas = document.getElementById("lista-tareas-completadas");
const modalPendiente = document.getElementById("modal-pendiente");
const cerrarModalPendiente = document.getElementById("cerrar-modal-pendiente");
const formPendiente = document.getElementById("form-pendiente");
const inputPendienteTareaId = document.getElementById("pendiente-tarea-id");
const textareaPendienteAnotacion = document.getElementById("pendiente-anotacion");

checkboxTiempo.addEventListener("change", () => {
    labelTiempo.classList.toggle("oculto");
    inputTime.classList.toggle("oculto");
});

const cargarMaterias = async () => {
    const response = await fetch("/api/materias");
    const data = await response.json();

    if(response.ok){
        data.forEach(materia => {
            const option = document.createElement("option");
            option.value = materia.id;
            option.textContent = materia.nombre;
            selectMateria.appendChild(option);
        });
    }else{
        console.error("Error al cargar materias: ", data.error);
    }
}

const cargarTareas = async (completada) => {
    const response = await fetch(`/api/tareas?completada=${completada}`);

    const data = await response.json();

    if(response.ok){
        if(completada){
            renderTareas(data, listaTareasCompletadas);
        }else{
            renderTareas(data, listaTareasActivas);
        }
    }else{
        console.error("Error al cargar tareas: ", data.error);
    }
}

const renderTareas = (tareas, contenedor) => {
    contenedor.innerHTML = "";

    tareas.forEach(tarea => {
        const card = document.createElement("article");
        card.className = "card";

        const header = document.createElement("header");
        header.className = "card-header";

        const titulo = document.createElement("h3");
        titulo.className = "card-title";
        titulo.textContent = tarea.materias.nombre;
        header.appendChild(titulo);

        const cuerpo = document.createElement("div");
        cuerpo.className = "card-listado-contenedor";

        const descripcion = document.createElement("p");
        descripcion.className = "card-tarea-p-descripcion";
        descripcion.textContent = tarea.descripcion;

        const infoContenedor = document.createElement("div");
        infoContenedor.className = "card-tarea-contenedor-info";

        const fecha = document.createElement("span");
        fecha.className = "card-tarea-contenedor-fecha";
        fecha.textContent = `Entrega: ${tarea.fecha_entrega}`;

        const hora = document.createElement("span");
        hora.className = "card-tarea-contenedor-hora";
        hora.textContent = tarea.hora_entrega ? `a las ${tarea.hora_entrega}` : "";

        infoContenedor.appendChild(fecha);
        infoContenedor.appendChild(hora);

        const estadosContenedor = document.createElement("div");
        estadosContenedor.className = "card-tarea-contenedor-estados";

        const estado = document.createElement("span");
        estado.className = "card-tarea-contenedor-estado";
        estado.textContent = tarea.completada ? "Completada" : tarea.anotacion ? "Pendiente" : "Sin realizar";

        const anotacion = document.createElement("span");
        anotacion.className = "card-tarea-contenedor-anotacion";
        anotacion.textContent = tarea.anotacion ?? "";

        estadosContenedor.appendChild(estado);
        estadosContenedor.appendChild(anotacion);

        cuerpo.appendChild(descripcion);
        cuerpo.appendChild(infoContenedor);
        cuerpo.appendChild(estadosContenedor);

        const botonesContenedor = document.createElement("div");
        botonesContenedor.className = "card-botones-contenedor";

        const botonPendiente = document.createElement("button");
        botonPendiente.className = "card-tarea-boton-pendiente";
        botonPendiente.textContent = "Marcar pendiente";
        botonPendiente.addEventListener("click", () => {
            inputPendienteTareaId.value = tarea.id;
            modalPendiente.classList.add("activo");
        });

        const botonCompletar = document.createElement("button");
        botonCompletar.className = "card-tarea-boton-completar";
        botonCompletar.textContent = "Completar";
        botonCompletar.addEventListener("click", () => {
            cambiarEstado(tarea.id, true, null);
        });

        const botonEditar = document.createElement("button");
        botonEditar.className = "card-tarea-boton-editar";
        botonEditar.textContent = "Editar";

        const botonEliminar = document.createElement("button");
        botonEliminar.className = "card-tarea-boton-eliminar";
        botonEliminar.textContent = "Eliminar";

        botonesContenedor.appendChild(botonPendiente);
        botonesContenedor.appendChild(botonCompletar);
        botonesContenedor.appendChild(botonEditar);
        botonesContenedor.appendChild(botonEliminar);

        card.appendChild(header);
        card.appendChild(cuerpo);
        card.appendChild(botonesContenedor);
        contenedor.appendChild(card);
    });
}

const cambiarEstado = async (id, completada, anotacion) => {
    const response = await fetch(`/api/tareas/${id}/estado`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({completada, anotacion})
    });

    const data = await response.json();

    if(response.ok){
        cargarTareas(false);
        cargarTareas(true);
    }else{
        console.error("Error al cambiar estado: ", data.error);
    }
}

cerrarModalPendiente.addEventListener("click", () => {
    modalPendiente.classList.remove("activo");
})

formPendiente.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = inputPendienteTareaId.value;
    const anotacion = textareaPendienteAnotacion.value.trim();

    await cambiarEstado(id, false, anotacion);

    textareaPendienteAnotacion.value = "";
    modalPendiente.classList.remove("activo");
});

formAlta.addEventListener("submit", async (e) => {
    e.preventDefault();

    const materia_id = selectMateria.value;
    const descripcion = textareaDescripcion.value.trim();
    const prioridad = document.querySelector(`input[name="prioridad"]:checked`)?.value;
    const fecha_entrega = inputFecha.value;
    const hora_entrega = checkboxTiempo.checked ? inputTime.value: null;

    const response = await fetch("/api/tareas", {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({materia_id, descripcion, prioridad, fecha_entrega, hora_entrega})
    });

    const data = await response.json();

    if(response.ok){
        formAlta.reset();
        inputTime.classList.add("oculto");
        labelTiempo.classList.add("oculto");
        cargarTareas(false);
    }else{
        console.error("Error al crear tarea: ", data.error);
    }
});

cargarMaterias();
cargarTareas(false);
cargarTareas(true);