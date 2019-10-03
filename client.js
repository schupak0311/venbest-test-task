/* eslint-disable no-console */
import zmq from 'zeromq';
import uuid from 'uuidv4';
import colors from 'colors';
import readlinkSync from 'readline-sync';
import { pub, sub } from './helpers/command-line-args.helper';

const sockPub = zmq.socket('pub');
const sockSub = zmq.socket('sub');

sockPub.connect(`tcp://127.0.0.1:${sub}`);
console.log(`Publisher connected to port ${sub}!`.green);

sockSub.connect(`tcp://127.0.0.1:${pub}`);
console.log(`Subscriber connected to port ${pub}!`.green);

const email = readlinkSync.question('\nEmail: '.cyan);
const password = readlinkSync.question('Password: '.cyan);

const msg = {
  type: 'login',
  email: email,
  pwd: password,
  msg_id: uuid(),
};

sockPub.send(['api_in', JSON.stringify(msg)]);

sockSub.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  console.log(
    '\nreceived a message related to:',
    topic.toString().blue,
    'containing message:',
    data,
  );
  switch (data.status) {
    case 'error':
      console.log('\nError message: '.yellow + data.error.red);
      break;
    case 'ok':
      console.log('\nStatus: '.yellow + data.status.green);
      break;
    default:
      console.log('default');
  }
});

sockSub.subscribe('api_out');
