const addNewMemberValidation = (req) => {
    const { client_id, first_name, last_name, email, designation } = req.body;

    if (!client_id) return resolve({ error: { message: "client_id required.", error: true }, status: 400 })
    if (!first_name) return resolve({ error: { message: "first_name required.", error: true }, status: 400 })
    if (!last_name) return resolve({ error: { message: "last_name required.", error: true }, status: 400 })
    if (!email) return resolve({ error: { message: "email required.", error: true }, status: 400 })
    if (!designation) return resolve({ error: { message: "designation required.", error: true }, status: 400 })

    return {};
}


const validations = {
    addNewMemberValidation
}

export default validations;
