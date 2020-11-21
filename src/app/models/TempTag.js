import Sequelize, { Model } from 'sequelize';

class TempTag extends Model {
  static init(sequelize) {
    super.init(
      {
        tag_temp: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default TempTag;
