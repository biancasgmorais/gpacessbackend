import * as Yup from 'yup';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import User from '../models/User';

const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(
  process.env.MAIL_CLIENTID,
  process.env.MAIL_CLIENTSECRET,
  ' https://developers.google.com/oauthplayground '
);

oauth2Client.setCredentials({
  refresh_token: process.env.MAIL_REFRESHTOKEN,
});

const accessToken = oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USER,
    clientId: process.env.MAIL_CLIENTID,
    clientSecret: process.env.MAIL_CLIENTSECRET,
    refreshToken: process.env.MAIL_REFRESHTOKEN,
    accessToken,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

class MailController {
  async lostpass(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' });
    }
    const userExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (!userExists) {
      return res.status(400).json({ error: 'Usuário não existente' });
    }
    if (!userExists.provider) {
      return res.status(400).json({ error: 'Usuário não é coordenador' });
    }

    const password = Math.random().toString(36).substr(2, 8);

    /** Configuração email */

    const mail = await transporter.sendMail({
      subject: 'Esqueci a senha - SISTEMA GPACESS',
      from: 'Equipe GPACESS <gpacess.gpsics@gmail.com>',
      to: [`${userExists.email}`, 'gpacess.gpsics@gmail.com'],
      html: `
      <html>
      <body>
        <strong>EQUIPE GPACESS - REDIFINIÇÃO DE SENHA</strong></br>
        <p>Olá, houve um pedido de redefinição de senha, sua nova senha é: ${password}</p>
      </body>
    </html>
      `,
    });

    /** Fim da configuração do email */

    await userExists.update({ ...req.body, password });

    return res.json({ mail });
  }
}

export default new MailController();
