'use strict'

const { sendgridKey } = require('../config');
var config = require('../config');
var sendGrid = require('sendgrid')(config.sendgridKey);

exports.send = async(to, subject, body) =>{
    sendGrid.send({
        to: to,
        from: config.emailNodeStore,
        subject: subject,
        html: body
    })
}