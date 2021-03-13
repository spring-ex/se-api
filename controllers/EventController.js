'use strict';
var statusCodes = require('./StatusCodesController.js');
var notificationCodesController = require('./NotificationCodesController.js');
var database = require('../database_scripts/connection_string.js');
var asyncLoop = require('node-async-loop');
var cloudinary = require('cloudinary');

var moment = require('moment');
cloudinary.config({
    cloud_name: 'dzerq05zm',
    api_key: '199453447665147',
    api_secret: 'BoLRDxRTwA7gYNIJB0seOIeqopU'
});
var FCM = require('fcm-push');
var serverKey = 'AAAAdvkI0U4:APA91bG7diSbxUWg-WFkyKrWTorqy_kPnhfo1dmzk0wznMNKjRVTg3y5CFCBwlcxW6U1D3tGPJhB17gjsHynke4ZaP5b2Xr99WTwVXY_jNooBhNHb4ImcZ90ejNH6sU36AJQ79eGQ4Nu';
var fcm = new FCM(serverKey);

module.exports = {
    getAllEvents: function(req, res) {
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
        var queryString = 'SELECT * from Event WHERE CollegeId = ' + req.params.CollegeId + ' AND EventDate BETWEEN "' + startYear + '" AND "' + endYear + '"';
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
    getEventImages: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from EventImage WHERE EventId = ' + req.params.EventId;
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
    getEventsAndAssignments: function(req, res) {
        var result = {};
        var now = moment().add(1, "days").format('YYYY-MM-DD');
        var weekBack = moment().subtract(1, "week").format('YYYY-MM-DD');
        var queryString = 'SELECT * FROM Event WHERE CollegeId = ' + req.params.CollegeId + ' AND CreatedAt BETWEEN "' + weekBack + '" AND "' + now + '" ORDER BY Id DESC LIMIT 5;SELECT * FROM Assignment WHERE ClassId = ' + req.params.ClassId + ' AND CreatedAt BETWEEN "' + weekBack + '" AND "' + now + '" ORDER BY Id DESC LIMIT 5';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                var events = rows[0];
                var assignments = rows[1];
                var eventIds = [],
                    assignmentIds = [];
                for (var i = 0; i < events.length; i++) {
                    eventIds.push(events[i].Id);
                }
                for (var i = 0; i < assignments.length; i++) {
                    assignmentIds.push(assignments[i].Id);
                }
                if (eventIds.length == 0 && assignmentIds.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else if (eventIds.length == 0) {
                    var queryString2 = 'SELECT * FROM AssignmentImage WHERE AssignmentId IN(' + assignmentIds.join(",") + ')';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            var assignmentImages = rows2;
                            for (var i = 0; i < assignments.length; i++) {
                                assignments[i].Images = [];
                                for (var j = 0; j < assignmentImages.length; j++) {
                                    if (assignments[i].Id == assignmentImages[j].AssignmentId) {
                                        assignments[i].Images.push(assignmentImages[j].ImageURL);
                                    }
                                }
                            }
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = assignments;
                            res.send(result);
                        } else {
                            res.send(err2);
                        }
                    });
                } else if (assignmentIds.length == 0) {
                    var queryString2 = 'SELECT * FROM EventImage WHERE EventId IN(' + eventIds.join(",") + ')';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            var eventImages = rows2;
                            for (var i = 0; i < events.length; i++) {
                                events[i].Images = [];
                                for (var j = 0; j < eventImages.length; j++) {
                                    if (events[i].Id == eventImages[j].EventId) {
                                        events[i].Images.push(eventImages[j].ImageURL);
                                    }
                                }
                            }
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = events;
                            res.send(result);
                        } else {
                            res.send(err2);
                        }
                    });
                } else {
                    var queryString2 = 'SELECT * FROM EventImage WHERE EventId IN(' + eventIds.join(",") + '); SELECT * FROM AssignmentImage WHERE AssignmentId IN(' + assignmentIds.join(",") + ')';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            var eventImages = rows2[0];
                            var assignmentImages = rows2[1];
                            for (var i = 0; i < events.length; i++) {
                                events[i].Images = [];
                                for (var j = 0; j < eventImages.length; j++) {
                                    if (events[i].Id == eventImages[j].EventId) {
                                        events[i].Images.push(eventImages[j].ImageURL);
                                    }
                                }
                            }
                            for (var i = 0; i < assignments.length; i++) {
                                assignments[i].Images = [];
                                for (var j = 0; j < assignmentImages.length; j++) {
                                    if (assignments[i].Id == assignmentImages[j].AssignmentId) {
                                        assignments[i].Images.push(assignmentImages[j].ImageURL);
                                    }
                                }
                            }
                            var response = events;
                            for (var i = 0; i < assignments.length; i++) {
                                response.push(assignments[i]);
                            }
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = response;
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
    addEvent: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.EventDate == "" || req.body.CreatedBy == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var images = req.body.Images;
            delete req.body.Images;
            var queryString = 'INSERT INTO Event SET ?';
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
                                        var query = 'INSERT INTO EventImage(Id, EventId, ImageURL, PublicId) VALUES (null, ' + rows.insertId + ', "' + urlArray[i] + '", "' + publicIdArray[i] + '")';
                                        queries.push(query);
                                    }
                                    database.connectionString.query(queries.join("; "), function(err2, rows2) {
                                        if (!err2) {
                                            var querystring3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.CollegeId = ' + req.body.CollegeId;
                                            database.connectionString.query(querystring3, function(err3, rows3) {
                                                if (!err3) {
                                                    var queryString4 = 'SELECT * from User WHERE CollegeId = ' + req.body.CollegeId;
                                                    database.connectionString.query(queryString4, function(err4, rows4) {
                                                        if (!err4) {
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
                                                            for (var i = 0; i < rows4.length; i++) {
                                                                if (rows4[i].DeviceId != null) {
                                                                    deviceIds.push(rows4[i].DeviceId);
                                                                }
                                                            }
                                                            var title = "Checkout the new event created!";
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
                                                                    notCode: notificationCodesController.notCodes[1],
                                                                    Id: rows.insertId,
                                                                    Name: req.body.Name,
                                                                    Description: req.body.Description,
                                                                    VideoURL: req.body.VideoURL,
                                                                    EventDate: req.body.EventDate
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
                                                                    var queryString4 = 'INSERT INTO Notification(Id, Title, Description, NotificationCode) VALUES (null, "' + title + '", "' + description + '", "' + notificationCodesController.notCodes[1] + '")';
                                                                    database.connectionString.query(queryString4, function(err4, rows4) {
                                                                        if (!err4) {
                                                                            var queries = [];
                                                                            for (var i = 0; i < studentIds.length; i++) {
                                                                                if (rows4.insertId != null && studentIds[i] != null && rows.insertId != null) {
                                                                                    var query = 'INSERT INTO NotificationLedger(Id, NotificationId, StudentId, UserId, ArticleId) VALUES (null, ' + rows4.insertId + ', ' + studentIds[i] + ', null, ' + rows.insertId + ')';
                                                                                    queries.push(query);
                                                                                }
                                                                            }
                                                                            if (queries.length > 0) {
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
                                                                                result.Code = statusCodes.successCodes[0].Code;
                                                                                result.Message = statusCodes.successCodes[0].Message;
                                                                                result.Data = rows4;
                                                                                res.send(result);
                                                                            }
                                                                        } else {
                                                                            res.send(err4);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        } else {
                                                            res.send(err4);
                                                        }
                                                    });
                                                } else {
                                                    res.send(err3);
                                                }
                                            });
                                        } else {
                                            res.send(err2);
                                        }
                                    })
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
                        var querystring3 = 'SELECT Student.Id, Student.DeviceId, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.CollegeId = ' + req.body.CollegeId + ' AND Student.Status <> 1';
                        database.connectionString.query(querystring3, function(err3, rows3) {
                            if (!err3) {
                                var queryString4 = 'SELECT * from User WHERE CollegeId = ' + req.body.CollegeId;
                                database.connectionString.query(queryString4, function(err4, rows4) {
                                    if (!err4) {
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
                                        for (var i = 0; i < rows4.length; i++) {
                                            if (rows4[i].DeviceId != null) {
                                                deviceIds.push(rows4[i].DeviceId);
                                            }
                                        }
                                        var title = "Checkout the new event created!";
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
                                                notCode: notificationCodesController.notCodes[1],
                                                Id: rows.insertId,
                                                Name: req.body.Name,
                                                Description: req.body.Description,
                                                VideoURL: req.body.VideoURL,
                                                EventDate: req.body.EventDate
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
                                                var queryString4 = 'INSERT INTO Notification(Id, Title, Description, NotificationCode) VALUES (null, "' + title + '", "' + description + '", "' + notificationCodesController.notCodes[1] + '")';
                                                database.connectionString.query(queryString4, function(err4, rows4) {
                                                    if (!err4) {
                                                        var queries = [];
                                                        for (var i = 0; i < studentIds.length; i++) {
                                                            if (rows4.insertId != null && studentIds[i] != null && rows.insertId != null) {
                                                                var query = 'INSERT INTO NotificationLedger(Id, NotificationId, StudentId, UserId, ArticleId) VALUES (null, ' + rows4.insertId + ', ' + studentIds[i] + ', null, ' + rows.insertId + ')';
                                                                queries.push(query);
                                                            }
                                                        }
                                                        if (queries.length > 0) {
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
                                                            result.Code = statusCodes.successCodes[0].Code;
                                                            result.Message = statusCodes.successCodes[0].Message;
                                                            result.Data = rows4;
                                                            res.send(result);
                                                        }
                                                    } else {
                                                        res.send(err4);
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        res.send(err4);
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
    updateEvent: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Event SET Name = "' + req.body.Name + '" WHERE Id = ' + req.body.Id;
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
    deleteEvent: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT PublicId FROM EventImage WHERE EventId = ' + req.body.Id;
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    if (rows.length == 0) {
                        var queryString2 = 'DELETE FROM Event WHERE Id = ' + req.body.Id;
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
                                    var queryString2 = 'DELETE FROM Event WHERE Id = ' + req.body.Id;
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