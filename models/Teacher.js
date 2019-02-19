module.exports = (sequelize, Sequelize) => {  
    const Teacher = sequelize.define('teacher', {
      email: {
        primaryKey: true,
        type: Sequelize.STRING,
      }
    });
    return Teacher;
  };