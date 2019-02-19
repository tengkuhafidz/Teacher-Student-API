module.exports = ({ teacherRouter, db, bodyParser }) => {
  // GET all teachers
  teacherRouter.get('/', bodyParser, async ctx => {
    const teachers = await db.Teacher.findAll({
      include: [db.Teacher.studentRelation]
  })
    ctx.body = {
      teachers
    }
  });

  // GET teacher by email
  teacherRouter.get('/:email', bodyParser, async ctx => {
    const teacher = await db.Teacher.findOne({
      where: {
        email: ctx.params.email
      },
      include: [db.Teacher.studentRelation]
  })
    ctx.body = {
      teacher
    }
  });

  // POST single teacher
  teacherRouter.post('/', bodyParser, async ctx => {
    const email = await db.Teacher.create({email: ctx.request.body.email});
    ctx.body = {
      email
    }
  });

};