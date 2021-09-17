import dotenv from "dotenv";
const enviroment = process.env.NODE_ENV || "local";
let path = `${__dirname}.env.${enviroment}`;
dotenv.config({ path: path });

export const configVars = {
  apiPayu: process.env.REACT_APP_APIKEY_PAYU,
  merchantIdPayu: process.env.REACT_APP_MERCHANDID_PAYU,
};
