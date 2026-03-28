const inputNombre = document.getElementById("input-nombre");
const inputEmail = document.getElementById("input-email");
const selectSaludo = document.getElementById("select-saludo");
const inputDias = document.getElementById("input-dias");
const infoFecha = document.getElementById("info-fecha");
const infoTareasTotal = document.getElementById("info-tareas-total");
const infoTareasCompletadas = document.getElementById("info-tareas-completadas");
const formPerfil = document.getElementById("form-perfil");
const formPreferencias = document.getElementById("form-preferencias");

const init = async () => {
    const [resUser, resPref, resTareas, resCompletadas] = await Promise.all([
        fetch("/api/auth/userData"),
        fetch("/api/preferencias"),
        fetch("/api/tareas"),
        fetch("/api/tareas?completada=true"),
    ]);

    const user = await resUser.json();
    const pref = await resPref.json();
    const tarea = await resTareas.json();
    const completadas = await resCompletadas.json();

    inputEmail.value = user.email ?? "";

    if(pref){
        inputNombre.value = pref.nombre ?? user.nombre ?? "";
        if(pref.saludo){
            selectSaludo.value = pref.saludo;
        }
        if(pref.dias_anticipacion){
            inputDias.value = pref.dias_anticipacion;
        }
    }else{
        inputNombre.value = user.nombre ?? "";
    }

    infoFecha.textContent = new Date(user.created_at).toLocaleDateString("es-MX", {
        day: "numeric", month: "long", year: "numeric"
    });
    infoTareasTotal.textContent = tarea.length + completadas.length;
    infoTareasCompletadas.textContent = completadas.length;
};

formPerfil.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const saludo = selectSaludo.value;
    const email = inputEmail.value;

    const response = await fetch("/api/preferencias", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({nombre, saludo, email})
    })

    if(response.ok){
        alert("Perfil guardado correctamente");
    }else{
        console.error("Error al guardar el perfil");
    }
})

formPreferencias.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dias_anticipacion = parseInt(inputDias.value);

    const response = await fetch("/api/preferencias", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dias_anticipacion })
    });

    if(response.ok){
        alert("Preferencias guardadas correctamente");
    }else{
        console.error("Error al guardar las preferencias");
    }
});

init();