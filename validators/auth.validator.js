const isLogedIn = (req, reply, next) => {
    if (!req.session.user) {
        return reply.code(401).send({ message: 'No Autorizado', redirectTo: '/Login' });
    }
    next();
}

const isAdmin = (req, reply, next) => {
    if (!req.session.user || req.session.user.role !== 1) {
        code(403).send('Acceso denegado');
        return reply.redirect('/api/v1/users');
    }
    next();
}

export {
    isLogedIn,
    isAdmin, 
}