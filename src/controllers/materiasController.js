 const getMaterias = async (req, res) => {

    const {data, error} = await req.supabase
    .from("materias")
    .select("*")
    .eq("user_id", req.user.id);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json(data);
 }

 const createMateria = async (req, res) => {
    const {nombre, dias_clase} = req.body;
    
    const {data, error} = await req.supabase
    .from("materias")
    .insert([{nombre, dias_clase, user_id: req.user.id}])
    .select();

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(201).json(data[0]);
 }

 const editMateria = async (req, res) => {
    const {id} = req.params;

    const {nombre, dias_clase} = req.body;

    const{data, error} = await req.supabase
    .from("materias")
    .update({nombre, dias_clase})
    .eq("id", id)
    .eq("user_id", req.user.id)
    .select();
    
    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json(data[0]);
 }

 const deleteMateria = async (req, res) => {
    const {id} = req.params;

    const {error} = await req.supabase
    .from("materias")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: "Materia eliminada"});
 }

 module.exports = {getMaterias, createMateria, editMateria, deleteMateria};