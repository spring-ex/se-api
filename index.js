'use strict';

//require statements
var express = require('express');
var app = express();
var authenticatedRoutes = express.Router();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');
var jwt = require('jsonwebtoken');


//controllers
var stateController = require('./controllers/StateController.js');
var universityController = require('./controllers/UniversityController.js');
var collegeController = require('./controllers/CollegeController.js');
var courseController = require('./controllers/CourseController.js');
var branchController = require('./controllers/BranchController.js');
var semesterController = require('./controllers/SemesterController.js');
var classController = require('./controllers/ClassController.js');
var subjectController = require('./controllers/SubjectController.js');
var studentController = require('./controllers/StudentController.js');
var attendanceController = require('./controllers/AttendanceController.js');
var assignmentController = require('./controllers/AssignmentController.js');
var testController = require('./controllers/TestController.js');
var userController = require('./controllers/UserController.js');
var roleController = require('./controllers/RoleController.js');
var statisticsController = require('./controllers/StatisticsController.js');
var passwordController = require('./controllers/PasswordController.js');
var eventController = require('./controllers/EventController.js');
var messagesController = require('./controllers/PersonalMessageController.js');
var enquiryController = require('./controllers/EnquiryController.js');
var genderController = require('./controllers/GenderController.js');
var expenseController = require('./controllers/ExpenseController.js');
var chapterController = require('./controllers/ChapterController.js');
var topicController = require('./controllers/TopicController.js');
var authenticateController = require('./controllers/AuthenticateController.js');
var lessonPlanController = require('./controllers/LessonPlanController.js');
var calendarController = require('./controllers/CalendarController.js');
var notificationController = require('./controllers/NotificationController.js');
var routeController = require('./controllers/RouteController.js');
var testCategoryController = require('./controllers/TestCategoryController.js');
var keywordController = require('./controllers/KeywordController.js');
var skillsAndYouController = require('./controllers/SkillsAndYouController.js');
var questionsController = require('./controllers/QuestionsController.js');
var optionsController = require('./controllers/OptionsController.js');
var smartTestController = require('./controllers/SmartTestController.js');
var indexStatisticsController = require('./controllers/IndexStatisticsController.js');
var subTopicController = require('./controllers/SubTopicController.js');
var libraryController = require('./controllers/LibraryController.js');
var specialSubjectController = require('./controllers/SpecialSubjectController.js');
var specialClassController = require('./controllers/SpecialClassController.js');
var installMetricsController = require('./controllers/InstallMetricsController.js');
var programOutcomeController = require('./controllers/ProgramOutcomeController.js');
var courseOutcomeController = require('./controllers/CourseOutcomeController.js');
var bloomsTaxonomyController = require('./controllers/BloomsTaxonomyController.js');
var criteriaController = require('./controllers/CriteriaController.js');
var newStatsController = require('./controllers/NewStatisticsController.js');
var tagsController = require('./controllers/TagsController.js');
var documentsController = require('./controllers/DocumentsController.js');
var feesController = require('./controllers/FeesController.js');
var receiptController = require('./controllers/ReceiptController.js');
var timetableController = require('./controllers/TimeTableController.js');

//use statements
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use('/secure', authenticatedRoutes);

//environment variables
var port = process.env.PORT || 5000;
process.env.SECRET_KEY = "findinbox";
process.env.STUDENT_APP_VERSION = "1.0.0";
process.env.FACULTY_APP_VERSION = "1.0.0";
process.env.ADMIN_APP_VERSION = "1.0.0";
process.env.AND_STUDENT_APP_VERSION = "1.0.0";
process.env.AND_FACULTY_APP_VERSION = "1.0.0";
process.env.AND_ADMIN_APP_VERSION = "1.0.0";

//authentication
authenticatedRoutes.use(function(req, res, next) {
    var token = req.body.token || req.headers['authorization'];
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function(err, decode) {
            if (err) {
                res.status(500).send("Invalid token");
            } else {
                next();
            }
        })
    } else {
        res.send("Please send token")
    }
});

//non-secured routes
app.get('/', function(req, res) {
    res.send('Findinbox, serving since 2016!!');
});

app.post('/login', authenticateController.login);
app.post('/studentLogin', authenticateController.studentLogin);
app.post('/parentLogin', authenticateController.parentLogin);
app.get('/student/checkRegistrationStatus/:FindInboxId', authenticateController.checkRegistrationStatus);
app.post('/student/register', authenticateController.registerStudent);
app.post('/verifyUniqueId', authenticateController.verifyUniqueId);

app.post('/addUserWithoutToken', userController.addUser);
app.post('/bulkAddUserWithoutToken', userController.bulkAddUserWithoutToken);
app.post('/addEnquiryWithoutToken', enquiryController.addEnquiryWithoutToken);
app.get('/getEventsWithoutToken/:CollegeId/:Year', eventController.getAllEvents);
app.get('/getEventImagesWithoutToken/:EventId', eventController.getEventImages);


//secured routes
authenticatedRoutes.route('/student/approve')
    .put(authenticateController.approveStudent);
authenticatedRoutes.route('/student/reject')
    .put(authenticateController.rejectStudent);
authenticatedRoutes.route('/student/getDeactivatedStudents/:CollegeId/:CourseId/:BranchId/:SemesterId/:ClassId')
    .get(authenticateController.getDeactivatedStudents);
authenticatedRoutes.route('/getShortURL')
    .post(authenticateController.getShortURL);
authenticatedRoutes.route('/getStudentForApplicationVerification/:StudentId')
    .get(authenticateController.getStudentForApplicationVerification);

authenticatedRoutes.route('/state')
    .get(stateController.getAllStates)
    .post(stateController.addState)
    .put(stateController.updateState)
    .delete(stateController.deleteState);

authenticatedRoutes.route('/university')
    .post(universityController.addUniversity)
    .put(universityController.updateUniversity)
    .delete(universityController.deleteUniversity);
authenticatedRoutes.route('/university/:StateId')
    .get(universityController.getAllUniversities);

authenticatedRoutes.route('/college')
    .get(collegeController.getAllColleges)
    .post(collegeController.addCollege)
    .put(collegeController.updateCollege)
    .delete(collegeController.deleteCollege);
authenticatedRoutes.route('/college/updatePackage')
    .put(collegeController.updatePackageForCollege);
authenticatedRoutes.route('/getFeesInformation')
    .post(collegeController.getFeesInfo);

authenticatedRoutes.route('/course')
    .get(courseController.getAllCourses)
    .post(courseController.addCourse)
    .put(courseController.updateCourse)
    .delete(courseController.deleteCourse);
authenticatedRoutes.route('/course/getAllByCollege/:CollegeId')
    .get(courseController.getCoursesByCollege);
authenticatedRoutes.route('/assignCoursesToCollege')
    .post(courseController.assignCoursesToCollege);

authenticatedRoutes.route('/branch')
    .post(branchController.addBranch)
    .put(branchController.updateBranch)
    .delete(branchController.deleteBranch);
authenticatedRoutes.route('/branch/getAll/:CourseId')
    .get(branchController.getAllBranches);
authenticatedRoutes.route('/branch/getAllByCourse/:CourseId/:CollegeId')
    .get(branchController.getBranchesByCourse);
authenticatedRoutes.route('/branch/getAllByCollege/:CollegeId')
    .get(branchController.getBranchesByCollege);
authenticatedRoutes.route('/assignBranchesToCollege')
    .post(branchController.assignBranchesToCollege);
authenticatedRoutes.route('/getAllBranchesForUser/:UserId')
    .get(branchController.getAllBranchesForUser);

authenticatedRoutes.route('/semester')
    .get(semesterController.getAllSemesters)
    .post(semesterController.assignSemester)
    .put(semesterController.updateSemester)
    .delete(semesterController.deleteSemester);
authenticatedRoutes.route('/semester/getAllByBranch/:BranchId/:CollegeId/:CourseId/:UniversityId/:StateId')
    .get(semesterController.getSemestersByBranch);
authenticatedRoutes.route('/semester/getAllByBranchAndCourse/:BranchId/:CourseId')
    .get(semesterController.getSemestersByBranchAndCourse);

authenticatedRoutes.route('/class')
    .get(classController.getAllClasses)
    .post(classController.addClasses)
    .put(classController.updateClass)
    .delete(classController.deleteClass);
authenticatedRoutes.route('/class/getAllBySemester/:BranchId/:SemesterId/:CollegeId/:CourseId/:UniversityId/:StateId')
    .get(classController.getClassesBySemester);
authenticatedRoutes.route('/class/getAllBySubject/:SubjectId/:UserId/:IsElective')
    .get(classController.getClassesBySubject);
authenticatedRoutes.route('/getClassById/:ClassId')
    .get(classController.getClassById)

authenticatedRoutes.route('/subject')
    .get(subjectController.getAllSubjects)
    .post(subjectController.addSubject)
    .put(subjectController.updateSubject)
    .delete(subjectController.deleteSubject);
authenticatedRoutes.route('/subject/getAllBySemester/:CourseId/:BranchId/:SemesterId')
    .get(subjectController.getSubjectsBySemester);
authenticatedRoutes.route('/subject/getAllNonElectiveBySemester/:CourseId/:BranchId/:SemesterId')
    .get(subjectController.getNonElectiveSubjectsBySemester);
authenticatedRoutes.route('/subject/getAllBySemesterAndUser/:CourseId/:BranchId/:SemesterId/:UserId')
    .get(subjectController.getSubjectsBySemesterAndUser);
authenticatedRoutes.route('/subject/getAllBySemesterAndStudent/:CourseId/:BranchId/:SemesterId/:StudentId')
    .get(subjectController.getSubjectsBySemesterAndStudent);
authenticatedRoutes.route('/subject/getAllElectivesBySemester/:CourseId/:BranchId/:SemesterId')
    .get(subjectController.getElectiveSubjectsBySemester);
authenticatedRoutes.route('/subject/getAllBySemesterAndUser/:CourseId/:BranchId/:SemesterId/:UserId')
    .get(subjectController.getSubjectsBySemesterAndUser);
authenticatedRoutes.route('/subject/getAllBySemesterWithUserId/:CourseId/:BranchId/:SemesterId')
    .get(subjectController.getSubjectsWithUserId);
authenticatedRoutes.route('/subject/getAllByUser/:UserId')
    .get(subjectController.getSubjectsByUser);
authenticatedRoutes.route('/subject/getAllByCourseAndSem/:CourseId/:SemesterId')
    .get(subjectController.getSubjectsByCourseAndSem);

authenticatedRoutes.route('/specialSubject')
    .post(specialSubjectController.addSpecialSubject)
authenticatedRoutes.route('/linkSubjects')
    .post(specialSubjectController.linkSubjects)
authenticatedRoutes.route('/specialSubject/:CollegeId/:CourseId/:SemesterId')
    .get(specialSubjectController.getAllSpecialSubjects);

authenticatedRoutes.route('/specialClass')
    .post(specialClassController.addSpecialClass);
authenticatedRoutes.route('/specialClass/getAllBySpecialSubject/:SpecialSubjectId/:CollegeId')
    .get(specialClassController.getAllClassesForSubject);
authenticatedRoutes.route('/getAllStudentsInCourseAndSem/:CollegeId/:CourseId/:SemesterId')
    .get(specialClassController.getAllStudentsInCourseAndSem);
authenticatedRoutes.route('/getAllStudentsInSpecialClass/:SpecialClassId')
    .get(specialClassController.getAllStudentsInSpecialClass);

authenticatedRoutes.route('/student')
    .get(studentController.getAllStudents)
    .post(studentController.addStudent)
    .put(studentController.updateStudent)
    .delete(studentController.deleteStudent);
authenticatedRoutes.route('/student/getAllByCollege/:CollegeId')
    .get(studentController.getStudentsForCollege);
authenticatedRoutes.route('/student/getAllByRoute/:RouteId')
    .get(studentController.getStudentsByRoute);
authenticatedRoutes.route('/student/getById/:StudentId')
    .get(studentController.getStudentById);
authenticatedRoutes.route('/getStudentByPhoneNumber/:PhoneNumber/:CollegeId')
    .get(studentController.getStudentByPhoneNumber);
authenticatedRoutes.route('/student/getByClass/:CollegeId/:SubjectId/:ClassId/:IsElective')
    .get(studentController.getStudentsByClass);
authenticatedRoutes.route('/student/getAllByCourseBranchSem/:CollegeId/:CourseId/:BranchId/:SemesterId/:ClassId')
    .get(studentController.getAllStudentsByCourseBranchSem);
authenticatedRoutes.route('/student/getAllBySubject/:ClassId/:SubjectId')
    .get(studentController.getAllStudentsBySubject);
authenticatedRoutes.route('/assignStudentToSubject')
    .post(studentController.assignStudentToSubject);
authenticatedRoutes.route('/unAssignStudentFromSubject')
    .post(studentController.unAssignStudentFromSubject);
authenticatedRoutes.route('/assignStudentToElectiveSubject')
    .post(studentController.assignStudentToElectiveSubject);
authenticatedRoutes.route('/assignStudentsToSection')
    .put(studentController.assignStudentsToSection);
authenticatedRoutes.route('/student/getAllFeesCollected')
    .post(studentController.getAllFeesCollected);
authenticatedRoutes.route('/student/getAllFeesCollectedNew/:CollegeId')
    .get(studentController.getAllFeesCollectedNew);
authenticatedRoutes.route('/student/getDevelopmentFeesCollected/:CollegeId')
    .get(studentController.getDevelopmentFeesCollected);
authenticatedRoutes.route('/student/updatePhoneNumber')
    .put(studentController.updatePhoneNumber);
authenticatedRoutes.route('/student/updateDateOfBirth')
    .put(studentController.updateDateOfBirth);
authenticatedRoutes.route('/student/resetPassword')
    .put(studentController.resetPassword);
authenticatedRoutes.route('/updatePayment')
    .put(studentController.updatePayment);
authenticatedRoutes.route('/addPayment')
    .post(studentController.addPayment);
authenticatedRoutes.route('/deletePayment')
    .delete(studentController.deletePayment);
authenticatedRoutes.route('/studentBulkUpload')
    .post(studentController.studentBulkUpload);
authenticatedRoutes.route('/promoteStudents')
    .put(studentController.promoteStudents);
authenticatedRoutes.route('/getBalanceFeesforStudent')
    .post(studentController.getBalanceFeesforStudent);
authenticatedRoutes.route('/setTrialStartDate')
    .post(studentController.setTrialStartDate);

authenticatedRoutes.route('/getAttendanceByDateForSubject/:AttendanceDate/:SubjectId')
    .get(attendanceController.getAttendanceByDateForSubject);
authenticatedRoutes.route('/getAttendanceByDateForStudent/:AttendanceDate/:StudentId')
    .get(attendanceController.getAttendanceByDateForStudent);
authenticatedRoutes.route('/attendance/getAllByStudent/:StudentId/:SubjectId')
    .get(attendanceController.getAllAttendanceForStudent);
authenticatedRoutes.route('/getAttendanceForSubject')
    .post(attendanceController.getAttendanceForSubject);
authenticatedRoutes.route('/getDaysAttendance')
    .post(attendanceController.getDaysAttendance);
authenticatedRoutes.route('/getUniqueAttendanceDates')
    .post(attendanceController.getUniqueAttendanceDates);
authenticatedRoutes.route('/takeAttendance')
    .post(attendanceController.takeAttendance);
authenticatedRoutes.route('/takeSpecialAttendance')
    .post(attendanceController.takeSpecialAttendance);
authenticatedRoutes.route('/editAttendanceForStudent')
    .put(attendanceController.editAttendanceForStudent);
authenticatedRoutes.route('/deleteAttendance')
    .delete(attendanceController.deleteAttendance);
authenticatedRoutes.route('/deleteDaysAttendance')
    .delete(attendanceController.deleteDaysAttendance);
authenticatedRoutes.route('/addDaysAttendanceForStudent')
    .post(attendanceController.addDaysAttendanceForStudent);

authenticatedRoutes.route('/assignment')
    .post(assignmentController.addAssignment)
    .put(assignmentController.updateAssignment)
    .delete(assignmentController.deleteAssignment);
authenticatedRoutes.route('/assignment/new')
    .post(assignmentController.addAssignmentNew);
authenticatedRoutes.route('/assignment/getAllBySubject')
    .post(assignmentController.getAssignmentsBySubject);
authenticatedRoutes.route('/assignment/getAllByClass/:ClassId/:Year')
    .get(assignmentController.getAssignmentsByClass);
authenticatedRoutes.route('/assignment/getAllByClassAndStudent/:ClassId/:StudentId/:Year')
    .get(assignmentController.getAssignmentsByClassAndStudent);
authenticatedRoutes.route('/assignment/getAssignmentsByCollege/:CollegeId/:Year')
    .get(assignmentController.getAssignmentsByCollege);
authenticatedRoutes.route('/assignment/getImages/:AssignmentId')
    .get(assignmentController.getAssignmentImages);

authenticatedRoutes.route('/test')
    .post(testController.addTest)
    .put(testController.updateTest)
    .delete(testController.deleteTest);
authenticatedRoutes.route('/test/getAll')
    .post(testController.getAllTests);
authenticatedRoutes.route('/test/getMarksForSubject')
    .post(testController.getMarksBySubject)
authenticatedRoutes.route('/test/updateMarks')
    .put(testController.updateMarks);
authenticatedRoutes.route('/test/new')
    .post(testController.addTestNew);

authenticatedRoutes.route('/getAllTestCategories/:SubjectId')
    .get(testCategoryController.getAllCategories);
authenticatedRoutes.route('/assignCategoriesToSubject')
    .post(testCategoryController.assignToSubject);
authenticatedRoutes.route('/testCategory')
    .get(testCategoryController.getCategories)
    .post(testCategoryController.addTestCategories);

authenticatedRoutes.route('/user')
    .post(userController.addUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);
authenticatedRoutes.route('/user/getAllByCollege/:CollegeId')
    .get(userController.getUsersByCollege);
authenticatedRoutes.route('/user/getById/:UserId')
    .get(userController.getUserById);
authenticatedRoutes.route('/user/updateNew')
    .put(userController.updateUserNew);
authenticatedRoutes.route('/resetUserPassword')
    .put(userController.resetUserPassword)
    // new set for new web ui
authenticatedRoutes.route('/user/updateProfile')
    .put(userController.updateUserProfile);
authenticatedRoutes.route('/user/addSubjects')
    .post(userController.addSubjects);
authenticatedRoutes.route('/user/removeSubject')
    .delete(userController.removeSubject);
authenticatedRoutes.route('/user/addSpecialSubjects')
    .post(userController.addSpecialSubjects);
authenticatedRoutes.route('/user/removeSpecialSubject')
    .delete(userController.removeSpecialSubject);
authenticatedRoutes.route('/user/addEducation')
    .post(userController.addEducation);
authenticatedRoutes.route('/user/removeEducation')
    .delete(userController.removeEducation);
authenticatedRoutes.route('/user/addExperience')
    .post(userController.addExperience);
authenticatedRoutes.route('/user/removeExperience')
    .delete(userController.removeExperience);



authenticatedRoutes.route('/role')
    .get(roleController.getAllRoles)
    .post(roleController.addRole)
    .put(roleController.updateRole)
    .delete(roleController.deleteRole);
authenticatedRoutes.route('/package')
    .get(roleController.getAllPackages)

authenticatedRoutes.route('/event')
    .post(eventController.addEvent)
    .put(eventController.updateEvent)
    .delete(eventController.deleteEvent);
authenticatedRoutes.route('/event/getAllByCollege/:CollegeId/:Year')
    .get(eventController.getAllEvents);
authenticatedRoutes.route('/event/getImages/:EventId')
    .get(eventController.getEventImages);
authenticatedRoutes.route('/getEventsAndAssignments/:CollegeId/:ClassId')
    .get(eventController.getEventsAndAssignments);

authenticatedRoutes.route('/personalMessage')
    .post(messagesController.addMessage);
authenticatedRoutes.route('/personalMessage/getAllByStudent/:StudentId')
    .get(messagesController.getAllMessagesForStudent);

authenticatedRoutes.route('/enquiry')
    .post(enquiryController.addEnquiry)
    .delete(enquiryController.deleteEnquiry);
authenticatedRoutes.route('/enquiry/getAllByCollege/:CollegeId')
    .get(enquiryController.getAllEnquires);
authenticatedRoutes.route('/enquiry/getById/:EnquiryId')
    .get(enquiryController.getEnquiryById);
authenticatedRoutes.route('/enquiry/sendSms')
    .post(enquiryController.sendSms);
authenticatedRoutes.route('/enquiry')
    .put(enquiryController.updateEnquiry);
authenticatedRoutes.route('/deleteEnquiries')
    .delete(enquiryController.deleteEnquiries);
authenticatedRoutes.route('/changeEnquiryStatus')
    .put(enquiryController.changeEnquiryStatus);
authenticatedRoutes.route('/addBulkEnquiry')
    .post(enquiryController.addBulkEnquiry)

authenticatedRoutes.route('/expense')
    .post(expenseController.addExpense)
    .delete(expenseController.deleteExpense);
authenticatedRoutes.route('/expense/getAllByBranch')
    .post(expenseController.getAllExpenses);

authenticatedRoutes.route('/chapter')
    .post(chapterController.addChapters);
authenticatedRoutes.route('/chapter/getBySubject/:SubjectId')
    .get(chapterController.getChaptersBySubject);
authenticatedRoutes.route('/getChapterAndTopicsBySubject/:SubjectId/:IsElective')
    .get(chapterController.getChapterAndTopicsBySubject)
authenticatedRoutes.route('/editChapter')
    .put(chapterController.editChapter)

authenticatedRoutes.route('/topic')
    .get(topicController.getAllTopics)
    .post(topicController.addTopics);
authenticatedRoutes.route('/createTopicsAndAssignToChapter')
    .post(topicController.createTopicsAndAssignToChapter);
authenticatedRoutes.route('/topic/getAllBySubject/:SubjectId')
    .get(topicController.getTopicsForSubject);
authenticatedRoutes.route('/topic/getAllByChapter/:ChapterId')
    .get(topicController.getTopicsForChapter);
authenticatedRoutes.route('/topic/getAllByChapterWithPPT/:ChapterId/:UserId')
    .get(topicController.getTopicsForChapterWithPPT);
authenticatedRoutes.route('/getStudentLikeStatus/:StudentId/:TopicId')
    .get(topicController.getStudentLikeStatus);
authenticatedRoutes.route('/topic/assignToChapter')
    .post(topicController.assignToChapter);
authenticatedRoutes.route('/assignVideosToTopics')
    .post(topicController.assignVideosToTopics);
authenticatedRoutes.route('/assignQPToTopics')
    .post(topicController.assignQPToTopics);
authenticatedRoutes.route('/getTopicPresentationURL/:TopicId/:CollegeId/:ClassId')
    .get(topicController.getTopicPresentationURL)
authenticatedRoutes.route('/getTopicDefaultPresentation/:ChapterId/:TopicId')
    .get(topicController.getTopicDefaultPresentation)
authenticatedRoutes.route('/getTopicDefaultPresentationByChapter/:ChapterId')
    .get(topicController.getTopicDefaultPresentationByChapter)
authenticatedRoutes.route('/getAllTopicsForSmartTest/:SmartTestId')
    .get(topicController.getAllTopicsForSmartTest)
authenticatedRoutes.route('/getLikeStatsForTopic/:TopicId')
    .get(topicController.getLikeStatsForTopic);
authenticatedRoutes.route('/addPresentationToTopic')
    .post(topicController.addPresentationToTopic);
authenticatedRoutes.route('/addDefaultPresentationToTopic')
    .post(topicController.addDefaultPresentationToTopic);
authenticatedRoutes.route('/getCurrentSubjectTopicsForToday')
    .post(topicController.getCurrentSubjectTopicsForToday);
authenticatedRoutes.route('/editTopic')
    .put(topicController.editTopic);
authenticatedRoutes.route('/studentLikesTopic')
    .post(topicController.studentLikesTopic);
authenticatedRoutes.route('/studentRatesTopic')
    .post(topicController.studentRatesTopic);
authenticatedRoutes.route('/getRatingForTopics')
    .post(topicController.getRatingForTopics);
authenticatedRoutes.route('/getStudentRatingForTopic')
    .post(topicController.getStudentRatingForTopic);
authenticatedRoutes.route('/deleteTopic')
    .delete(topicController.deleteTopic);

authenticatedRoutes.route('/getAllSubTopics')
    .post(subTopicController.getAllSubTopics)
authenticatedRoutes.route('/addSubTopics')
    .post(subTopicController.addSubTopics);
authenticatedRoutes.route('/deleteSubTopic')
    .delete(subTopicController.deleteSubTopic);
authenticatedRoutes.route('/editSubTopic')
    .put(subTopicController.editSubTopic);

authenticatedRoutes.route('/gender')
    .get(genderController.getAllGenders)

authenticatedRoutes.route('/getLessonPlan')
    .post(lessonPlanController.getLessonPlan)
authenticatedRoutes.route('/getLessonPlanForSkill')
    .post(lessonPlanController.getLessonPlanForSkill)
authenticatedRoutes.route('/getLessonPlanForSmartTest')
    .post(lessonPlanController.getLessonPlanForSmartTest)
authenticatedRoutes.route('/topicTaught')
    .post(lessonPlanController.topicTaught)

authenticatedRoutes.route('/calendar')
    .post(calendarController.addCalendarEvent)
    .delete(calendarController.deleteCalendarEvent);
authenticatedRoutes.route('/calendar/getAllByCollege/:CollegeId')
    .get(calendarController.getAllCalendarEvents)

authenticatedRoutes.route('/feesNotification')
    .post(notificationController.feesNotification);
authenticatedRoutes.route('/notificationReminder')
    .post(notificationController.notificationReminder);
authenticatedRoutes.route('/customNotification')
    .post(notificationController.customNotification);
authenticatedRoutes.route('/getAllStudentNotifications/:StudentId')
    .get(notificationController.getAllStudentNotifications);
authenticatedRoutes.route('/broadcastNotification')
    .post(notificationController.broadcastNotification);

authenticatedRoutes.route('/getAllRoutes/:CollegeId')
    .get(routeController.getAllRoutes);
authenticatedRoutes.route('/route')
    .post(routeController.addRoute)
    .delete(routeController.deleteRoute);
authenticatedRoutes.route('/getRouteById/:RouteId')
    .get(routeController.getRouteById);
authenticatedRoutes.route('/updateRoute')
    .put(routeController.updateRoute);
authenticatedRoutes.route('/studentBoardsBus')
    .post(routeController.studentBoardsBus)
authenticatedRoutes.route('/studentLeavesBus')
    .post(routeController.studentLeavesBus)
authenticatedRoutes.route('/busReachedDestination')
    .post(routeController.busReachedDestination)

authenticatedRoutes.route('/getAllKeywords/:CollegeType')
    .get(keywordController.getAllKeywords);

authenticatedRoutes.route('/getObservationDetails')
    .post(skillsAndYouController.getObservationDetails);

authenticatedRoutes.route('/bookBulkUpload')
    .post(libraryController.bookBulkUpload);
authenticatedRoutes.route('/book')
    .post(libraryController.addBook)
    .put(libraryController.updateBook);
authenticatedRoutes.route('/getAvailableBooks/:CollegeId')
    .get(libraryController.getAllAvailableBooks);
authenticatedRoutes.route('/getBorrowedBooks/:CollegeId')
    .get(libraryController.getBorrowedBooks);
authenticatedRoutes.route('/getAllBooksByStudent/:StudentId')
    .get(libraryController.getAllBooksByStudent);
authenticatedRoutes.route('/getAllBooksHistory/:CollegeId')
    .get(libraryController.getAllBooksHistory);
authenticatedRoutes.route('/borrowBook')
    .post(libraryController.bookBorrow);
authenticatedRoutes.route('/returnBook')
    .delete(libraryController.returnBook);
authenticatedRoutes.route('/book')
    .delete(libraryController.deleteBook);

//statistics
authenticatedRoutes.route('/getMarksStatistics')
    .post(statisticsController.getMarksStatistics);
authenticatedRoutes.route('/getMarksStatisticsNew')
    .post(statisticsController.getMarksStatisticsNew);
authenticatedRoutes.route('/getMarksStatisticsForOBE')
    .post(statisticsController.getMarksStatisticsForOBE);
authenticatedRoutes.route('/getStudentMarksStatistics/:SubjectId/:ClassId/:StudentId')
    .get(statisticsController.getStudentMarksStatistics);
authenticatedRoutes.route('/getStudentMarksStatisticsNew/:SubjectId/:ClassId/:StudentId')
    .get(statisticsController.getStudentMarksStatisticsNew);
authenticatedRoutes.route('/getStudentMarksStatisticsForOBE/:SubjectId/:ClassId/:StudentId')
    .get(statisticsController.getStudentMarksStatisticsForOBE);
authenticatedRoutes.route('/getStudentMarksStatisticsForSkillsAndYou/:SubjectId/:ClassId/:StudentId')
    .get(statisticsController.getStudentMarksStatisticsForSkillsAndYou);
authenticatedRoutes.route('/getStudentAttendanceStatistics/:SubjectId/:StudentId')
    .get(statisticsController.getStudentAttendanceStatistics);
authenticatedRoutes.route('/getAttendanceStatistics')
    .post(statisticsController.getAttendanceStatistics);
authenticatedRoutes.route('/getAttendanceStatisticsByRange/:SubjectId/:ClassId/:CollegeId/:RangeId/:IsElective')
    .get(statisticsController.getAttendanceByDateRange);
authenticatedRoutes.route('/getAttendanceForWeb')
    .post(statisticsController.getAttendanceForWeb);
authenticatedRoutes.route('/getMarksStatisticsByRange')
    .post(statisticsController.getMarksStatisticsByRange);
authenticatedRoutes.route('/getMarksStatisticsByRangeNew')
    .post(statisticsController.getMarksStatisticsByRangeNew);
authenticatedRoutes.route('/getMarksStatisticsByRangeForOBE')
    .post(statisticsController.getMarksStatisticsByRangeForOBE);
authenticatedRoutes.route('/getStudentMarksStatisticsForAllSubjects/:ClassId/:StudentId')
    .get(statisticsController.getStudentMarksStatisticsForAllSubjects);
authenticatedRoutes.route('/getStudentAttendanceStatisticsForAllSubjects/:ClassId/:StudentId')
    .get(statisticsController.getStudentAttendanceStatisticsForAllSubjects);
authenticatedRoutes.route('/getCollegeAttendanceStatistics')
    .post(statisticsController.getCollegeAttendanceStatistics);
authenticatedRoutes.route('/getCollegeMarksStatistics')
    .post(statisticsController.getCollegeMarksStatistics);
authenticatedRoutes.route('/getCoAttainmentForTest/:TestId/:COId')
    .get(statisticsController.getCoAttainmentForTest);
authenticatedRoutes.route('/getOverallCOAttainmentFromSEE')
    .post(statisticsController.getOverallCOAttainmentFromSEE);
authenticatedRoutes.route('/getOverallCOAttainmentFromChapter/:ChapterId/:COId')
    .get(statisticsController.getOverallCOAttainmentFromChapter);
authenticatedRoutes.route('/getStatisticsByBloomsLevel')
    .post(statisticsController.getStatisticsByBloomsLevel);

//new set of statistics api
authenticatedRoutes.route('/getClassStatsForSubject')
    .post(newStatsController.getClassStatsForSubject);
authenticatedRoutes.route('/getAllSubjectStatsForStudent')
    .post(newStatsController.getAllSubjectStatsForStudent);
authenticatedRoutes.route('/getSubjectStatsForStudent')
    .post(newStatsController.getSubjectStatsForStudent);
authenticatedRoutes.route('/getClassStatsForPrimeKeywords')
    .post(newStatsController.getClassStatsForPrimeKeywords)
authenticatedRoutes.route('/getAllSubjectStatsForPrimeKeyword')
    .post(newStatsController.getAllSubjectStatsForPrimeKeyword);
authenticatedRoutes.route('/getSubjectStatsForPrimeKeyword')
    .post(newStatsController.getSubjectStatsForPrimeKeyword);

authenticatedRoutes.route('/getQuestionsForTopic/:TopicId/:IsSmartLearning')
    .get(questionsController.getAllQuestionsForTopic);
authenticatedRoutes.route('/getQuestionCountForTopic/:TopicId')
    .get(questionsController.getQuestionCountForTopic);
authenticatedRoutes.route('/getAllQuestionsForChapter/:ChapterId/:SubjectId')
    .get(questionsController.getAllQuestionsForChapter);
authenticatedRoutes.route('/getQuestionsForTest/:SmartTestId')
    .get(questionsController.getAllQuestionsForTest);
authenticatedRoutes.route('/addQuestion')
    .post(questionsController.addQuestion);
authenticatedRoutes.route('/assignQuestionToTopic')
    .post(questionsController.assignQuestionToTopic);
authenticatedRoutes.route('/studentReportsQuestion')
    .post(questionsController.studentReportsQuestion);
authenticatedRoutes.route('/updateTimeToSolveForQuestion')
    .post(questionsController.updateTimeToSolveForQuestion);
authenticatedRoutes.route('/updateQuestion')
    .post(questionsController.updateQuestion);
authenticatedRoutes.route('/question')
    .delete(questionsController.deleteQuestion);
authenticatedRoutes.route('/removeQuestionImage')
    .put(questionsController.removeQuestionImage);
authenticatedRoutes.route('/questionBulkUpload')
    .post(questionsController.questionBulkUpload);

authenticatedRoutes.route('/getOptionsForQuestion/:QuestionId/:PackageCode')
    .get(optionsController.getAllOptionsForQuestion);
authenticatedRoutes.route('/getResultsForQuestion/:QuestionId/:StudentId')
    .get(optionsController.getResultsForQuestion);
authenticatedRoutes.route('/options')
    .put(optionsController.updateOption);

authenticatedRoutes.route('/getAllSmartTestsForSubject/:SubjectId')
    .get(smartTestController.getAllSmartTestsForSubject);
authenticatedRoutes.route('/getAllSmartTestsForChapter/:ChapterId')
    .get(smartTestController.getAllSmartTestsForChapter);
authenticatedRoutes.route('/getAllSmartTestsForClass/:ClassId/:SubjectId')
    .get(smartTestController.getAllSmartTestsForClass);
authenticatedRoutes.route('/getTopicsForStudent/:StudentId/:SubjectId')
    .get(smartTestController.getTopicsForStudent);
authenticatedRoutes.route('/getTopicsForClass')
    .post(smartTestController.getTopicsForClass);
authenticatedRoutes.route('/getAllSmartTestsForStudent/:BranchId/:ChapterId/:StudentId/:TestType')
    .get(smartTestController.getAllSmartTestsForStudent);
authenticatedRoutes.route('/getSmartTestMetrics/:StudentId/:SmartTestId')
    .get(smartTestController.getSmartTestMetrics);
authenticatedRoutes.route('/studentAnswersQuestion')
    .post(smartTestController.studentAnswersQuestion);
authenticatedRoutes.route('/createSmartTest')
    .post(smartTestController.createSmartTest);
authenticatedRoutes.route('/activateSmartTestForClass')
    .post(smartTestController.activateSmartTestForClass);
authenticatedRoutes.route('/deleteSmartTest')
    .delete(smartTestController.deleteSmartTest);

authenticatedRoutes.route('/getAllProgramOutcomes/:CollegeId/:CourseId/:BranchId')
    .get(programOutcomeController.getAllProgramOutcomes);
authenticatedRoutes.route('/getCOPODescriptor/:COId/:POId')
    .get(programOutcomeController.getCOPODescriptor);
authenticatedRoutes.route('/getAllProgramOutcomesForSubject/:CollegeId/:CourseId/:SubjectId/:IsElective')
    .get(programOutcomeController.getAllProgramOutcomesForSubject);
authenticatedRoutes.route('/addProgramOutcome')
    .post(programOutcomeController.addProgramOutcome);
authenticatedRoutes.route('/updateProgramOutcome')
    .put(programOutcomeController.updateProgramOutcome);
authenticatedRoutes.route('/deleteProgramOutcome')
    .delete(programOutcomeController.deleteProgramOutcome);

authenticatedRoutes.route('/getAllCourseOutcomes')
    .post(courseOutcomeController.getAllCourseOutcomes);
authenticatedRoutes.route('/getAllCourseOutcomesWithDescriptor')
    .post(courseOutcomeController.getAllCourseOutcomesWithDescriptor);
authenticatedRoutes.route('/getAllCOandBT/:CollegeId/:SubjectId/:ClassId')
    .get(courseOutcomeController.getAllCOandBT);
authenticatedRoutes.route('/addCourseOutcome')
    .post(courseOutcomeController.addCourseOutcome);
authenticatedRoutes.route('/removeCOPOMapping')
    .post(courseOutcomeController.removeCOPOMapping);

authenticatedRoutes.route('/getAllBlooms')
    .get(bloomsTaxonomyController.getAllBlooms);

authenticatedRoutes.route('/getAllCriteria/:ChapterId/:TopicId')
    .get(criteriaController.getAllCriteria);
authenticatedRoutes.route('/getQuestionPaper/:TestId')
    .get(criteriaController.getQuestionPaper);
authenticatedRoutes.route('/getAllCriteriaForStudentAndTest/:StudentId/:TestId')
    .get(criteriaController.getAllCriteriaForStudentAndTest);
authenticatedRoutes.route('/createCriteria')
    .post(criteriaController.addCriteria);
authenticatedRoutes.route('/addQuestionToTest')
    .post(criteriaController.addQuestionToTest);
authenticatedRoutes.route('/addQuestionsToTest')
    .post(criteriaController.addQuestionsToTest);
authenticatedRoutes.route('/editCriteria')
    .put(criteriaController.editCriteria);
authenticatedRoutes.route('/updateCriteriaForStudent')
    .post(criteriaController.updateCriteriaForStudent);
authenticatedRoutes.route('/deleteCriteria')
    .delete(criteriaController.deleteCriteria);
authenticatedRoutes.route('/removeCriteriaImage')
    .put(criteriaController.removeCriteriaImage);
authenticatedRoutes.route('/removeQuestionFromTest')
    .delete(criteriaController.removeQuestionFromTest);

//Index Statistics
authenticatedRoutes.route('/getCollegeMarksStatisticsByIndexing')
    .post(indexStatisticsController.getCollegeMarksStatisticsByIndexing);
authenticatedRoutes.route('/getStudentAcademicStatisticsByIndexing/:ClassId/:StudentId')
    .get(indexStatisticsController.getStudentAcademicStatisticsByIndexing);
authenticatedRoutes.route('/getStudentSmartStatisticsByIndexing/:StudentId')
    .get(indexStatisticsController.getStudentSmartStatisticsByIndexing);
authenticatedRoutes.route('/getSubjectSmartStatisticsByIndexing/:ClassId/:SubjectId')
    .get(indexStatisticsController.getStudentSmartStatisticsByIndexing);
authenticatedRoutes.route('/getStudentSubjectSmartStatisticsByIndexing/:StudentId/:SubjectId')
    .get(indexStatisticsController.getStudentSubjectSmartStatisticsByIndexing);

//Tags
authenticatedRoutes.route('/addSearchword')
    .post(tagsController.addSearchword);
authenticatedRoutes.route('/getAllSmartTestForFiltering/:SubjectId')
    .get(tagsController.getAllSmartTestForFiltering);
authenticatedRoutes.route('/getAllTags')
    .post(tagsController.getAllTags);
authenticatedRoutes.route('/getStatisticsByTags')
    .post(statisticsController.getStatisticsByTags);
authenticatedRoutes.route('/updateSearchword')
    .put(tagsController.updateSearchword);
authenticatedRoutes.route('/deleteSearchword')
    .delete(tagsController.deleteSearchword);
authenticatedRoutes.route('/updateTagsForQuestion')
    .put(tagsController.updateTagsForQuestion);
authenticatedRoutes.route('/getQuestionsForSkill')
    .post(tagsController.getQuestionsForSkill);
authenticatedRoutes.route('/getQuizzesForSkill')
    .post(tagsController.getQuizzesForSkill);

authenticatedRoutes.route('/getAllDocuments')
    .get(documentsController.getAllDocuments);
authenticatedRoutes.route('/getDocumentsForCollege/:CollegeId')
    .get(documentsController.getDocumentsForCollege);
authenticatedRoutes.route('/getDocumentsForStudent/:StudentId')
    .get(documentsController.getDocumentsForStudent);
authenticatedRoutes.route('/addDocumentToCollege')
    .post(documentsController.addDocumentToCollege);
authenticatedRoutes.route('/addDocumentToStudent')
    .post(documentsController.addDocumentToStudent);

authenticatedRoutes.route('/getAllPreviousMarksForStudent/:StudentId')
    .get(documentsController.getAllPreviousMarksForStudent);
authenticatedRoutes.route('/addPreviousMarksToStudent')
    .post(documentsController.addPreviousMarksToStudent);

authenticatedRoutes.route('/getFeesStructure/:CollegeId/:BranchId/:AcademicYear')
    .get(feesController.getFeesStructure);
authenticatedRoutes.route('/getFeesComponentNames/:CollegeId')
    .get(feesController.getFeesComponentNames);
authenticatedRoutes.route('/setFeesStructure')
    .post(feesController.setFeesStructure);
authenticatedRoutes.route('/updateFeesStructure')
    .put(feesController.updateFeesStructure);
authenticatedRoutes.route('/getTransportFees/:CollegeId')
    .get(feesController.getTransportFee);
authenticatedRoutes.route('/getRegularFeesForStudent/:StudentId/:AcademicYear')
    .get(feesController.getRegularFeesForStudent)
authenticatedRoutes.route('/getDevelopmentFeesForStudent/:StudentId/:AcademicYear')
    .get(feesController.getDevelopmentFeesForStudent)
authenticatedRoutes.route('/setTransportFees')
    .post(feesController.setTransportFee);
authenticatedRoutes.route('/updateTransportFees')
    .put(feesController.updateTransportFee);
authenticatedRoutes.route('/deleteTransportFees')
    .delete(feesController.deleteTransportFee);
authenticatedRoutes.route('/saveRegularFees')
    .post(feesController.saveRegularFees);
authenticatedRoutes.route('/saveDevelopmentFees')
    .post(feesController.saveDevelopmentFees);
authenticatedRoutes.route('/saveTransportFees')
    .post(feesController.saveTransportFees);
authenticatedRoutes.route('/getAllFeesKeywords/:CollegeId')
    .get(feesController.getAllFeesKeywords)
authenticatedRoutes.route('/updateFeesKeyword')
    .put(feesController.updateFeesKeyword)

authenticatedRoutes.route('/getAllReceiptsForStudent/:StudentId/:AcademicYear')
    .get(receiptController.getAllReceiptsForStudent);
authenticatedRoutes.route('/createReceipt')
    .post(receiptController.createReceipt);

authenticatedRoutes.route('/addDaysTimetable')
    .post(timetableController.addDaysTimetable);
authenticatedRoutes.route('/getDaysTimetable')
    .post(timetableController.getDaysTimetable);

//Install Metrics
authenticatedRoutes.route('/getInstallMetrics/:CollegeId')
    .get(installMetricsController.getInstallMetrics);
authenticatedRoutes.route('/sendInstallReminder')
    .post(installMetricsController.sendInstallReminder);

//password change, forgot
authenticatedRoutes.route('/changePassword')
    .put(passwordController.changePassword);
authenticatedRoutes.route('/changeStudentPassword')
    .put(passwordController.changeStudentPassword);

//server start
app.listen(port, function() {
    console.log('Node server started on port: ' + port);
});