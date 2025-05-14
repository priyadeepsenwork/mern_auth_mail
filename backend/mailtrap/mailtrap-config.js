import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // This is the correct path
import { MailtrapClient } from "mailtrap";

console.log(process.env.MAILTRAP_TOKEN)
import {token_key as TOKEN } from './mailtrap_token_key.js'
console.log(TOKEN())

const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "work.priyadeepsen@gmail.com",
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);