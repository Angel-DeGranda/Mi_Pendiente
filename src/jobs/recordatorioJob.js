const cron = require("node-cron");

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_KEY
);

const { enviarRecordatorio, enviarVencidas } = require("../services/emailServices");

const iniciarRecordatorioJob = () => {
    cron.schedule("0 8 * * *", async () => {
        const hoy = new Date();
        const { data: preferencias, error } = await supabase
            .from("preferencias")
            .select("user_id, nombre, dias_anticipacion, email")
            .not("dias_anticipacion", "is", null);

        if (error || !preferencias?.length) return;

        for (const pref of preferencias) {
            const diasAntes = pref.dias_anticipacion;
            const fechaLimite = new Date(hoy);
            fechaLimite.setDate(hoy.getDate() + diasAntes);
            const fechaStr = fechaLimite.toISOString().split("T")[0];

            const { data: tareas } = await supabase
                .from("tareas")
                .select("descripcion, fecha_entrega")
                .eq("user_id", pref.user_id)
                .eq("completada", false)
                .eq("fecha_entrega", fechaStr);

            if (!tareas?.length) continue;
            if (!pref.email) continue;

            await enviarRecordatorio(pref.email, pref.nombre, tareas);
        }
    });

    cron.schedule("0 9 * * *", async () => {
        const hoy = new Date();
        const fechaStr = hoy.toISOString().split("T")[0];

        const { data: preferencias, error } = await supabase
        .from("preferencias")
        .select("user_id, nombre, email")
        .not("email", "is", null);

        if(error || !preferencias?.length) return;

        for(const pref of preferencias){
            const { data: tareas } = await supabase
            .from("tareas")
            .select("descripcion, fecha_entrega")
            .eq("user_id", pref.user_id)
            .eq("completada", false)
            .eq("fecha_entrega", fechaStr);

            if(!tareas?.length) continue;
            if(!pref.email) continue;

            await enviarVencidas(pref.email, pref.nombre, tareas);
        }
    });
}



module.exports = { iniciarRecordatorioJob };