'use strict';
var statusCodes = require('./StatusCodesController.js');
var notificationCodesController = require('./NotificationCodesController.js');
var notificationController = require('./NotificationController.js');
var database = require('../database_scripts/connection_string.js');
var asyncLoop = require('node-async-loop');
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dzerq05zm',
    api_key: '199453447665147',
    api_secret: 'BoLRDxRTwA7gYNIJB0seOIeqopU'
});
var FCM = require('fcm-push');
var serverKey = 'AAAAdvkI0U4:APA91bG7diSbxUWg-WFkyKrWTorqy_kPnhfo1dmzk0wznMNKjRVTg3y5CFCBwlcxW6U1D3tGPJhB17gjsHynke4ZaP5b2Xr99WTwVXY_jNooBhNHb4ImcZ90ejNH6sU36AJQ79eGQ4Nu';
var fcm = new FCM(serverKey);
var moment = require('moment');

module.exports = {
    getAssignmentsBySubject: function(req, res) {
        var result = {};
        var yearReceived = parseInt(req.body.Year);
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
        var queryString = 'SELECT * from Assignment WHERE SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND ClassId IN (' + req.body.ClassIds.join(",") + ')  AND CreatedAt BETWEEN "' + startYear + '" AND "' + endYear + '"';
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
    getAssignmentsByClass: function(req, res) {
        var result = {};
        var yearReceived = parseInt(req.params.Year);
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
        var queryString = 'SELECT Assignment.Id, Assignment.Name, Assignment.Description, Assignment.GivenBy, Assignment.ClassId, Assignment.VideoURL, Assignment.DocumentURL, Assignment.CreatedAt, Subject.Name AS SubjectName FROM Assignment INNER JOIN Subject ON Assignment.SubjectId = Subject.Id WHERE ClassId = ' + req.params.ClassId + ' AND Assignment.CreatedAt BETWEEN "' + startYear + '" AND "' + endYear + '"';
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
    getAssignmentsByClassAndStudent: function(req, res) {
        var result = {};
        var yearReceived = parseInt(req.params.Year);
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
        var queryString = 'SELECT a.*, s.Name AS SubjectName, s.Nickname FROM Assignment a INNER JOIN Subject s ON a.SubjectId = s.Id LEFT JOIN (SELECT * from StudentTakesElective WHERE StudentId = ' + req.params.StudentId + ') as new_table ON new_table.SubjectId = a.SubjectId WHERE new_table.StudentId IS NULL AND new_table.ClassId IS NULL AND new_table.SubjectId IS NULL AND a.ClassId = ' + req.params.ClassId + '  AND a.CreatedAt BETWEEN "' + startYear + '" AND "' + endYear + '"';
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
    getAssignmentsByCollege: function(req, res) {
        var result = {};
        var yearReceived = parseInt(req.params.Year);
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
        var queryString = 'SELECT Assignment.Id, Assignment.Name, Assignment.Description, Assignment.GivenBy, Assignment.ClassId, Assignment.VideoURL, Assignment.DocumentURL, Assignment.CreatedAt, Subject.Name AS SubjectName, Subject.Nickname, User.Name as UserName, College.Name as CollegeName FROM Assignment INNER JOIN Subject ON Assignment.SubjectId = Subject.Id INNER JOIN User ON Assignment.GivenBy = User.Id INNER JOIN College ON User.CollegeId = College.Id WHERE ClassId IN (SELECT Id FROM Class WHERE CollegeId = ' + req.params.CollegeId + ') AND Assignment.CreatedAt BETWEEN "' + startYear + '" AND "' + endYear + '"';
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
    getAssignmentImages: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from AssignmentImage WHERE AssignmentId = ' + req.params.AssignmentId;
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
    addAssignment: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Description == "" || req.body.SubjectId == "" || req.body.GivenBy == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var images = req.body.Images;
            var subName = req.body.SubjectName;
            var isElective = req.body.IsElective;
            delete req.body.Images;
            delete req.body.SubjectName;
            delete req.body.IsElective;
            var queryString = 'INSERT INTO Assignment SET ?';
            database.connectionString.query(queryString, req.body, function(err, rows) {
                if (!err) {
                    if (images.length > 0) {
                        var urlArray = [];
                        var publicIdArray = [];
                        asyncLoop(images, function(item, next) {
                            cloudinary.uploader.upload(item.src, function(result) {
                                urlArray.push('http://res.cloudinary.com/demo/image/fetch/f_auto,q_auto/' + result.url);
                                publicIdArray.push(result.public_id);
                                if (urlArray.length == images.length) {
                                    var queries = [];
                                    for (var i = 0; i < urlArray.length; i++) {
                                        var query = 'INSERT INTO AssignmentImage(Id, AssignmentId, ImageURL, PublicId) VALUES (null, ' + rows.insertId + ', "' + urlArray[i] + '", "' + publicIdArray[i] + '")';
                                        queries.push(query);
                                    }
                                    database.connectionString.query(queries.join("; "), function(err2, rows2) {
                                        if (!err2) {
                                            if (isElective == "true") {
                                                var querystring3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id INNER JOIN StudentTakesElective ON Student.Id = StudentTakesElective.StudentId WHERE StudentTakesElective.SubjectId = ' + req.body.SubjectId + ' AND Student.ClassId = ' + req.body.ClassId;
                                            } else {
                                                var querystring3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.ClassId = ' + req.body.ClassId;
                                            }
                                            database.connectionString.query(querystring3, function(err3, rows3) {
                                                if (!err3) {
                                                    var studentIds = [],
                                                        deviceIds = [];
                                                    for (var i = 0; i < rows3.length; i++) {
                                                        if (rows3[i].DeviceId != null) {
                                                            studentIds.push(rows3[i].Id);
                                                            deviceIds.push(rows3[i].DeviceId);
                                                        }

                                                        if (rows3[i].FatherDeviceId != null) {
                                                            if (studentIds.indexOf(rows3[i].Id) == -1) {
                                                                studentIds.push(rows3[i].Id);
                                                            }
                                                            deviceIds.push(rows3[i].FatherDeviceId);
                                                        }
                                                    }
                                                    var queryString8 = 'SELECT Id, DeviceId from User WHERE Role = "ADMIN" AND CollegeId IN (SELECT CollegeId FROM Class WHERE Id = ' + req.body.ClassId + ')';
                                                    database.connectionString.query(queryString8, function(err4, rows4) {
                                                        if (!err4) {
                                                            for (var i = 0; i < rows4.length; i++) {
                                                                if (rows4[i].DeviceId != null) {
                                                                    deviceIds.push(rows4[i].DeviceId);
                                                                }
                                                            }
                                                            var title = "Something related to " + subName + " was shared!";
                                                            var description = req.body.Name;
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
                                                                    notCode: notificationCodesController.notCodes[0],
                                                                    Id: rows.insertId,
                                                                    Name: req.body.Name,
                                                                    Description: req.body.Description,
                                                                    VideoURL: req.body.VideoURL,
                                                                    CreatedAt: moment().format('YYYY-MM-DD')
                                                                },
                                                                priority: "high"
                                                            };
                                                            fcm.send(message, function(error, response) {
                                                                if (error) {
                                                                    result.Code = statusCodes.successCodes[0].Code;
                                                                    result.Message = statusCodes.successCodes[0].Message;
                                                                    result.Data = rows3;
                                                                    res.send(result);
                                                                } else {
                                                                    var queryString4 = 'INSERT INTO Notification(Id, Title, Description, NotificationCode) VALUES (null, "' + title + '", "' + description + '", "' + notificationCodesController.notCodes[0] + '")';
                                                                    database.connectionString.query(queryString4, function(err4, rows4) {
                                                                        if (!err4) {
                                                                            var queries = [];
                                                                            for (var i = 0; i < studentIds.length; i++) {
                                                                                var query = 'INSERT INTO NotificationLedger(Id, NotificationId, StudentId, UserId, ArticleId) VALUES (null, ' + rows4.insertId + ', ' + studentIds[i] + ', null, ' + rows.insertId + ')';
                                                                                queries.push(query);
                                                                            }
                                                                            database.connectionString.query(queries.join("; "), function(err5, rows5) {
                                                                                if (!err5) {
                                                                                    result.Code = statusCodes.successCodes[0].Code;
                                                                                    result.Message = statusCodes.successCodes[0].Message;
                                                                                    result.Data = rows3;
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
                                                            res.send(err4)
                                                        }
                                                    });
                                                } else {
                                                    res.send(err3);
                                                }
                                            });
                                        } else {
                                            res.send(err2);
                                        }
                                    });
                                }
                            });
                            next();
                        }, function(err) {
                            if (err) {
                                res.send(err);
                                return;
                            }
                        });
                    } else {
                        if (isElective == "true") {
                            var querystring3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id INNER JOIN StudentTakesElective ON Student.Id = StudentTakesElective.StudentId WHERE StudentTakesElective.SubjectId = ' + req.body.SubjectId + ' AND Student.ClassId = ' + req.body.ClassId;
                        } else {
                            var querystring3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.ClassId = ' + req.body.ClassId;
                        }
                        database.connectionString.query(querystring3, function(err3, rows3) {
                            if (!err3) {
                                var studentIds = [],
                                    deviceIds = [];
                                for (var i = 0; i < rows3.length; i++) {
                                    if (rows3[i].DeviceId != null) {
                                        studentIds.push(rows3[i].Id);
                                        deviceIds.push(rows3[i].DeviceId);
                                    }
                                    if (rows3[i].FatherDeviceId != null) {
                                        if (studentIds.indexOf(rows3[i].Id) == -1) {
                                            studentIds.push(rows3[i].Id);
                                        }
                                        deviceIds.push(rows3[i].FatherDeviceId);
                                    }
                                }
                                var queryString8 = 'SELECT Id, DeviceId from User WHERE Role = "ADMIN" AND CollegeId IN (SELECT CollegeId FROM Class WHERE Id = ' + req.body.ClassId + ')';
                                database.connectionString.query(queryString8, function(err4, rows4) {
                                    if (!err4) {
                                        for (var i = 0; i < rows4.length; i++) {
                                            if (rows4[i].DeviceId != null) {
                                                deviceIds.push(rows4[i].DeviceId);
                                            }
                                        }
                                        var title = "Something related to " + subName + " was shared!";
                                        var description = req.body.Name;
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
                                                notCode: notificationCodesController.notCodes[0],
                                                Id: rows.insertId,
                                                Name: req.body.Name,
                                                Description: req.body.Description,
                                                VideoURL: req.body.VideoURL,
                                                CreatedAt: moment().format('YYYY-MM-DD')
                                            },
                                            priority: "high"
                                        };
                                        fcm.send(message, function(error, response) {
                                            if (error) {
                                                result.Code = statusCodes.successCodes[0].Code;
                                                result.Message = statusCodes.successCodes[0].Message;
                                                result.Data = rows3;
                                                res.send(result);
                                            } else {
                                                var queryString4 = 'INSERT INTO Notification(Id, Title, Description, NotificationCode) VALUES (null, "' + title + '", "' + description + '", "' + notificationCodesController.notCodes[0] + '")';
                                                database.connectionString.query(queryString4, function(err4, rows4) {
                                                    if (!err4) {
                                                        var queries = [];
                                                        for (var i = 0; i < studentIds.length; i++) {
                                                            var query = 'INSERT INTO NotificationLedger(Id, NotificationId, StudentId, UserId, ArticleId) VALUES (null, ' + rows4.insertId + ', ' + studentIds[i] + ', null, ' + rows.insertId + ')';
                                                            queries.push(query);
                                                        }
                                                        database.connectionString.query(queries.join("; "), function(err5, rows5) {
                                                            if (!err5) {
                                                                result.Code = statusCodes.successCodes[0].Code;
                                                                result.Message = statusCodes.successCodes[0].Message;
                                                                result.Data = rows3;
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
                                        res.send(err4)
                                    }
                                });
                            } else {
                                res.send(err3);
                            }
                        });
                    }
                } else {
                    res.send(err);
                }
            });
        }
    },
    addAssignmentNew: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.SubjectIds.length == 0 || req.body.GivenBy == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.ClassIds.length; i++) {
                var query = 'INSERT INTO Assignment(Id, Name, Description, VideoURL, DocumentURL, SubjectId, ClassId, GivenBy) VALUES(null,"' + req.body.Name + '","' + req.body.Description + '","' + req.body.VideoURL + '","' + req.body.DocumentURL + '",' + req.body.SubjectIds[i] + ',' + req.body.ClassIds[i] + ',' + req.body.GivenBy + ')';
                queries.push(query);
            }
            database.connectionString.query(queries.join("; "), function(err, rows) {
                if (!err) {
                    var images = req.body.Images;
                    var subName = req.body.SubjectName;
                    var isElective = req.body.IsElective;
                    if (images.length > 0) {
                        var urlArray = [];
                        var publicIdArray = [];
                        asyncLoop(images, function(item, next) {
                            cloudinary.uploader.upload(item.src, function(result) {
                                urlArray.push('http://res.cloudinary.com/demo/image/fetch/f_auto,q_auto/' + result.url);
                                publicIdArray.push(result.public_id);
                                if (urlArray.length == images.length) {
                                    var queries = [];
                                    for (var i = 0; i < urlArray.length; i++) {
                                        if (rows.length == undefined) {
                                            var query = 'INSERT INTO AssignmentImage(Id, AssignmentId, ImageURL, PublicId) VALUES (null, ' + rows.insertId + ', "' + urlArray[i] + '", "' + publicIdArray[i] + '")';
                                            queries.push(query);
                                        } else {
                                            for (var j = 0; j < rows.length; j++) {
                                                var query = 'INSERT INTO AssignmentImage(Id, AssignmentId, ImageURL, PublicId) VALUES (null, ' + rows[j].insertId + ', "' + urlArray[i] + '", "' + publicIdArray[i] + '")';
                                                queries.push(query);
                                            }
                                        }
                                    }
                                    database.connectionString.query(queries.join("; "), function(err2, rows2) {
                                        if (!err2) {
                                            if (isElective == "true") {
                                                var querystring3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id INNER JOIN StudentTakesElective ON Student.Id = StudentTakesElective.StudentId WHERE StudentTakesElective.SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND Student.ClassId IN (' + req.body.ClassIds.join(",") + ')';
                                            } else {
                                                var querystring3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.ClassId IN (' + req.body.ClassIds.join(",") + ')';
                                            }
                                            database.connectionString.query(querystring3, function(err3, rows3) {
                                                if (!err3) {
                                                    var studentIds = [],
                                                        deviceIds = [];
                                                    for (var i = 0; i < rows3.length; i++) {
                                                        if (rows3[i].DeviceId != null) {
                                                            studentIds.push(rows3[i].Id);
                                                            deviceIds.push(rows3[i].DeviceId);
                                                        }

                                                        if (rows3[i].FatherDeviceId != null) {
                                                            if (studentIds.indexOf(rows3[i].Id) == -1) {
                                                                studentIds.push(rows3[i].Id);
                                                            }
                                                            deviceIds.push(rows3[i].FatherDeviceId);
                                                        }
                                                    }
                                                    var queryString8 = 'SELECT Id, DeviceId from User WHERE Role = "ADMIN" AND CollegeId IN (SELECT CollegeId FROM Class WHERE Id = ' + req.body.ClassIds[0] + ')';
                                                    database.connectionString.query(queryString8, function(err4, rows4) {
                                                        if (!err4) {
                                                            for (var i = 0; i < rows4.length; i++) {
                                                                if (rows4[i].DeviceId != null) {
                                                                    deviceIds.push(rows4[i].DeviceId);
                                                                }
                                                            }
                                                            var obj = {
                                                                NotificationId: rows.insertId,
                                                                Title: "Something related to " + subName + " was shared!",
                                                                Description: req.body.Name,
                                                                VideoURL: req.body.VideoURL,
                                                                NotCode: notificationCodesController.notCodes[0],
                                                                StudentIds: studentIds,
                                                                DeviceIds: deviceIds
                                                            };
                                                            // notificationController.broadcastNotification(obj);
                                                            result.Code = statusCodes.successCodes[0].Code;
                                                            result.Message = statusCodes.successCodes[0].Message;
                                                            result.Data = rows3;
                                                            res.send(result);
                                                        } else {
                                                            res.send(err4)
                                                        }
                                                    });
                                                } else {
                                                    res.send(err3);
                                                }
                                            });
                                        } else {
                                            res.send(err2);
                                        }
                                    });
                                }
                            });
                            next();
                        }, function(err) {
                            if (err) {
                                res.send(err);
                                return;
                            }
                        });
                    } else {
                        if (isElective == "true") {
                            var querystring3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id INNER JOIN StudentTakesElective ON Student.Id = StudentTakesElective.StudentId WHERE StudentTakesElective.SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND Student.ClassId IN (' + req.body.ClassIds.join(",") + ')';
                        } else {
                            var querystring3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.ClassId IN (' + req.body.ClassIds.join(",") + ')';
                        }
                        database.connectionString.query(querystring3, function(err3, rows3) {
                            if (!err3) {
                                var studentIds = [],
                                    deviceIds = [];
                                for (var i = 0; i < rows3.length; i++) {
                                    if (rows3[i].DeviceId != null) {
                                        studentIds.push(rows3[i].Id);
                                        deviceIds.push(rows3[i].DeviceId);
                                    }
                                    if (rows3[i].FatherDeviceId != null) {
                                        if (studentIds.indexOf(rows3[i].Id) == -1) {
                                            studentIds.push(rows3[i].Id);
                                        }
                                        deviceIds.push(rows3[i].FatherDeviceId);
                                    }
                                }
                                var queryString8 = 'SELECT Id, DeviceId from User WHERE Role = "ADMIN" AND CollegeId IN (SELECT CollegeId FROM Class WHERE Id = ' + req.body.ClassIds[0] + ')';
                                database.connectionString.query(queryString8, function(err4, rows4) {
                                    if (!err4) {
                                        for (var i = 0; i < rows4.length; i++) {
                                            if (rows4[i].DeviceId != null) {
                                                deviceIds.push(rows4[i].DeviceId);
                                            }
                                        }
                                        var obj = {
                                            NotificationId: rows.insertId,
                                            Title: "Something related to " + subName + " was shared!",
                                            Description: req.body.Name,
                                            VideoURL: req.body.VideoURL,
                                            NotCode: notificationCodesController.notCodes[0],
                                            StudentIds: studentIds,
                                            DeviceIds: deviceIds
                                        };
                                        // notificationController.broadcastNotification(obj);
                                        result.Code = statusCodes.successCodes[0].Code;
                                        result.Message = statusCodes.successCodes[0].Message;
                                        result.Data = rows3;
                                        res.send(result);
                                    } else {
                                        res.send(err4)
                                    }
                                });
                            } else {
                                res.send(err3);
                            }
                        });
                    }
                } else {
                    res.send(err);
                }
            });
        }
    },
    updateAssignment: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Assignment SET Name = "' + req.body.Name + '", Description = "' + req.body.Description + '", DocumentURL = "' + req.body.DocumentURL + '", VideoURL = "' + req.body.VideoURL + '" WHERE Id = ' + req.body.Id;
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
    deleteAssignment: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT PublicId FROM AssignmentImage WHERE AssignmentId = ' + req.body.Id;
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    if (rows.length == 0) {
                        var queryString2 = 'DELETE FROM Assignment WHERE Id = ' + req.body.Id;
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
                        var count = 0;
                        asyncLoop(rows, function(item, next) {
                            cloudinary.uploader.destroy(item.PublicId, function(result) {
                                count++;
                                if (count == rows.length) {
                                    var queryString2 = 'DELETE FROM Assignment WHERE Id = ' + req.body.Id;
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
                            }, { invalidate: true });
                            next();
                        }, function(err) {
                            if (err) {
                                res.send(err);
                                return;
                            }
                        });
                    }
                } else {
                    res.send(err);
                }
            });
        }
    }
};