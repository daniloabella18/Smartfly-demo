'use strict';

const AWS = require('aws-sdk');
const SES = new AWS.SES();

exports.sendCustomEmail = async event => {

  const { to, from, subject, html } = event.body;

  if (!to || !from || !subject || !html) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'to, from, subject and text are all required in the body' }, null, 2),
    };
  }

  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html
        },
      },
      Subject: { Data: subject },
    },
    Source: from,
  };

  try {
    await SES.sendEmail(params).promise();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'mensaje enviado!!' }, null, 2),
    };
  } catch (error) {
    console.log('error sending email ', error);
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'The email failed to send' }, null, 2),
    };
  }
};