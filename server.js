/* eslint-disable no-console */
import zmq from 'zeromq';
import colors from 'colors';
import { StringDecoder } from 'string_decoder';
import { pub, sub } from './helpers/command-line-args.helper';

const decode = new StringDecoder('utf-8');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/Users.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('\nConnected to the database successfully!\n');
});

(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS users(user_id INTEGER PRIMARY KEY NOT NULL UNIQUE, \
          email TEXT, \
          passw TEXT)',
  );
})();

db.serialize(() => {
  db.each(
    `SELECT user_id as user_id,
                  email as email
            FROM users`,
    (err, row) => {
      if (err) {
        console.log(err.message);
      }
      console.log('List of Users in DB: ' + row.user_id + ' ' + row.email + '\n');
    },
  );
});

const sockPub = zmq.socket('pub');
const sockSub = zmq.socket('sub');

sockPub.bindSync(`tcp://127.0.0.1:${pub}`);
console.log(`Publisher bound to port ${pub}!`.yellow);

sockSub.bindSync(`tcp://127.0.0.1:${sub}`);
console.log(`Subscriber bound to port ${sub}!`.yellow);

sockSub.on('message', (topic, message) => {
  const data = JSON.parse(decode.write(message));
  let msg = {};
  console.log(
    '\nreceived a message related to:',
    decode.write(topic).blue,
    'containing message:',
    data,
  );
  if (data.type === 'login') {
    if (!data.email.length || !data.pwd.length) {
      msg = {
        msg_id: data.msg_id,
        status: 'error',
        error: 'WRONG_FORMAT',
      };
      sockPub.send(['api_out', JSON.stringify(msg)]);
    } else {
      db.all(
        `SELECT * FROM users WHERE email='${data.email}' AND passw='${data.pwd}'`,
        [],
        (err, res) => {
          if (err) {
            console.log(err.message);
          }
          if (!res.length) {
            msg = {
              msg_id: data.msg_id,
              status: 'error',
              error: 'WRONG_PWD',
            };
            sockPub.send(['api_out', JSON.stringify(msg)]);
          } else {
            msg = {
              msg_id: data.msg_id,
              user_id: res[0].user_id,
              status: 'ok',
            };
            sockPub.send(['api_out', JSON.stringify(msg)]);
          }
        },
      );
    }
  }
});

sockSub.subscribe('api_in');
