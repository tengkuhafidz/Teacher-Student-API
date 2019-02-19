const { registerStudentsToTeacher, getCommonStudents, suspendStudent, getRecepients } = require('../services');


module.exports = ({ mainRouter, db, bodyParser }) => {
  // POST register students to a teacher
  mainRouter.post('/register', bodyParser, async (ctx, next) => {
    // reatrieve body data
    const teacherEmail = ctx.request.body.teacher;
    const studentEmails = ctx.request.body.students;
    await registerStudentsToTeacher(db, teacherEmail, studentEmails);

    ctx.status = 204;
    await next();
  });

  // GET common students to a list of teachers
  mainRouter.get('/commonstudents', bodyParser, async (ctx, next) => {
    // retrieve all teachers from url query string
    const teachers = ctx.query.teacher;
    try {
      const students = await getCommonStudents(db, teachers);

      ctx.body = { 
        students
      }
    } catch (e) {
      if(e.message = 'Cannot read property \'getStudents\' of null') {
        ctx.status = 400;
        ctx.body = {
          message: 'One or more teachers do not exist'
        }
      }
    }
    await next();
  });

  // POST suspend a student
  mainRouter.post('/suspend', bodyParser, async (ctx, next) => {
    // retrieve student email from body
    const studentEmail = ctx.request.body.student;
    // suspend the student
    const updatedRows = await suspendStudent(db, studentEmail);
    console.log('updatedRows', updatedRows[0])
    if(updatedRows[0] !== 0) {
      ctx.status = 204;
    } else {
      ctx.status = 400;
      ctx.body = {
        message: 'Student does not exist'
      }
    }
    await next();
  });

  //POST retrieve list of notification-receiving students
  mainRouter.post('/retrievefornotifications', bodyParser, async (ctx, next) => {
    // reatrieve body data
    const teacherEmail = ctx.request.body.teacher;
    const notificationMessage = ctx.request.body.notification;
    try {
      // retrieve notification recepients
      const recepients = await getRecepients(db, teacherEmail, notificationMessage);

      ctx.body = { 
        recepients
      }
    } catch(e) {
      if(e.message = 'Cannot read property \'getStudents\' of null') {
        ctx.status = 400;
        ctx.body = {
          message: 'Teacher does not exist'
        }
      }
    }
    await next();
  });
};