module.exports = (sequelize, Sequelize) => {  
    const Student = sequelize.define('student', {
      email: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      isSuspended: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
    });
    return Student;
  };