import dotenv from "dotenv";
const enviroment = process.env.NODE_ENV || "local";
let path = `${__dirname}.env.${enviroment}`;
dotenv.config({ path: path });
