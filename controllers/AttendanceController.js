'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');
var moment = require('moment');

module.exports = {
    getAttendanceByDateForSubject: function(req, res) {
        var result = {};
        if (req.params.AttendanceDate == "" || req.params.SubjectId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT * FROM Attendance WHERE AttendanceDate = "' + req.params.AttendanceDate + '" AND SubjectId = ' + req.params.SubjectId;
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
        }
    },
    getAllAttendanceForStudent: function(req, res) {
        var result = {};
        var yearReceived = moment().year();
        var today1 = new Date();
        var today2 = new Date();
        if (today1.getMonth() <= 6) {
            today1.setYear(yearReceived - 1);
            today2.setYear(yearReceived);
        } else {
            today1.setYear(yearReceived);
            today2.setYear(yearReceived + 1);
        }
        today1.setMonth(6);
        today2.setMonth(7);
        today1.setDate(1);
        today2.setDate(31);
        var startYear = moment(today1).format("YYYY-MM-DD");
        var endYear = moment(today2).format("YYYY-MM-DD");
        var queryString = 'SELECT * FROM Attendance WHERE StudentId = ' + req.params.StudentId + ' AND SubjectId = ' + req.params.SubjectId + ' AND AttendanceDate BETWEEN "' + startYear + '" AND "' + endYear + '"';
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
    getAttendanceByDateForStudent: function(req, res) {
        var result = {};
        if (req.params.AttendanceDate == "" || req.params.StudentId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT * from Attendance WHERE AttendanceDate = "' + req.params.AttendanceDate + '" AND StudentId = ' + req.params.StudentId;
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
        }
    },
    getAttendanceForSubject: function(req, res) {
        var result = {};
        var yearReceived = moment().year();
        var today1 = new Date();
        var today2 = new Date();
        if (today1.getMonth() <= 6) {
            today1.setYear(yearReceived - 1);
            today2.setYear(yearReceived);
        } else {
            today1.setYear(yearReceived);
            today2.setYear(yearReceived + 1);
        }
        today1.setMonth(6);
        today2.setMonth(7);
        today1.setDate(1);
        today2.setDate(31);
        var startYear = moment(today1).format("YYYY-MM-DD");
        var endYear = moment(today2).format("YYYY-MM-DD");
        if (req.body.IsElective == "true") {
            var queryString = 'SELECT Student.Id FROM Student WHERE Id IN (SELECT StudentId FROM StudentTakesSpecialClass WHERE SpecialClassId = ' + req.body.SpecialClassId + ') AND Student.Status <> 1 ORDER BY Student.UpdatedAt';
        } else {
            var queryString = 'SELECT Id FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ') AND Status <> 1 ORDER BY Student.UpdatedAt';
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var attendanceObj = [];
                    var studentIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        studentIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT * FROM Attendance WHERE StudentId IN (' + studentIds.join(",") + ') AND SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND AttendanceDate BETWEEN "' + startYear + '" AND "' + endYear + '"';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            for (var i = 0; i < rows2.length; i++) {
                                if (rows[0].Id == rows2[i].StudentId) {
                                    attendanceObj.push({
                                        Id: rows2[i].Id,
                                        AttendanceDate: rows2[i].AttendanceDate
                                    });
                                }
                            }
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = attendanceObj;
                            res.send(result);
                        } else {
                            res.send(err2);
                        }
                    });
                }
            } else {
                res.send(err);
            }
        });
    },
    getUniqueAttendanceDates: function(req, res) {
        var result = {};
        if (req.body.ClassId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString2 = 'SELECT AttendanceDate FROM Attendance WHERE ClassId = ' + req.body.ClassId + ' AND SubjectId = ' + req.body.SubjectId + ' AND StudentId = ' + req.body.StudentId + ' AND AttendanceDate BETWEEN "' + req.body.DateRange.startDate + '" AND "' + req.body.DateRange.endDate + '" ORDER BY AttendanceDate ASC';
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
        }
    },
    getDaysAttendance: function(req, res) {
        var result = {};
        if (req.body.ClassId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT * FROM Attendance WHERE ClassId = ' + req.body.ClassId + ' AND SubjectId = ' + req.body.SubjectId + ' AND StudentId = ' + req.body.StudentId + ' AND AttendanceDate BETWEEN "' + req.body.DateRange.startDate + '" AND "' + req.body.DateRange.endDate + '" ORDER BY AttendanceDate ASC';
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    if (rows.length == 0) {
                        result.Code = statusCodes.errorCodes[0].Code;
                        result.Message = statusCodes.errorCodes[0].Message;
                        result.Data = null;
                        res.send(result);
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
    },
    takeAttendance: function(req, res) {
        var result = {};
        if (req.body.Attendance.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            var now = new Date();
            var hh = now.getHours();
            var mm = now.getMinutes();
            var ss = now.getSeconds();
            for (var i = 0; i < req.body.Attendance.length; i++) {
                if (req.body.Attendance[i].AttendanceDate.length <= 10) {
                    req.body.Attendance[i].AttendanceDate = req.body.Attendance[i].AttendanceDate + " " + hh + ":" + mm + ":" + ss;
                }
                var query = 'INSERT INTO Attendance(Id, AttendanceDate, IsPresent, TakenBy, StudentId, SubjectId, ClassId) VALUES (null, "' + req.body.Attendance[i].AttendanceDate + '", "' + req.body.Attendance[i].IsPresent + '", ' + req.body.Attendance[i].TakenBy + ', ' + req.body.Attendance[i].StudentId + ', ' + req.body.Attendance[i].SubjectId + ', ' + req.body.Attendance[i].ClassId + ')';
                queries.push(query);
            }
            database.connectionString.query(queries.join("; "), function(err, rows) {
                if (!err) {
                    if (req.body.TopicsTaught.length == 0) {
                        result.Code = statusCodes.successCodes[0].Code;
                        result.Message = statusCodes.successCodes[0].Message;
                        result.Data = rows;
                        res.send(result);
                    } else {
                        var queries = [];
                        for (var i = 0; i < req.body.TopicsTaught.length; i++) {
                            var query = 'INSERT INTO TopicsTaught(Id, ChapterId, TopicId, ClassId, SubjectId) VALUES (null, ' + req.body.TopicsTaught[i].ChapterId + ', ' + req.body.TopicsTaught[i].TopicId + ', ' + req.body.TopicsTaught[i].ClassId + ', ' + req.body.TopicsTaught[i].SubjectId + ')';
                            queries.push(query);
                        }
                        database.connectionString.query(queries.join("; "), function(err2, rows2) {
                            if (!err2) {
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = rows2;
                                res.send(result);
                            } else {
                                res.send(err2);
                            }
                        });
                    }
                } else {
                    res.send(err);
                }
            });
        }
    },
    takeSpecialAttendance: function(req, res) {
        var result = {};
        if (req.body.Subjects.length == 0 || req.body.Students.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.Subjects.length; i++) {
                for (var j = 0; j < req.body.Students.length; j++) {
                    var query = 'INSERT INTO Attendance(Id, AttendanceDate, IsPresent, TakenBy, StudentId, SubjectId, ClassId) VALUES (null, "' + req.body.AttendanceDate + '", "' + req.body.Students[j].isPresent + '", ' + req.body.TakenBy + ', ' + req.body.Students[j].Id + ', ' + req.body.Subjects[i].Id + ', ' + req.body.ClassId + ')';
                    queries.push(query);
                }
            }
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
    addDaysAttendanceForStudent: function(req, res) {
        var result = {};
        if (req.body.AttendanceDate == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO Attendance(Id, AttendanceDate, IsPresent, TakenBy, StudentId, SubjectId, ClassId) VALUES (null, "' + req.body.AttendanceDate + '", "' + req.body.IsPresent + '", ' + req.body.TakenBy + ', ' + req.body.StudentId + ', ' + req.body.SubjectId + ', ' + req.body.ClassId + ')';
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
    editAttendanceForStudent: function(req, res) {
        var result = {};
        if (req.body.IsPresent == "" || req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Attendance SET IsPresent = "' + req.body.IsPresent + '" WHERE Id = ' + req.body.Id;
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
    deleteAttendance: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Attendance WHERE Id = ' + req.body.Id;
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
    deleteDaysAttendance: function(req, res) {
        var result = {};
        if (req.body.SubjectIds.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            console.log(req.body.AttendanceDate);
            var startDate = moment(req.body.AttendanceDate).format("YYYY-MM-DD");
            var endDate = moment(req.body.AttendanceDate).format("YYYY-MM-DD 23:59:59");
            var queryString = 'DELETE FROM Attendance WHERE SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND ClassId IN (' + req.body.ClassIds.join(",") + ') AND AttendanceDate BETWEEN "' + startDate + '" AND "' + endDate + '"';
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
    }
}