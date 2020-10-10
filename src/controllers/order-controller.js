'use strict';

const Repository = require('../repositories/order-repository');
const guide = require('guid');
const authService = require('../services/auth-service');

exports.get = async(req, res, next) => {
    try {
        var data = await Repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição."
        });
    }
}

exports.post = async(req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        let order = {
            customer: data.id,
            number: guide.raw().substring(0,6),
            items: req.body.items
        }
    
        await Repository.create(order);
        res.status(201).send({message: 'Pedido cadastrado com sucesso.'});        
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição."
        });
    }
};
