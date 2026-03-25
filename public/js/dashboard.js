const saludo = document.getElementById("dashboard-saludo");
const dashFecha = document.getElementById("dashboard-fecha");
const statPendientes = document.getElementById("stat-pendientes");
const statCompletadas = document.getElementById("stat-completadas");
const statPrioridadAlta = document.getElementById("stat-prioridad-alta");
const statVencidas = document.getElementById("stat-vencidas");
const listaPendientes = document.getElementById("lista-pendientes");
const listaCompletadasHoy = document.getElementById("lista-completadas-hoy");

const modalDetalleTarea = document.getElementById("modal-detalle-tarea");
const detalleMateria = document.getElementById("detalle-materia");
const detalleDescripcion = document.getElementById("detalle-descripcion");
const detalleFecha = document.getElementById("detalle-fecha");
const detalleHora = document.getElementById("detalle-hora");
const detallePrioridad = document.getElementById("detalle-prioridad");
const detalleEstado = document.getElementById("detalle-estado");
const cerrarModalDetalle = document.getElementById("cerar-modal-detalle-footer");

const init = async () => {
    const resUser = await fetch("/api/auth/userData");

    if (!resUser.ok) {
        window.location.href = "/";
        return;
    }

    const user = await resUser.json();
    saludo.textContent = `Hola, ${user.nombre ?? "Usuario"}`;

    const hoy = new Date();
    dashFecha.textContent = hoy.toLocaleDateString("es-MX", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    await cargarDashboard();
}

const cargarDashboard = async () => {
    const [resPendiente, resCompletadas] = await Promise.all([
        fetch("/api/tareas"),
        fetch("/api/tareas?completada=true")
    ]);

    const pendientes = await resPendiente.json();
    const completadas = await resCompletadas.json();

    if (!resPendiente.ok || !resCompletadas.ok) {
        console.error("Error al cargar tareas");
        return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const vencidas = pendientes.filter(t => new Date(t.fecha_entrega + "T00:00:00") < hoy);
    const altaPrioridad = pendientes.filter(t => t.prioridad == "Alta");

    statPendientes.textContent = pendientes.length;
    statCompletadas.textContent = completadas.length;
    statPrioridadAlta.textContent = altaPrioridad.length;
    statVencidas.textContent = vencidas.length;

    renderPendientes(pendientes, hoy);

    const completadasHoy = completadas.filter(t => {
        const f = new Date(t.fecha_entrega + "T00:00:00");
        return f.getTime() === hoy.getTime();
    });

    renderCompletadasHoy(completadasHoy);

    renderCalendario([...pendientes, ...completadas]);
};

const renderPendientes = (tareas, hoy) => {
    if (tareas.length === 0) {
        const p = document.createElement("p");
        p.className = "dashboard-vacio";
        p.textContent = "No hay tareas pendientes.";
        listaPendientes.appendChild(p);
        return;
    }

    tareas.sort((a, b) => new Date(a.fecha_entrega) - new Date(b.fecha_entrega));

    const grupos = {};
    tareas.forEach(t => {
        if (!grupos[t.fecha_entrega]) {
            grupos[t.fecha_entrega] = [];
        }
        grupos[t.fecha_entrega].push(t);
    });

    Object.entries(grupos).forEach(([fecha, items]) => {
        const fechaTarea = new Date(fecha + "T00:00:00");
        const diffDias = Math.round((fechaTarea - hoy) / (1000 * 60 * 60 * 24));

        let etiqueta;
        if (diffDias < 0) etiqueta = `Vencida · ${fechaTarea.toLocaleDateString("es-MX", { day: "numeric", month: "short" })}`;
        else if (diffDias === 0) etiqueta = "Hoy";
        else if (diffDias === 1) etiqueta = "Mañana";
        else etiqueta = `En ${diffDias} días · ${fechaTarea.toLocaleDateString("es-MX", { day: "numeric", month: "short" })}`;

        const grupo = document.createElement("div");
        grupo.className = "dashboard-grupo";

        const tituloGrupo = document.createElement("h3");
        tituloGrupo.className = diffDias < 0
            ? "dashboard-grupo-titulo dashboard-grupo-titulo-vencida"
            : "dashboard-grupo-titulo";
        tituloGrupo.textContent = etiqueta;
        grupo.appendChild(tituloGrupo);

        items.forEach(tarea => {
            const item = document.createElement("div");
            item.className = "dashboard-tarea-item";

            const info = document.createElement("div");
            info.className = "dashboard-tarea-info";

            const materia = document.createElement("span");
            materia.className = "dashboard-tarea-materia";
            materia.textContent = tarea.materias?.nombre ?? "";

            const desc = document.createElement("span");
            desc.className = "dashboard-tarea-desc";
            desc.textContent = tarea.descripcion;

            info.appendChild(materia);
            info.appendChild(desc);

            const badges = document.createElement("div");
            badges.className = "dashboard-tarea-badges";

            if (tarea.prioridad) {
                const badge = document.createElement("span");
                badge.className = `dashboard-badge dashboard-badge-${tarea.prioridad.toLowerCase()}`;
                badge.textContent = tarea.prioridad;
                badges.appendChild(badge);
            }

            if (tarea.hora_entrega) {
                const hora = document.createElement("span");
                hora.className = "dashboard-badge dashboard-badge-hora";
                hora.textContent = tarea.hora_entrega.slice(0, 5);
                badges.appendChild(hora);
            }

            item.appendChild(info);
            item.appendChild(badges);
            grupo.appendChild(item);
        });

        listaPendientes.appendChild(grupo);
    });
}

const renderCompletadasHoy = (tareas) => {
    if (tareas.length === 0) {
        const p = document.createElement("p");
        p.className = "dashboard-vacio";
        p.textContent = "No hay tareas completadas para hoy.";
        listaCompletadasHoy.appendChild(p);
        return;
    }

    tareas.forEach(tarea => {
        const item = document.createElement("div");
        item.className = "dashboard-tarea-item dashboard-tarea-completada";

        const info = document.createElement("div");
        info.className = "dashboard-tarea-info";

        const materia = document.createElement("span");
        materia.className = "dashboard-tarea-materia";
        materia.textContent = tarea.materias?.nombre ?? "";

        const desc = document.createElement("span");
        desc.className = "dashboard-tarea-desc";
        desc.textContent = tarea.descripcion;

        info.appendChild(materia);
        info.appendChild(desc);

        const check = document.createElement("span");
        check.className = "dashboard-check";
        check.textContent = "✓";

        item.appendChild(info);
        item.appendChild(check);
        listaCompletadasHoy.appendChild(item);
    });
};

const renderCalendario = (tareas) => {
    const contenedor = document.getElementById("dashboard-calendario");

    const eventos = tareas.map(tarea => ({
        title: tarea.descripcion,
        date: tarea.fecha_entrega,
        backgroundColor: tarea.completada
            ? "#22c55e"
            : tarea.anotacion
                ? "#f59e0b"
                : "#94a3b8",
        borderColor: "transparent",
        textColor: "#ffffff",
        extendedProps: { tarea }
    }));

    const calendar = new FullCalendar.Calendar(contenedor, {
        initialView: "dayGridMonth",
        locale: "es",
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: ""
        },
        events: eventos,
        height: "auto",
        eventClick: (info) => {
            const tarea = info.event.extendedProps.tarea;
            detalleMateria.textContent = tarea.materias?.nombre ?? "";
            detalleDescripcion.textContent = tarea.descripcion;
            detalleFecha.textContent = `Entrega: ${new Date(tarea.fecha_entrega + "T00:00:00").toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`;
            if (tarea.hora_entrega) {
                detalleHora.textContent = `a las ${tarea.hora_entrega.slice(0, 5)}`;
                detalleHora.classList.remove("oculto");
            } else {
                detalleHora.textContent = "";
                detalleHora.classList.add("oculto");
            }
            if (tarea.prioridad) {
                detallePrioridad.textContent = tarea.prioridad;
                detallePrioridad.className = `card-tarea-prioridad card-tarea-prioridad-${tarea.prioridad.toLowerCase()}`;
            } else {
                detallePrioridad.textContent = "";
                detallePrioridad.className = "";
            }
            const estadoClase = tarea.completada ? "completada" : tarea.anotacion ? "pendiente" : "sin-realizar";
            detalleEstado.className = `card-tarea-contenedor-estado card-tarea-estado-${estadoClase}`;
            detalleEstado.textContent = tarea.completada ? "Completada" : tarea.anotacion ? "Pendiente" : "Sin realizar";
            modalDetalleTarea.classList.add("activo");
        }
    });

    calendar.render();
};

cerrarModalDetalle.addEventListener("click", () => {
    modalDetalleTarea.classList.remove("activo");
});

init();
