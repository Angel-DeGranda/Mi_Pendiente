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
const diasClaseMateria = document.getElementById("dias-clase-materia");

const modalEditarTarea = document.getElementById("modal-editar-tarea");
const cerrarModalEditarTarea = document.getElementById("cerrar-modal-editar-tarea");
const formEditarTarea = document.getElementById("form-editar-tarea");
const inputEditarTareaId = document.getElementById("editar-tarea-id");
const selectEditarMateria = document.getElementById("editar-tarea-materia");
const textareaEditarDescripcion = document.getElementById("editar-tarea-descripcion");
const inputEditarFecha = document.getElementById("editar-tarea-fecha");
const checkboxEditarTiempo = document.getElementById("editar-tarea-checkbox-tiempo");
const labelEditarTime = document.getElementById("editar-tarea-label-time");
const inputEditarTime = document.getElementById("editar-tarea-time");

const modalEliminarTarea = document.getElementById("modal-eliminar-tarea");
const cerrarModalEliminarTarea = document.getElementById("cerrar-modal-eliminar-tarea");
const formEliminarTarea = document.getElementById("form-eliminar-tarea");
const inputEliminarTareaId = document.getElementById("eliminar-tarea-id");
const spanTareaTituloEliminar = document.querySelector(".tarea-titulo-eliminar");

const errorDescripcionAlta = document.getElementById("error-descripcion-alta");
const errorDescripcionEditar = document.getElementById("error-descripcion-editar");
const errorAnotacionPendiente = document.getElementById("error-anotacion-pendiente");

const caracteresPermitidos = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\/""\!\-_.,;:()\¿?=$#%+@]*$/;

const validarTexto = (texto) => caracteresPermitidos.test(texto);

const hoyISO = () =>  new Date().toLocaleDateString("en-CA");

inputFecha.min = hoyISO();

checkboxTiempo.addEventListener("change", () => {
    labelTiempo.classList.toggle("oculto");
    inputTime.classList.toggle("oculto");
});


let materiasData = [];

const cargarMaterias = async () => {
    const response = await fetch("/api/materias");
    const data = await response.json();

    if (response.ok) {
        materiasData = data
        data.forEach(materia => {
            const option = document.createElement("option");
            option.value = materia.id;
            option.textContent = materia.nombre;
            selectMateria.appendChild(option);
        });
    } else {
        console.error("Error al cargar materias: ", data.error);
    }
}

selectMateria.addEventListener("change", () => {
    const materia = materiasData.find(m => String(m.id) === selectMateria.value);
    diasClaseMateria.innerHTML = "";
    if (materia && materia.dias_clase && materia.dias_clase.length > 0) {
        materia.dias_clase.forEach(dia => {
            const badge = document.createElement("span");
            badge.className = "dia-badge";
            badge.textContent = dia;
            diasClaseMateria.appendChild(badge);
        });
        diasClaseMateria.classList.remove("oculto");
    } else {
        diasClaseMateria.classList.add("oculto");
    }

});

const cargarTareas = async (completada) => {
    const response = await fetch(`/api/tareas?completada=${completada}`);

    const data = await response.json();

    if (response.ok) {
        if (completada) {
            renderTareas(data, listaTareasCompletadas);
        } else {
            renderTareas(data, listaTareasActivas);
        }
    } else {
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
        const estadoValor = tarea.completada ? "Completada" : tarea.anotacion ? "Pendiente" : "Sin realizar";
        estado.className = `card-tarea-contenedor-estado card-tarea-estado-${estadoValor}`;
        estado.textContent = tarea.completada ? "Completada" : tarea.anotacion ? "Pendiente" : "Sin realizar";

        const anotacion = document.createElement("span");
        anotacion.className = "card-tarea-contenedor-anotacion";
        anotacion.textContent = tarea.anotacion ?? "";

        const prioridad = document.createElement("span");
        if (tarea.prioridad) {
            prioridad.className = `card-tarea-prioridad card-tarea-prioridad-${tarea.prioridad.toLowerCase()}`;
            prioridad.textContent = tarea.prioridad;
        }

        estadosContenedor.appendChild(estado);
        if (tarea.prioridad) {
            estadosContenedor.appendChild(prioridad);
        }
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
        botonEditar.addEventListener("click", async () => {
            inputEditarTareaId.value = tarea.id;
            textareaEditarDescripcion.value = tarea.descripcion;
            inputEditarFecha.value = tarea.fecha_entrega

            inputEditarFecha.min = hoyISO();

            selectEditarMateria.innerHTML = "";
            const response = await fetch("/api/materias");
            const materias = await response.json();
            materias.forEach(materia => {
                const option = document.createElement("option");
                option.value = materia.id;
                option.textContent = materia.nombre;
                if (String(materia.id) === String(tarea.materia_id)) {
                    option.selected = true;
                }
                selectEditarMateria.appendChild(option);
            });

            document.querySelectorAll(`input[name="prioridad-editar"]`).forEach(r => r.checked = false);

            if (tarea.prioridad) {
                const radioSeleccionado = document.querySelector(`input[name="prioridad-editar"][value="${tarea.prioridad}"]`);
                if (radioSeleccionado) {
                    radioSeleccionado.checked = true;
                }
            }

            if (tarea.hora_entrega) {
                inputEditarTime.value = tarea.hora_entrega;
                inputEditarTime.classList.remove("oculto");
                labelEditarTime.classList.remove("oculto");
                checkboxEditarTiempo.checked = true;
            } else {
                inputEditarTime.classList.add("oculto");
                labelEditarTime.classList.add("oculto");
                checkboxEditarTiempo.checked = false;
            }

            modalEditarTarea.classList.add("activo");
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.className = "card-tarea-boton-eliminar";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", () => {
            inputEliminarTareaId.value = tarea.id;
            spanTareaTituloEliminar.textContent = tarea.materias.nombre;
            modalEliminarTarea.classList.add("activo");
        });

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completada, anotacion })
    });

    const data = await response.json();

    if (response.ok) {
        cargarTareas(false);
        cargarTareas(true);
    } else {
        console.error("Error al cambiar estado: ", data.error);
    }
}

cerrarModalPendiente.addEventListener("click", () => {
    modalPendiente.classList.remove("activo");
})

checkboxEditarTiempo.addEventListener("change", () => {
    labelEditarTime.classList.toggle("oculto");
    inputEditarTime.classList.toggle("oculto");
});

cerrarModalEditarTarea.addEventListener("click", () => {
    modalEditarTarea.classList.remove("activo");
});

cerrarModalEliminarTarea.addEventListener("click", () => {
    modalEliminarTarea.classList.remove("activo");
});

formPendiente.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = inputPendienteTareaId.value;
    const anotacion = textareaPendienteAnotacion.value.trim();

    if (!validarTexto(anotacion)) {
        errorAnotacionPendiente.classList.remove("oculto");
        return;
    }
    errorAnotacionPendiente.classList.add("oculto");

    await cambiarEstado(id, false, anotacion);

    textareaPendienteAnotacion.value = "";
    modalPendiente.classList.remove("activo");
});

formEditarTarea.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = inputEditarTareaId.value;
    const materia_id = selectEditarMateria.value;
    const descripcion = textareaEditarDescripcion.value.trim();
    const prioridad = document.querySelector(`input[name="prioridad-editar"]:checked`)?.value;
    const fecha_entrega = inputEditarFecha.value;
    const hora_entrega = checkboxEditarTiempo.checked ? inputEditarTime.value : null;

    if (!validarTexto(descripcion)) {
        errorDescripcionEditar.classList.remove("oculto");
        return;
    }
    errorDescripcionEditar.classList.add("oculto");

    const response = await fetch(`/api/tareas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materia_id, descripcion, prioridad, fecha_entrega, hora_entrega })
    });

    const data = await response.json();

    if (response.ok) {
        modalEditarTarea.classList.remove("activo");
        cargarTareas(false);
        cargarTareas(true);
    } else {
        console.error("Error al editar tarea: ", data.error);
    }
});

formEliminarTarea.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = inputEliminarTareaId.value;

    const response = await fetch(`/api/tareas/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    if (response.ok) {
        modalEliminarTarea.classList.remove("activo");
        cargarTareas(false);
        cargarTareas(true);
    } else {
        console.error("Error al eliminar tarea: ", data.error);
    }
});

formAlta.addEventListener("submit", async (e) => {
    e.preventDefault();

    const materia_id = selectMateria.value;
    const descripcion = textareaDescripcion.value.trim();
    const prioridad = document.querySelector(`input[name="prioridad"]:checked`)?.value;
    const fecha_entrega = inputFecha.value;
    const hora_entrega = checkboxTiempo.checked ? inputTime.value : null;

    if (!validarTexto(descripcion)) {
        errorDescripcionAlta.classList.remove("oculto");
        return;
    }
    errorDescripcionAlta.classList.add("oculto");

    const response = await fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materia_id, descripcion, prioridad, fecha_entrega, hora_entrega })
    });

    const data = await response.json();

    if (response.ok) {
        formAlta.reset();
        diasClaseMateria.innerHTML = "";
        diasClaseMateria.classList.add("oculto");
        inputTime.classList.add("oculto");
        labelTiempo.classList.add("oculto");
        cargarTareas(false);
    } else {
        console.error("Error al crear tarea: ", data.error);
    }
});

cargarMaterias();
cargarTareas(false);
cargarTareas(true);