// https://stackoverflow.com/questions/46227783/encoding-not-recognized-in-jest-js
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const request = require('supertest');

const { 
    getTeacherRef,
    getStudentRef,
    getMentionedEmails
} = require('../services');

const TEACHER = {
    EXIST: 'teacher@example.com',
    NOT_EXIST: 'newTeacher@example.com'
}

const STUDENT = {
    EXIST: 'student@test.com',
    NOT_EXIST: 'newStudent@test.com'
}

const mockDb = {
    Teacher: {
        findOne: ({where}) => {
            const { email } = where;
            switch(email){
                case TEACHER.EXIST:
                    return { email: TEACHER.EXIST };
                case TEACHER.NOT_EXIST:
                    return null;
                default:
                    return null;
            }
        },
        create: jest.fn(({email}) => {
            return { email };
        })
    }, 
    Student: {
        findOne: ({where}) => {
            const { email } = where;
            switch(email){
                case STUDENT.EXIST:
                    return { email: STUDENT.EXIST };
                case STUDENT.NOT_EXIST:
                    return null;
                default:
                    return null;
            }
        },
        create: jest.fn(({email}) => {
            return { email };
        })
    }
}

describe('Services Tests', () => {
    describe('getTeacherRef', async() => {
        test('existing email', async() => {
            const teacher = await getTeacherRef(mockDb, TEACHER.EXIST);
            expect(mockDb.Teacher.create).toBeCalledTimes(0);
            expect(teacher.email).toEqual(TEACHER.EXIST);
        });

        test('new email', async() => {
            const teacher = await getTeacherRef(mockDb, TEACHER.NOT_EXIST);
            expect(mockDb.Teacher.create).toBeCalledTimes(1);
            expect(teacher.email).toEqual(TEACHER.NOT_EXIST)
        })
    })
    
    describe('getStudentRef', async() => {
        test('existing email', async() => {
            const student = await getStudentRef(mockDb, STUDENT.EXIST);
            expect(mockDb.Student.create).toBeCalledTimes(0);
            expect(student.email).toEqual(STUDENT.EXIST);
        });

        test('new email', async() => {
            const student = await getStudentRef(mockDb, STUDENT.NOT_EXIST);
            expect(mockDb.Student.create).toBeCalledTimes(1);
            expect(student.email).toEqual(STUDENT.NOT_EXIST)
        })
    })

    describe('getMentionedEmail', async() => {
        test('retrive mentioned emails from message text', async() => {
            const mentionedEmails =  
                getMentionedEmails("Hello students! @studentagnes@example.com @studentmiche@example.com");
            const correctEmails = ['studentagnes@example.com', 'studentmiche@example.com'];
            expect(mentionedEmails).toEqual(correctEmails);
        });
    });
});