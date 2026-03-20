const getTareas = async (req, res) => {
    const {completada} = req.query;

    const {data, error} = await req.supabase
    .from("tareas")
    .select("*, materias(nombre)")
    .eq("user_id", req.user.id)
    .eq("completada", completada ==="true")
    .order("fecha_entrega", {ascending: true});

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json(data);
}

const createTarea = async (req, res) => {
    const {materia_id, descripcion, prioridad, fecha_entrega, hora_entrega} = req.body;

    const {data, error} = await req.supabase
    .from("tareas")
    .insert([{materia_id, descripcion, prioridad, fecha_entrega, hora_entrega, user_id: req.user.id}])
    .select();

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(201).json(data[0]);
}

const editTarea = async (req, res) => {
    const {id} = req.params;
    const {materia_id, descripcion, prioridad, fecha_entrega, hora_entrega} = req.body;

    const {data, error} = await req.supabase
    .from("tareas")
    .update({materia_id, descripcion, prioridad, fecha_entrega, hora_entrega})
    .eq("id", id)
    .eq("user_id", req.user.id)
    .select();

    if(error){
        res.status(500).json({error: error.message});
    }

    return res.status(200).json(data[0]);
}

const deleteTarea = async (req, res) => {
    const {id} = req.params;

    const {error} = await req.supabase
    .from("tareas")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: "Tarea eliminada"});
}

const cambiarEstado = async (req, res) => {
    const {id} = req.params;
    const {completada, anotacion} = req.body;

    const {data, error} = await req.supabase
    .from("tareas")
    .update({completada, anotacion})
    .eq("id", id)
    .eq("user_id", req.user.id)
    .select();

    if(error){
        return res.status(500).json({error: error.message});
    }
    
    return res.status(200).json(data[0]);
}

module.exports = {getTareas, createTarea, editTarea, deleteTarea, cambiarEstado};