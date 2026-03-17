const supabase = require("../config/supabaseClient");

const verificarSesion = async (req, res, next) => {
    const token = req.cookies.session;

    if(!token){
        return res.status(401).redirect("/");
    }

    const {data, error} = await supabase.auth.getUser(token);

    if(error || !data.user){
        return res.status(401).redirect("/");
    }

    next();
}

module.exports = {verificarSesion};