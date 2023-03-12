import sgMail from "@sendgrid/mail"

const { SENDGRID_API_KEY, FROM_EMAIL, TO_EMAIL } = process.env

sgMail.setApiKey(SENDGRID_API_KEY)

export default async function handler(req, res) {
  const { name, email, message } = req.body

  const msg = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: `Nova mensagem de ${name}`,
    html: `<p><strong>Nome: </strong>${name},</p>
    <p><strong>Email: </strong>${email}</p>
    <p><strong>Mensagem: </strong>${message}</p>`,
  }

  await sgMail.send(msg)

  res.status(200).json({ message: "Message sent!" })
}
