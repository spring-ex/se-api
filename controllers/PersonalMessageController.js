'use strict';
var statusCodes = require('./StatusCodesController.js');
var notificationCodesController = require('./NotificationCodesController.js');
var database = require('../database_scripts/connection_string.js');

var FCM = require('fcm-push');
var serverKey = 'AAAAdvkI0U4:APA91bG7diSbxUWg-WFkyKrWTorqy_kPnhfo1dmzk0wznMNKjRVTg3y5CFCBwlcxW6U1D3tGPJhB17gjsHynke4ZaP5b2Xr99WTwVXY_jNooBhNHb4ImcZ90ejNH6sU36AJQ79eGQ4Nu';
var fcm = new FCM(serverKey);

module.exports = {
    getAllMessagesForStudent: function (req, res) {
        var result = {};
        var queryString = 'SELECT Name, UserId, StudentId, Message FROM PersonalMessage, Student WHERE Student.Id = PersonalMessage.StudentId AND PersonalMessage.StudentId = ' + req.params.StudentId;
        database.connectionString.query(queryString, function (err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var userIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].UserId != null) {
                            userIds.push(rows[i].UserId);
                        }
                    }
                    if (userIds.length == 0) {
                        result.Code = statusCodes.successCodes[0].Code;
                        result.Message = statusCodes.successCodes[0].Message;
                        result.Data = rows;
                        res.send(result);
                    } else {
                        var queryString2 = 'SELECT Id, Name from User WHERE Id IN (' + userIds.join(",") + ')';
                        database.connectionString.query(queryString2, function (err2, rows2) {
                            if (!err2) {
                                for (var i = 0; i < rows.length; i++) {
                                    for (var j = 0; j < rows2.length; j++) {
                                        if (rows[i].UserId == rows2[j].Id) {
                                            rows[i].Name = rows2[j].Name;
                                        }
                                    }
                                }
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = rows;
                                res.send(result);
                            } else {
                                res.send(err2);
                            }
                        });
                    }
                }
            } else {
                res.send(err);
            }
        });
    },
    addMessage: function (req, res) {
        var result = {};
        if (req.body.StudentId == "" || req.body.Message == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO PersonalMessage SET ?';
            var obj = {
                Id: null,
                StudentId: req.body.StudentId,
                UserId: req.body.UserId,
                Message: req.body.Message
            };
            database.connectionString.query(queryString, obj, function (err, rows) {
                if (!err) {
                    var queryString2 = 'SELECT DeviceId FROM User WHERE Role = "ADMIN" AND CollegeId IN (SELECT CollegeId FROM Student WHERE Id = ' + req.body.StudentId + ')';
                    database.connectionString.query(queryString2, obj, function (err2, rows2) {
                        if (!err2) {
                            var queries = [], deviceIds = [];
                            for (var i = 0; i < rows2.length; i++) {
                                if (rows2[i].DeviceId != null || students[i].DeviceId != undefined) {
                                    deviceIds.push(rows2[i].DeviceId);
                                }
                            }
                            var message = {
                                registration_ids: deviceIds,
                                notification: {
                                    title: 'You have a new message!',
                                    body: req.body.Message,
                                    sound: "default",
                                    color: "#387ef5",
                                    icon: "fcm_push_icon",
                                    click_action: "FCM_PLUGIN_ACTIVITY"
                                },
                                data: {  //you can send only notification or only data(or include both)
                                    notCode: notificationCodesController.notCodes[5],
                                    studentId: req.body.StudentId,
                                },
                                priority: "high"
                            };
                            fcm.send(message, function (error, response) {
                                if (error) {
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = rows;
                                    res.send(result);
                                } else {
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = rows2;
                                    res.send(result);
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
    }
}