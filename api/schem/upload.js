const Joi = require('joi');
const shemIdCat=Joi.object({id:Joi.number().integer().min(0).required()}).label('IdCat')
uploadFiles=Joi.object({
    files: Joi.any()
}).label('uploadFiles')
configUpload=Joi.object({
    json: Joi.any()
}).label('configUpload')
module.exports={uploadFiles,configUpload}