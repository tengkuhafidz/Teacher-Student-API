module.exports = ({ studentRouter, db, bodyParser }) => {
  // GET all teachers
  studentRouter.get('/', bodyParser, async ctx => {
    const students = await db.Student.findAll({
        include: [db.Student.teacherRelation]
    })
    ctx.body = {
        students
    }
  });

    // GET student by email
    studentRouter.get('/:email', bodyParser, async ctx => {
        const student = await db.Student.findOne({
          where: {
            email: ctx.params.email
          },
          include: [db.Student.teacherRelation]
      })
        ctx.body = {
            student
        }
      });

  // POST create a single student
  studentRouter.post('/', bodyParser, async ctx => {
    const student = await db.Student.create({email: ctx.request.body.email});
    ctx.body = {
        student
    }
  });

};