import { Router } from 'express'
const authRouter  = require('./userAuth.js')
const user  = require('./user.js')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

router.use('/auth', authRouter);
router.use('/user', user);

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
