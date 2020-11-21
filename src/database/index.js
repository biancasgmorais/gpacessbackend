import Sequelize from 'sequelize';

import User from '../app/models/User';
import Usage from '../app/models/Usage';
import TempTag from '../app/models/TempTag';

import databaseConfig from '../config/database';

const models = [User, Usage, TempTag];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}
export default new Database();
