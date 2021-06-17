module.exports = function(req, res, next) {
    const { email, name, password } = req.body;

    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    let errors = {}
    if (req.path === "/register") {
        if (![email, name, password].every(Boolean)) {
            if(!email){
                errors.email = "Missing email"
            }
            if(!name){
                errors.name = "Missing name"
            }
            if(!password){
                errors.password = "Missing password"
            }
            return res.status(401).json(errors);
        } else if (!validEmail(email)) {
            errors.email = "Invalid email"
            return res.status(401).json(errors);
        }
    } else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {

            if(!email){
                errors.email = "Missing email"
            }

            if(!password){
                errors.password = "Missing password"
            }

            return res.status(401).json(errors);
        } else if (!validEmail(email)) {
            errors.email = "Invalid email"
            return res.status(401).json(errors);
        }
    }

    next();
};