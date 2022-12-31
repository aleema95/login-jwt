import { Router } from 'express'
const authRouter  = require('./userAuth.js')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

router.use('/auth', authRouter);

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
