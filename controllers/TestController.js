'use strict';
var statusCodes = require('./StatusCodesController.js');
var notificationCodesController = require('./NotificationCodesController.js');
var database = require('../database_scripts/connection_string.js');

var FCM = require('fcm-push');
var serverKey = 'AAAAdvkI0U4:APA91bG7diSbxUWg-WFkyKrWTorqy_kPnhfo1dmzk0wznMNKjRVTg3y5CFCBwlcxW6U1D3tGPJhB17gjsHynke4ZaP5b2Xr99WTwVXY_jNooBhNHb4ImcZ90ejNH6sU36AJQ79eGQ4Nu';
var fcm = new FCM(serverKey);
var _ = require('lodash');
var asyncLoop = require('node-async-loop');

module.exports = {
    getAllTests: function(req, res) {
        var result = {};
        if (req.body.ConductedTestsOnly == "true") {
            var queryString = 'SELECT Test.Id, Test.Name, Test.TestDate, Test.MaxMarks, Test.SubjectId, Test.ClassId, Test.GivenBy, Test.TestCategoryId, Test.IsFinal, Test.CreatedAt, Test.UpdatedAt, TestCategory.Name as TestCategoryName, IFNULL(TestCategory.Name, "") FROM Test LEFT JOIN TestCategory ON Test.TestCategoryId = TestCategory.Id WHERE Test.SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND Test.ClassId IN (' + req.body.ClassIds.join(",") + ') AND Test.TestDate IS NOT NULL';
        } else {
            var queryString = 'SELECT Test.Id, Test.Name, Test.TestDate, Test.MaxMarks, Test.SubjectId, Test.ClassId, Test.GivenBy, Test.TestCategoryId, Test.IsFinal, Test.CreatedAt, Test.UpdatedAt, TestCategory.Name as TestCategoryName, IFNULL(TestCategory.Name, "") FROM Test LEFT JOIN TestCategory ON Test.TestCategoryId = TestCategory.Id WHERE Test.SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND Test.ClassId IN (' + req.body.ClassIds.join(",") + ')';
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                } else {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows;
                }
                res.send(result);
            } else {
                res.send(err);
            }
        });
    },
    getMarksBySubject: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from StudentWritesTest WHERE TestId = ' + req.body.Id;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                var studentIds = [];
                for (var i = 0; i < rows.length; i++) {
                    studentIds.push(rows[i].StudentId);
                }
                if (req.params.IsElective == "true") {
                    var queryString2 = 'SELECT Student.Id, Student.Name, Student.FindInboxId FROM Student INNER JOIN StudentTakesElective ON Student.Id = StudentTakesElective.StudentId WHERE StudentTakesElective.SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND Student.ClassId IN (' + req.body.ClassIds.join(",") + ') AND Student.CollegeId = ' + req.body.CollegeId + ' AND Student.Status <> 1';
                } else {
                    var queryString2 = 'SELECT Id, Name, FindInboxId FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ') AND CollegeId = ' + req.body.CollegeId + ' AND Student.Status <> 1';
                }
                var students = [];
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        for (var i = 0; i < rows2.length; i++) {
                            rows2[i].Marks = 'Ab';
                            for (var j = 0; j < rows.length; j++) {
                                if (rows2[i].Id == rows[j].StudentId) {
                                    rows2[i].Marks = rows[j].MarksObtained;
                                }
                            }
                            students.push(rows2[i]);
                        }
                        result.Code = statusCodes.successCodes[0].Code;
                        result.Message = statusCodes.successCodes[0].Message;
                        result.Data = students;
                        res.send(result);
                    } else {
                        res.send(err2);
                    }
                });
            } else {
                res.send(err);
            }
        });
    },
    addTest: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.MaxMarks == "" || req.body.TestDate == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var students = req.body.Students;
            var subName = req.body.SubjectName;
            delete req.body.Students;
            delete req.body.SubjectName;
            var queryString = 'INSERT INTO Test SET ?';
            database.connectionString.query(queryString, req.body, function(err, rows) {
                if (!err) {
                    var queries = [],
                        deviceIds = [],
                        studentIds = [];
                    for (var i = 0; i < students.length; i++) {
                        if (students[i].DeviceId != null || students[i].DeviceId != undefined) {
                            studentIds.push(students[i].StudentId)
                            deviceIds.push(students[i].DeviceId);
                        }
                        if (students[i].FatherDeviceId != null) {
                            if (studentIds.indexOf(students[i].Id) == -1) {
                                studentIds.push(students[i].StudentId);
                            }
                            deviceIds.push(students[i].FatherDeviceId);
                        }
                        if (students[i].IsAbsent) {
                            var query = 'INSERT INTO StudentWritesTest(Id, StudentId, TestId, MarksObtained, ResultPercentage) VALUES (null, ' + students[i].StudentId + ', ' + rows.insertId + ', "Ab", 0)';
                        } else {
                            var query = 'INSERT INTO StudentWritesTest(Id, StudentId, TestId, MarksObtained, ResultPercentage) VALUES (null, ' + students[i].StudentId + ', ' + rows.insertId + ', ' + students[i].Marks + ', ' + students[i].ResultPercentage + ')';
                        }
                        queries.push(query);
                    }
                    database.connectionString.query(queries.join("; "), function(err2, rows2) {
                        if (!err) {
                            var title = "Check " + req.body.Name + " score for " + subName;
                            var description = "View performance and attendance statistics for " + subName;
                            var message = {
                                registration_ids: deviceIds,
                                notification: {
                                    title: title,
                                    body: description,
                                    sound: "default",
                                    color: "#387ef5",
                                    icon: "fcm_push_icon",
                                    click_action: "FCM_PLUGIN_ACTIVITY"
                                },
                                data: { //you can send only notification or only data(or include both)
                                    notCode: notificationCodesController.notCodes[4],
                                    classId: req.body.ClassId,
                                    subjectId: req.body.SubjectId,
                                    subjectName: subName
                                },
                                priority: "high"
                            };
                            fcm.send(message, function(error, response) {
                                if (error) {
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = rows2;
                                    res.send(result);
                                } else {
                                    var queryString4 = 'INSERT INTO Notification(Id, Title, Description, NotificationCode) VALUES (null, "' + title + '", "' + description + '", "' + notificationCodesController.notCodes[4] + '")';
                                    database.connectionString.query(queryString4, function(err4, rows4) {
                                        if (!err4) {
                                            var queries = [];
                                            for (var i = 0; i < studentIds.length; i++) {
                                                var query = 'INSERT INTO NotificationLedger(Id, NotificationId, StudentId, UserId, ArticleId) VALUES (null, ' + rows4.insertId + ', ' + studentIds[i] + ', null, ' + req.body.SubjectId + ')';
                                                queries.push(query);
                                            }
                                            database.connectionString.query(queries.join("; "), function(err5, rows5) {
                                                if (!err5) {
                                                    result.Code = statusCodes.successCodes[0].Code;
                                                    result.Message = statusCodes.successCodes[0].Message;
                                                    result.Data = rows2;
                                                    res.send(result);
                                                } else {
                                                    res.send(err5);
                                                }
                                            });
                                        } else {
                                            res.send(err4);
                                        }
                                    });
                                }
                            });
                        } else {
                            res.send(err2);
                        }
                    });
                } else {
                    res.send(err);
                }
            });
        }
    },
    addTestNew: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.MaxMarks == "" || req.body.TestDate == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var uniqueClassIds = module.exports.unique(req.body.Students, 'ClassId');
            var uniqueSubjectIds = module.exports.unique(req.body.Students, 'SubjectId');
            var queries = [];
            for (var i = 0; i < uniqueClassIds.length; i++) {
                var query = 'INSERT INTO Test(Id, Name, TestDate, MaxMarks, IsFinal, SubjectId, ClassId, GivenBy, TestCategoryId) VALUES(null, "' + req.body.Name + '","' + req.body.TestDate + '",' + req.body.MaxMarks + ', ' + req.body.IsFinal + ', ' + uniqueSubjectIds[i] + ',' + uniqueClassIds[i] + ',' + req.body.GivenBy + ',' + req.body.TestCategoryId + ')';
                queries.push({
                    Query: query,
                    ClassId: uniqueClassIds[i]
                });
            };
            var count = queries.length;
            asyncLoop(queries, function(item, next) {
                database.connectionString.query(item.Query, function(err, rows) {
                    if (!err) {
                        var subQueries = [];
                        var studentIds = [];
                        var deviceIds = [];
                        for (var i = 0; i < req.body.Students.length; i++) {
                            if (req.body.Students[i].DeviceId != null || req.body.Students[i].DeviceId != undefined) {
                                studentIds.push(req.body.Students[i].StudentId)
                                deviceIds.push(req.body.Students[i].DeviceId);
                            }
                            if (req.body.Students[i].FatherDeviceId != null) {
                                if (studentIds.indexOf(req.body.Students[i].Id) == -1) {
                                    studentIds.push(req.body.Students[i].StudentId);
                                }
                                deviceIds.push(req.body.Students[i].FatherDeviceId);
                            }
                            if (item.ClassId == req.body.Students[i].ClassId) {
                                if (req.body.Students[i].IsAbsent) {
                                    var subQuery = 'INSERT INTO StudentWritesTest(Id, StudentId, TestId, MarksObtained, ResultPercentage) VALUES (null, ' + req.body.Students[i].StudentId + ', ' + rows.insertId + ', "Ab", 0)';
                                } else {
                                    var subQuery = 'INSERT INTO StudentWritesTest(Id, StudentId, TestId, MarksObtained, ResultPercentage) VALUES (null, ' + req.body.Students[i].StudentId + ', ' + rows.insertId + ', ' + req.body.Students[i].Marks + ', ' + req.body.Students[i].ResultPercentage + ')';
                                }
                                subQueries.push(subQuery);
                            }
                        }
                        database.connectionString.query(subQueries.join("; "), function(err2, rows2) {
                            if (!err2) {
                                count--;
                                if (count > 0) {
                                    next();
                                } else {
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = rows;
                                    res.send(result);
                                }
                            } else {
                                res.send(err2);
                            }
                        });
                    } else {
                        res.send(err);
                    }
                });
            });
        }
    },
    updateTest: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Test SET Name = "' + req.body.Name + '" WHERE Id = ' + req.body.Id;
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows;
                    res.send(result);
                } else {
                    res.send(err);
                }
            });
        }
    },
    updateMarks: function(req, res) {
        var result = {};
        if (req.body.StudentId == "" || req.body.TestId == "" || req.body.Marks < 0 || req.body.IsAbsent == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString2 = 'SELECT * FROM StudentWritesTest WHERE StudentId = ' + req.body.StudentId + ' AND TestId = ' + req.body.TestId;
            database.connectionString.query(queryString2, function(err2, rows2) {
                if (!err2) {
                    if (rows2.length == 0) {
                        var queryString = 'INSERT INTO StudentWritesTest(Id, StudentId, TestId, MarksObtained, ResultPercentage) VALUES (null,' + req.body.StudentId + ',' + req.body.TestId + ',"' + req.body.Marks + '", ' + req.body.ResultPercentage + ')';
                        database.connectionString.query(queryString, function(err, rows) {
                            if (!err) {
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = rows;
                                res.send(result);
                            } else {
                                res.send(err);
                            }
                        });
                    } else {
                        var queryString = 'UPDATE StudentWritesTest SET MarksObtained = "' + req.body.Marks + '", ResultPercentage = ' + req.body.ResultPercentage + ' WHERE StudentId = ' + req.body.StudentId + ' AND TestId = ' + req.body.TestId;
                        database.connectionString.query(queryString, function(err, rows) {
                            if (!err) {
                                if (req.body.Marks == 'Ab') {
                                    var queryString2 = 'DELETE FROM StudentWritesCriteria WHERE StudentId = ' + req.body.StudentId + ' AND TestId = ' + req.body.TestId;
                                    database.connectionString.query(queryString2, function(err2, rows2) {
                                        if (!err2) {
                                            result.Code = statusCodes.successCodes[0].Code;
                                            result.Message = statusCodes.successCodes[0].Message;
                                            result.Data = rows2;
                                            res.send(result);
                                        } else {
                                            res.send(err2);
                                        }
                                    });
                                } else {
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = rows;
                                    res.send(result);
                                }
                            } else {
                                res.send(err);
                            }
                        });
                    }
                } else {
                    res.send(err2);
                }
            });
        }
    },
    deleteTest: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            queries.push('DELETE FROM StudentWritesTest WHERE TestId = ' + req.body.Id);
            queries.push('DELETE FROM StudentWritesCriteria WHERE CriteriaId IN(SELECT CriteriaId FROM TestHasCriteria WHERE TestId = ' + req.body.Id + ')');
            queries.push('DELETE FROM Test WHERE Id = ' + req.body.Id);
            database.connectionString.query(queries.join("; "), function(err, rows) {
                if (!err) {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows;
                    res.send(result);
                } else {
                    res.send(err);
                }
            });
        }
    },
    unique: function(arr, prop) {
        return arr.map(function(e) { return e[prop]; }).filter(function(e, i, a) {
            return i === a.indexOf(e);
        });
    }
}