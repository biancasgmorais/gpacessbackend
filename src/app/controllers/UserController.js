import * as Yup from 'yup';
import User from '../models/User';
import TempTag from '../models/TempTag';

class UserController {
  async storeAdm(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const userExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    await User.create({ ...req.body, provider: true });

    return res.json('usuário criado com sucesso');
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const userExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    await User.create(req.body);

    return res.json('usuário criado com sucesso');
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      tag: Yup.string().required(),
      email: Yup.string().email().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dado(s) invalido(s)' });
    }
    const userExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (!userExists) {
      return res.status(400).json({ error: 'Usuário não existente.' });
    }
    await userExists.update(req.body);

    return res.json('Usuário atualizado!');
  }

  async updateTag(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      tag: Yup.string().required(),
      email: Yup.string().email().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dado(s) invalido(s)' });
    }
    const userExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (!userExists) {
      return res.status(400).json({ error: 'Usuário não existente.' });
    }
    await userExists.update(req.body);

    const tagExists2 = await TempTag.findOne({
      where: { tag_temp: req.body.tag },
    });
    if (!tagExists2) {
      return res
        .status(401)
        .json({ error: 'Tag não existente, exclusão não liberado' });
    }
    await tagExists2.destroy();

    return res.json('Usuário atualizado!');
  }

  async updatesenha(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email != user.email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res.status(400).json({ error: 'User already exist' });
      }
    }
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    await user.update(req.body);
    return res.json('Atualização feita com sucesso!');
  }

  async index(req, res) {
    const allusers = await User.findAll({
      attributes: ['id', 'name', 'email', 'tag'],
    });

    return res.json(allusers);
  }

  async delete(req, res) {
    const { userId } = req.params;
    const finduser = await User.findByPk(userId);
    await finduser.destroy();
    return res.json('Perfil excluido com sucesso');
  }
}
export default new UserController();
