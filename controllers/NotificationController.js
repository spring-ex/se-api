'use strict';
var statusCodes = require('./StatusCodesController.js');
var notificationCodesController = require('./NotificationCodesController.js');
var database = require('../database_scripts/connection_string.js');
var urlencode = require('urlencode');
var http = require('http');
var moment = require('moment');

var FCM = require('fcm-push');
var serverKey = 'AAAAdvkI0U4:APA91bG7diSbxUWg-WFkyKrWTorqy_kPnhfo1dmzk0wznMNKjRVTg3y5CFCBwlcxW6U1D3tGPJhB17gjsHynke4ZaP5b2Xr99WTwVXY_jNooBhNHb4ImcZ90ejNH6sU36AJQ79eGQ4Nu';
var fcm = new FCM(serverKey);

module.exports = {
    getAllNotifications: function(req, res) {
        var result = {};
        if (req.body.Title == "" || req.body.Description == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT Notification.Title, Notification.Id, Notification.Description, Notification.ImageURL, Notification.VideoURL FROM Notification INNER JOIN NotificationLedger ON Notification.Id = NotificationLedger.NotificationId WHERE NotificationLedger.StudentId = ' + req.body.StudentId;
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
    feesNotification: function(req, res) {
        var result = {};
        if (req.body.CollegeId == "" || req.body.CollegeId == null) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var querystring3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.CollegeId = ' + req.body.CollegeId + ' AND Student.Status <> 1';
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
                    var title = "Fees Reminder!";
                    var description = "Please pay your balance fees. Ignore, if its already paid.";
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
                            notCode: notificationCodesController.notCodes[2]
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
                            var queryString4 = 'INSERT INTO Notification(Id, Title, Description, NotificationCode) VALUES (null, "' + title + '", "' + description + '", "' + notificationCodesController.notCodes[2] + '")';
                            database.connectionString.query(queryString4, function(err4, rows4) {
                                if (!err4) {
                                    var queries = [];
                                    for (var i = 0; i < studentIds.length; i++) {
                                        var query = 'INSERT INTO NotificationLedger(Id, NotificationId, StudentId, UserId, ArticleId) VALUES (null, ' + rows4.insertId + ', ' + studentIds[i] + ', null, null)';
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
                    res.send(err3);
                }
            });
        }
    },
    notificationReminder: function(req, res) {
        var result = {};
        if (req.body.CollegeId == "" || req.body.CollegeId == null) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var querystring3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.CollegeId = ' + req.body.CollegeId + ' AND Student.Status <> 1';
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
                    var title = "Did you miss something?";
                    var description = "Check your notifications to stay updated!";
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
                            notCode: notificationCodesController.notCodes[2]
                        },
                        priority: "high"
                    };
                    fcm.send(message, function(error, response) {
                        if (error) {
                            result.Code = statusCodes.errorCodes[1].Code;
                            result.Message = statusCodes.errorCodes[1].Message;
                            result.Data = null;
                            res.send(result);
                        } else {
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = rows3;
                            res.send(result);
                        }
                    });
                } else {
                    res.send(err3);
                }
            });
        }
    },
    customNotification: function(req, res) {
        var result = {};
        if (req.body.Target.CollegeId == "" || req.body.Target.CollegeId == null) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            if (req.body.Target.CourseId != null && req.body.Target.BranchId != null && req.body.Target.SemesterId != null && req.body.Target.ClassId != null) {
                var queryString3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.FatherPhoneNumber, Admission.MotherPhoneNumber, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.CollegeId = ' + req.body.Target.CollegeId + ' AND Student.CourseId = ' + req.body.Target.CourseId + ' AND Student.BranchId = ' + req.body.Target.BranchId + ' AND Student.SemesterId = ' + req.body.Target.SemesterId + ' AND Student.ClassId = ' + req.body.Target.ClassId + ' AND Student.Status <> 1';
            } else if (req.body.Target.CourseId != null && req.body.Target.BranchId != null && req.body.Target.SemesterId != null) {
                var queryString3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.FatherPhoneNumber, Admission.MotherPhoneNumber, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.CollegeId = ' + req.body.Target.CollegeId + ' AND Student.CourseId = ' + req.body.Target.CourseId + ' AND Student.BranchId = ' + req.body.Target.BranchId + ' AND Student.SemesterId = ' + req.body.Target.SemesterId + ' AND Student.Status <> 1';
            } else if (req.body.Target.CourseId != null && req.body.Target.BranchId != null) {
                var queryString3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.FatherPhoneNumber, Admission.MotherPhoneNumber, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.CollegeId = ' + req.body.Target.CollegeId + ' AND Student.CourseId = ' + req.body.Target.CourseId + ' AND Student.BranchId = ' + req.body.Target.BranchId + ' AND Student.Status <> 1';
            } else if (req.body.Target.CourseId != null) {
                var queryString3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.FatherPhoneNumber, Admission.MotherPhoneNumber, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.CollegeId = ' + req.body.Target.CollegeId + ' AND Student.CourseId = ' + req.body.Target.CourseId + ' AND Student.Status <> 1';
            } else {
                var queryString3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.FatherPhoneNumber, Admission.MotherPhoneNumber, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.CollegeId = ' + req.body.Target.CollegeId + ' AND Student.Status <> 1';
            }
            database.connectionString.query(queryString3, function(err3, rows3) {
                if (!err3) {
                    var studentIds = [],
                        deviceIds = [],
                        phoneNumbers = [];
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
                        if (rows3[i].FatherPhoneNumber != null) {
                            if (phoneNumbers.indexOf(rows3[i].FatherPhoneNumber) == -1) {
                                phoneNumbers.push(rows3[i].FatherPhoneNumber);
                            }
                        } else if (rows3[i].MotherPhoneNumber != null) {
                            if (phoneNumbers.indexOf(rows3[i].MotherPhoneNumber) == -1) {
                                phoneNumbers.push(rows3[i].MotherPhoneNumber);
                            }
                        }
                    }
                    if (deviceIds.length > 0) { // send notification as well as sms.
                        var queryString4 = 'INSERT INTO Notification(Id, Title, Description, NotificationCode) VALUES (null, "' + req.body.Notification.Title + '", "' + req.body.Notification.Description + '", "' + notificationCodesController.notCodes[3] + '")';
                        database.connectionString.query(queryString4, function(err4, rows4) {
                            if (!err4) {
                                var queries = [];
                                for (var i = 0; i < studentIds.length; i++) {
                                    var query = 'INSERT INTO NotificationLedger(Id, NotificationId, StudentId, UserId) VALUES (null, ' + rows4.insertId + ', ' + studentIds[i] + ', null)';
                                    queries.push(query);
                                }
                                database.connectionString.query(queries.join("; "), function(err5, rows5) {
                                    if (!err5) {
                                        var title = req.body.Notification.Title;
                                        var description = req.body.Notification.Description;
                                        var message = {
                                            registration_ids: deviceIds,
                                            notification: {
                                                title: "Important Notice!",
                                                body: title,
                                                sound: "default",
                                                color: "#387ef5",
                                                icon: "fcm_push_icon",
                                                click_action: "FCM_PLUGIN_ACTIVITY"
                                            },
                                            data: { //you can send only notification or only data(or include both)
                                                notCode: notificationCodesController.notCodes[3],
                                                Id: rows4.insertId,
                                                Title: title,
                                                Description: description,
                                                VideoURL: req.body.Notification.VideoURL,
                                                ImageURL: req.body.Notification.ImageURL
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
                                                if (phoneNumbers.length == 0 || !req.body.Notification.SMSBroadcastAvailable) {
                                                    result.Code = statusCodes.successCodes[0].Code;
                                                    result.Message = statusCodes.successCodes[0].Message;
                                                    result.Data = rows3;
                                                    res.send(result);
                                                    return;
                                                } else {
                                                    var message = urlencode(req.body.Notification.Description);
                                                    var username = 'findinbox.com@gmail.com';
                                                    var hash = 'ef85931fcbc2bdf732cae88be7645ea37bb24699b3438af3cb8c757a1fabb940';
                                                    var sender = 'findin';
                                                    for (var i = 0; i < phoneNumbers.length; i++) {
                                                        phoneNumbers[i] = parseInt(phoneNumbers[i]);
                                                    }
                                                    var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumbers + '&message=' + message
                                                    var options = {
                                                        host: 'api.textlocal.in',
                                                        path: '/send?' + data
                                                    };
                                                    var callback = function(response) {
                                                        var str = '';

                                                        //another chunk of data has been recieved, so append it to `str`
                                                        response.on('data', function(chunk) {
                                                            str += chunk;
                                                        });

                                                        //the whole response has been recieved, so we just print it out here
                                                        response.on('end', function() {
                                                            result.Code = statusCodes.successCodes[0].Code;
                                                            result.Message = statusCodes.successCodes[0].Message;
                                                            result.Data = str;
                                                            res.send(result);
                                                        });
                                                    }
                                                    http.request(options, callback).end();
                                                }
                                            }
                                        });
                                    } else {
                                        res.send(err5);
                                    }
                                });
                            } else {
                                res.send(err4);
                            }
                        });
                    } else { //just send sms
                        if (!req.body.Notification.SMSBroadcastAvailable) {
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = null;
                            res.send(result);
                            return;
                        } else {
                            var message = urlencode(req.body.Notification.Description);
                            var username = 'findinbox.com@gmail.com';
                            var hash = 'ef85931fcbc2bdf732cae88be7645ea37bb24699b3438af3cb8c757a1fabb940';
                            var sender = 'findin';
                            for (var i = 0; i < phoneNumbers.length; i++) {
                                phoneNumbers[i] = parseInt(phoneNumbers[i]);
                            }
                            var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumbers + '&message=' + message
                            var options = {
                                host: 'api.textlocal.in',
                                path: '/send?' + data
                            };
                            var callback = function(response) {
                                var str = '';

                                //another chunk of data has been recieved, so append it to `str`
                                response.on('data', function(chunk) {
                                    str += chunk;
                                });

                                //the whole response has been recieved, so we just print it out here
                                response.on('end', function() {
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = str;
                                    res.send(result);
                                });
                            }
                            http.request(options, callback).end();
                        }
                    }
                } else {
                    res.send(err3);
                }
            });
        }
    },
    getAllStudentNotifications: function(req, res) {
        var result = {};
        if (req.params.StudentId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var currentYear = moment().year();
            var today1 = new Date();
            var today2 = new Date();
            if (today1.getMonth() <= 6) {
                today1.setYear(currentYear - 1);
                today2.setYear(currentYear);
            } else {
                today1.setYear(currentYear);
                today2.setYear(currentYear + 1);
            }
            today1.setMonth(6);
            today2.setMonth(7);
            today1.setDate(1);
            today2.setDate(31);
            var startYear = moment(today1).format("YYYY-MM-DD");
            var endYear = moment(today2).format("YYYY-MM-DD");
            var queryString = 'SELECT Notification.Id, Notification.Title, Notification.Description, Notification.ImageURL, Notification.VideoURL, Notification.NotificationCode, NotificationLedger.CreatedAt, NotificationLedger.StudentId, NotificationLedger.ArticleId FROM Notification INNER JOIN NotificationLedger ON Notification.Id = NotificationLedger.NotificationId WHERE NotificationLedger.StudentId = ' + req.params.StudentId + ' AND NotificationLedger.CreatedAt BETWEEN "' + startYear + '" AND "' + endYear + '"';
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
    broadcastNotification: function(req, res) {
        // var req = {
        //     Id
        //     Title
        //     Description
        //     NotCode,
        //     VideoURL,
        //     DeviceIds,
        //     StudentIds
        // }
        var result = {};
        if (req.body.DeviceIds.length == 0) {
            // sms should go. but currently sending just success message
            result.Code = statusCodes.successCodes[0].Code;
            result.Message = statusCodes.successCodes[0].Message;
            result.Data = null;
            res.send(result);
        } else {
            var message = {
                registration_ids: req.body.DeviceIds,
                notification: {
                    title: req.body.Title,
                    body: req.body.Description,
                    sound: "default",
                    color: "#387ef5",
                    icon: "fcm_push_icon",
                    click_action: "FCM_PLUGIN_ACTIVITY"
                },
                data: { //you can send only notification or only data(or include both)
                    notCode: req.body.NotCode,
                    Id: req.body.Id,
                    Name: req.body.Title,
                    Description: req.body.Description,
                    VideoURL: req.body.VideoURL,
                    CreatedAt: moment().format('YYYY-MM-DD')
                },
                priority: "high"
            };
            fcm.send(message, function(error, response) {
                if (error) {
                    console.log(error);
                } else {
                    var queryString = 'INSERT INTO Notification(Id, Title, Description, NotificationCode) VALUES (null, "' + req.body.Title + '", "' + req.body.Description + '", "' + req.body.NotCode + '")';
                    database.connectionString.query(queryString, function(err4, rows4) {
                        if (!err4) {
                            var queries = [];
                            var studentIds = req.body.StudentIds;
                            for (var i = 0; i < studentIds.length; i++) {
                                var query = 'INSERT INTO NotificationLedger(Id, NotificationId, StudentId, UserId, ArticleId) VALUES (null, ' + rows4.insertId + ', ' + studentIds[i] + ', null, ' + req.body.ArticleId + ')';
                                queries.push(query);
                            }
                            database.connectionString.query(queries.join("; "), function(err5, rows5) {
                                if (!err5) {
                                    console.log('##############Notification sent##############');
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = null;
                                    res.send(result);
                                } else {
                                    console.log('##############Notification broadcast failed##############');
                                    result.Code = statusCodes.errorCodes[0].Code;
                                    result.Message = statusCodes.errorCodes[0].Message;
                                    result.Data = null;
                                    res.send(result);
                                }
                            });
                        } else {
                            console.log('##############Query Execution failed##############');
                            result.Code = statusCodes.errorCodes[0].Code;
                            result.Message = statusCodes.errorCodes[0].Message;
                            result.Data = null;
                            res.send(result);
                        }
                    });
                }
            });
        }
    }
}