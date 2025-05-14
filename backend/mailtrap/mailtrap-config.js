import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // This is the correct path
import { MailtrapClient } from "mailtrap";

//console.log(process.env.MAILTRAP_TOKEN)
import {token_key as TOKEN } from './mailtrap_token_key.js'
//console.log(TOKEN())

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN || TOKEN()
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Priyadeep_Mailtrap",
};