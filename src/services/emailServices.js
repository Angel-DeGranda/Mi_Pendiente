const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarRecordatorio = async (destinatario, nombre, tareas) => {
    const listaTareas = tareas.map(t =>
        `<li><strong>${t.descripcion}</strong> - entrega: ${new Date(t.fecha_entrega + "T00:00:00").toLocaleDateString("es-MX", {day: "numeric", month: "long"})}</li>`
    ).join("");

    await transporter.sendMail({
        from: `"Mi Pendiente" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: "Tienes tareas próximas a vencer",
        html: `
            <h2>${nombre}, tienes tareas próximas:</h2>
            <ul>${listaTareas}</ul>
        `
    });

}

const enviarVencidas = async (destinatario, nombre, tareas) => {
    const listaTareas = tareas.map(t => `
        <li><strong>${t.descripcion}</strong></li>
        `).join("");

        await transporter.sendMail({
            from: `"Mi Pendiente" <${process.env.EMAIL_USER}>`,
            to: destinatario,
            subject: "Tienes tareas vencidas sin completar",
            html:`
                <h2>${nombre}, estas tareas vencieron hoy y no estan completadas:</h2>
                <ul>${listaTareas}</ul>
            `
        });
}

module.exports = {enviarRecordatorio, enviarVencidas};