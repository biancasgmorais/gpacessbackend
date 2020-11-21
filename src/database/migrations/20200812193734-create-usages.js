module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('usages', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      dateusage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hourusage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tag_user: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_user: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('usages');
  },
};
