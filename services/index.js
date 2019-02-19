// Get teacher reference
//   > Find teacher by email
//   > if does not exist, create
const getTeacherRef = async (db, teacherEmail) => {
    let teacher = await db.Teacher.findOne({
        where: {
          email: teacherEmail
        }
      });
    // create if teacher does not exist
    if(!teacher) {
      teacher = await db.Teacher.create({email: teacherEmail});
    }
    return teacher;
} 

// Get student reference
//   > Find student by email
//   > if does not exist, create
const getStudentRef = async (db, studentEmail) => {
    let student = await db.Student.findOne({
        where: {
          email: studentEmail
        }
      });
    // create if teacher does not exist
    if(!student) {
        student = await db.Student.create({email: studentEmail});
    }
    return student;
} 

// Register students to a teacher 
//  > get teacher reference
//  > loop through student emails
//  > get student reference 
//  > associate student to teacher
const registerStudentsToTeacher = async (db, teacherEmail, studentEmails) => {
    // get the teacher
    const teacher = await getTeacherRef(db, teacherEmail);
    // loop through studentsEmails
    studentEmails.map(async studentEmail => {
      // get the student
      const student = await getStudentRef(db, studentEmail);
      // associate student with teacher
      teacher.addStudent(student);
    })
}

// Get student emails associated with a particular teacher
//   > Find teacher by email
//   > get all students under the teacher
const getTeacherStudents = async(db, teacherEmail) => {
    console.log('getTeacherStudents: ', teacherEmail)
    const studentEmails = [];
    const teacher = await db.Teacher.findOne({
        where: {
          email: teacherEmail
        }
      });
      // Get all students associated to the teacher
      const teacherStudents = await teacher.getStudents();
      teacherStudents.map(student => studentEmails.push(student.email))
      return studentEmails;
}

// Get student emails associated with listedteachers
//   > if one teacher, getTeacherStudents()
//   > if many teachers, loop through teachers and get common students 
const getCommonStudents = async(db, teachers) => {
    let students;
    // if only one teacher, list all of the students under the teacher
    if (!Array.isArray(teachers)) {
        // Get all students associated to the teacher
        students = await getTeacherStudents(db, teachers);
    } else {

        for(let i = 1; i < teachers.length; i++) {
            const currentTeacherStudentEmails = await getTeacherStudents(db, teachers[i]);
            console.log('!currentTeacherStudents:', currentTeacherStudentEmails);
            const previousTeacherStudentEmails = await getTeacherStudents(db, teachers[i-1]);
            console.log('!previousTeacherStudents:', previousTeacherStudentEmails);

            students = currentTeacherStudentEmails.filter(email => previousTeacherStudentEmails.includes(email));
        }
    }
    return students;
}

// Suspend a student (based on its email)
const suspendStudent = async (db, studentEmail) => {
    const student = await db.Student.update({isSuspended: true}, 
        {
          where: {
            email: studentEmail
          } 
        });
    return student;
}

// Get emails that were mentioned in message
//  > retrieve words starting with @
//  > remove @ from word
const getMentionedEmails = notificationMessage => {
    mentions = notificationMessage.match(/@\S+/g);
    //remove @ from the mention to get correctemail
    const mentionedEmails = mentions.map(mention => mention.substring(1))
    return mentionedEmails;
}

// Get valid non-suspended student emails from email list
//  > loop through student emails
//  > find each student according to the email
//  > check if student is suspended
//  > if not suspended, push email to recepient list
const getValidNonSuspended = async (db, mergedEmails) => {
    const nonSuspendedEmails = [];

    for(let i = 0; i < mergedEmails.length; i++) {
        const student = await db.Student.findOne({
            where: {
              email: mergedEmails[i]
            }
          });
          if(student && !student.isSuspended) nonSuspendedEmails.push(student.email);
    }
    return nonSuspendedEmails;
}

// Get notification recepients
//  > get students registered with the teacher --- getTeacherStudents()
//  > get students whose emails are mentioned, and not registered under the teacher
//  > filter out students who is Suspended
const getRecepients = async(db, teacherEmail, notificationMessage) => {
    const teacherStudentEmails = await getTeacherStudents(db, teacherEmail);
    const mentionedEmails = await getMentionedEmails(notificationMessage);
    const mergedEmails = [...new Set([...mentionedEmails ,...teacherStudentEmails])];
    const validNonSuspendedStudents = await getValidNonSuspended(db, mergedEmails);
    return validNonSuspendedStudents;
}

module.exports = { 
  registerStudentsToTeacher, 
  getCommonStudents, 
  suspendStudent, 
  getRecepients,
  getTeacherRef,
  getStudentRef,
  getMentionedEmails
};