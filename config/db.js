const Sequelize = require('sequelize');
const env = require('./env');
const sequelize = new Sequelize(env.MYSQL_DATABASE, env.MYSQL_USER, env.MYSQL_PASSWORD, {
  host: env.HOST,
  dialect: env.DIALECT,
  operatorsAliases: false,
  pool: env.POOL,
});

// Connect all the models/tables in the database to a db object,
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.Teacher = require('../models/Teacher')(sequelize, Sequelize);
db.Student = require('../models/Student')(sequelize, Sequelize);

//Relations
db.Teacher.studentRelation = db.Teacher.belongsToMany(db.Student, { as: 'Students', through: 'teachers_students', foreignKey: 'teacherEmail', otherKey: 'studentEmail' });
db.Student.teacherRelation = db.Student.belongsToMany(db.Teacher, { as: 'Teachers', through: 'teachers_students', foreignKey: 'studentEmail', otherKey: 'teacherEmail' });

// Check DB 
//authenticate
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    //create
    sequelize.sync()
      .then(() => {
        console.log(`Database & tables created!`)
        // list tables
        sequelize.getQueryInterface().showAllSchemas().then((tableObj) => {
          console.log('// Tables in database','==========================');
          console.log(tableObj);
        })
        .catch((err) => {
          console.log('showAllSchemas ERROR',err);
        })
      })
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });





const checkDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync()
}



module.exports = db;