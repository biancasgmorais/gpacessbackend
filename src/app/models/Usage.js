import Sequelize, { Model } from 'sequelize';

class Usage extends Model {
  static init(sequelize) {
    super.init(
      {
        dateusage: Sequelize.STRING,
        hourusage: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'tag_user',
      as: 'tag',
    });
    this.belongsTo(models.User, {
      foreignKey: 'name_user',
      as: 'name',
    });
  }
}

export default Usage;
