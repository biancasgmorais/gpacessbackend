import * as Yup from 'yup';

import User from '../models/User';
import Usage from '../models/Usage';
import TempTag from '../models/TempTag';

class UsageController {
  async store(req, res) {
    const schema = Yup.object().shape({
      tag_user: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const tagExists = await User.findOne({
      where: { tag: req.body.tag_user },
    });
    if (!tagExists) {
      return res
        .status(401)
        .json({ error: 'Tag não existente, acesso não liberado' });
    }

    const today = new Date().getTimezoneOffset();
    const dateusage = `${today.getUTCDate()}/${today.getUTCMonth()}/${today.getUTCFullYear()}`;
    const hourusage = `${today.getUTCHours()}:${today.getUTCMinutes()}:${today.getUTCSeconds()}`;
    const { name: name_user } = tagExists;

    await Usage.create({ ...req.body, name_user, dateusage, hourusage });

    return res.json('Acesso liberado');
  }

  async index(req, res) {
    const allusers = await Usage.findAll({
      attributes: ['id', 'name_user', 'tag_user', 'dateusage', 'hourusage'],
    });

    return res.json(allusers);
  }

  async tempstore(req, res) {
    const schema = Yup.object().shape({
      tag_temp: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const tagExists = await User.findOne({
      where: { tag: req.body.tag_temp },
    });
    if (tagExists) {
      return res
        .status(401)
        .json({ error: 'Tag existente, cadastro não liberado' });
    }

    const tagExists2 = await TempTag.findOne({
      where: { tag_temp: req.body.tag_temp },
    });
    if (tagExists2) {
      return res
        .status(401)
        .json({ error: 'Tag existente, cadastro não liberado' });
    }

    await TempTag.create({ ...req.body });

    const tagExists3 = await TempTag.findOne({
      where: { tag_temp: req.body.tag_temp },
    });
    if (!tagExists3) {
      return res
        .status(401)
        .json({ error: 'Tag nao existente, cadastro não liberado' });
    }

    async function meuRelogio() {
      await tagExists3.destroy();
    }

    setTimeout(meuRelogio, 60000);

    return res.json('Cadastro feito com sucesso');
  }

  async indexTemp(req, res) {
    const allusers = await TempTag.findAll({
      attributes: ['id', 'tag_temp'],
    });

    return res.json(allusers);
  }
}

export default new UsageController();
