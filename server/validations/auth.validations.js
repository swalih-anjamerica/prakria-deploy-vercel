import validator from "validator";

const doLogin = (req) => {
    const { email, password } = req.body;
    if (!email || !password) return { error: "Email and Password required", status: 400 };
    if (!validator.isEmail(email.trim())) return { error: "Invalid email", status: 400 };

    req.body.email = email.trim();
    return {};
}

const validaitons = {
    doLogin
}

export default validaitons;