// "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d[^A-Za-z\\d]]{8,}$" (Este patrón es el que será utilizado para validar las contraseñas)
const registerSchema = {
    body: {
        type: 'object',
        required: ['name', 'lastName', 'email', 'password', 'confirmPassword'],
        properties: {
            name: { type: 'string', minLength: 1, maxLength: 25, pattern: "^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]+$" },
            lastName: { type: 'string', minLength: 5, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8, maxLength: 100, pattern: '^.{8,}$' }, // Patrón sencillo para desarrollo
        },
        additionalProperties: true,
    },
}

const loginSchema = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8, maxLength: 100 }
        },
        additionalProperties: false,
    },
}

const profilePatchSchema = { 
    body: {
        type: 'object',
        properties: {
            name: { type: 'string', minLength: 0, maxLength: 25, pattern: "^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]+$" },
            lastName: { type: 'string', minLength: 0, maxLength: 50 },
            phone_number: { type: 'string', pattern: "^\\+\\d{1,3}\\s?\\d{4,14}$" },
            birth_date: { type: 'string', format: 'date' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] },
            address: { type: 'string', minLength: 5, maxLength: 100 },
            postalCode: { type: 'string', pattern: '^\\d{4,5}$' },
            country: { type: 'string', minLength: 2, maxLength: 50 },
            city: { type: 'string', minLength: 2, maxLength: 50 },
            state: { type: 'string', minLength: 2, maxLength: 50 }
        },
        additionalProperties: false,
        minProperties: 1,
    }
}

export {
    registerSchema,
    loginSchema,
    profilePatchSchema
}