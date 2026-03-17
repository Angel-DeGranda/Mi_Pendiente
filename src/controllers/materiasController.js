 const supabase = require("../config/supabaseClient");

 const getMaterias = async (req, res) => {
    const token = require.cookies.session;

    const {data: userData} = await supabase.getUser(token);

    const {data, error} = await supabase
    .from("materias")
    .select("*")
    .eq("user_id", userData.user.id);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json(data);
 }

 const createMateria = async (req, res) => {
    const {nombre, dias_clase} = res.body;
    
    const {data: userData} = await supabase.auth.getUser(token);
    
    const {data, error} = await supabase
    .from("materias")
    .insert([{nombre, dias_clase, user_id: userData.user.id}])
    .select();

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(201).json(data[0]);
 }

 const editMateria = async (req, res) => {
    const {id} = req.params;

    const {nombre, dias_clase} = req.body;

    const{data, error} = await supabase
    .from("materias")
    .update({nombre, dias_clase})
    .eq("id", id)
    .select();
    
    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json(data[0]);
 }

 const deleteMateria = async (req, res) => {
    const {id} = res.params;

    const {error} = await supabase
    .from("materias")
    .delete()
    .eq("id", id);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: "Materia eliminada"});
 }

 module.exports = {getMaterias, createMateria, editMateria, deleteMateria};