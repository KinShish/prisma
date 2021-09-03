const Joi = require('joi');
const shemIdCat=Joi.object({id:Joi.number().integer().min(0).required()}).label('IdCat')
schemaArrayCatId=Joi.object({
    array_id_cat:Joi.array().items(
        Joi.number().integer().min(1).required(),
    ).required()
}).label('ArrayCatId')
module.exports={shemIdCat,schemaArrayCatId}