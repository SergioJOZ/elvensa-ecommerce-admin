import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

/*INCOMPLETO, ARREGLAR SUBIDA DE IMAGENES*/
export default async function handle(req, res) {
  await mongooseConnect();

  const form = new multiparty.Form();

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
  console.log(files.file.length)
  res.json("OK")
  /*
  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    const newFilename = Date.now() + "." + ext;
    links.push(link);
  }

  return res.json([links]);
  */
}


export const config = {
  api: {bodyParser: false}
}