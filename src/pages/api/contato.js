import Cors from "cors";

import sgMail from "@sendgrid/mail";

const { SENDGRID_API_KEY, FROM_EMAIL, TO_EMAIL, NEXT_PUBLIC_API_URL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

var whitelist = [NEXT_PUBLIC_API_URL];
var cors = Cors({
  methods: ["POST"],
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { name, email, message } = req.body;

  const msg = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: `Nova mensagem de ${name}`,
    html: `<p><strong>Nome: </strong>${name},</p>
    <p><strong>Email: </strong>${email}</p>
    <p><strong>Mensagem: </strong>${message}</p>`,
  };

  await sgMail.send(msg);

  res.status(200).json({ message: "Message sent!" });
  res.status(400).json({ message: "Error, Bad request!" });
  res.status(500).json({ message: "Error, Internal server error!" });
}
