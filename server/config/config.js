/////
///
// puerto
process.env.PORT = process.env.PORT || 3000;
//////
////
// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//////
////
// vencimiento del token 
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//////
////
// seed autenticacion
process.env.SEED = process.env.SEE || 'este-es-el-seed-desarrollo'; // todo esto se manda como variable a heroku
//////
////
// base de datos
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;
//////
////
//Google client id
process.env.CLIENT_ID = process.env.CLIENT_ID || '616130708010-mhbd718bek2rs4plt4io0neq5lkursg7.apps.googleusercontent.com';