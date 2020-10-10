'use strict';

const ValidationContract = require('../validators/fluent-validator');
const Repository = require('../repositories/customer-repository');
const md5 = require('md5');
const emailService = require('../services/email-service');
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

    let contract = new ValidationContract();

    contract.hasMinLen(req.body.name, 3, 'O Nome deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');

    if (!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }
    
    try {
        await Repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ["user"]
        });

        emailService.send(req.body.email, 
                        'Bem vindo a Node Store', 
                        global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(201).send({message: 'Cliente cadastrado com sucesso.'});        
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição."
        });
    }
};

exports.authenticate = async(req, res, next) => {

    try {
        const customer = await Repository.authenticate({
                email: req.body.email,
                password: md5(req.body.password + global.SALT_KEY)
            });
        
        if(!customer){
            res.status(404).send({
                message:'Usuário ou senha inválido.'
            });
            return;
        }
        const token = await authService.generateToken({
                id: customer._id,
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            });

        res.status(201).send({
            token: token,
            data: {
                email:customer.email,
                name: customer.name
            }
            });        
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição."
        });
    }
};


exports.refreshToken = async(req, res, next) => {

    try {

        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await Repository.getById(data.id);
        
        if(!customer){
            res.status(404).send({
                message:'Cliente não encontrado.'
            });
            return;
        }
        const newToken = await authService.generateToken({
                id: customer._id,
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            });

        res.status(201).send({
                token: newToken,
                data: {
                    email:customer.email,
                    name: customer.name
                }
            });        
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição."
        });
    }
};
