const obtenerPreferencias = async (req, res) => {
    const { data, error } = await req.supabase
    .from("preferencias")
    .select("*")
    .eq("user_id", req.user.id)
    .single();

    if(error && error.code !== "PGRST116"){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json(data ?? null);
}

const actualizarPreferencias = async (req, res) => {
    const {nombre, saludo, dias_anticipacion, email} = req.body;

    const {data, error} = await req.supabase
    .from("preferencias")
    .upsert({user_id: req.user.id, nombre, saludo, dias_anticipacion, email}, {onConflict:"user_id"})
    .select()
    .single();

    if(error){
        return res.status(500).json({error: error.message})
    }

    return res.status(200).json(data);
}

module.exports = {obtenerPreferencias, actualizarPreferencias};