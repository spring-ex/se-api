'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');
var notificationCodesController = require('./NotificationCodesController.js');

var FCM = require('fcm-push');
var serverKey = 'AAAAdvkI0U4:APA91bG7diSbxUWg-WFkyKrWTorqy_kPnhfo1dmzk0wznMNKjRVTg3y5CFCBwlcxW6U1D3tGPJhB17gjsHynke4ZaP5b2Xr99WTwVXY_jNooBhNHb4ImcZ90ejNH6sU36AJQ79eGQ4Nu';
var fcm = new FCM(serverKey);

module.exports = {
    getAllRoutes: function(req, res) {
        var result = {};
        var queryString = 'SELECT Route.Id, Route.RouteNumber, Route.VehicleRegNumber, Route.AreasCovered, Route.Latitude, Route.Longitude, RouteAssignment.UserId, User.Name, User.PhoneNumber FROM RouteAssignment INNER JOIN Route ON Route.Id = RouteAssignment.RouteId INNER JOIN User ON RouteAssignment.UserId = User.Id WHERE Route.CollegeId = ' + req.params.CollegeId;
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
    addRoute: function(req, res) {
        var result = {};
        if (req.body.CollegeId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO Route SET ?';
            var obj = {
                Id: null,
                RouteNumber: req.body.RouteNumber,
                VehicleRegNumber: req.body.VehicleRegNumber,
                AreasCovered: req.body.AreasCovered,
                CollegeId: req.body.CollegeId
            };
            database.connectionString.query(queryString, obj, function(err, rows) {
                if (!err) {
                    var queryString2 = 'INSERT INTO RouteAssignment(Id, RouteId, UserId) VALUES(null, ' + rows.insertId + ', ' + req.body.UserId + ')';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err) {
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = rows2;
                            res.send(result);
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
    deleteRoute: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Route WHERE Id = ' + req.body.Id;
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
    updateRoute: function(req, res) {
        var result = {};
        if (req.body.RouteId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Route SET Latitude = "' + req.body.Latitude + '", Longitude = "' + req.body.Longitude + '" WHERE Id = ' + req.body.RouteId;
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    var result = {};
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    res.send(err);
                }
            });
        }
    },
    getRouteById: function(req, res) {
        var result = {};
        if (req.params.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT Route.Id, Route.RouteNumber, Route.VehicleRegNumber, Route.AreasCovered, Route.Latitude, Route.Longitude, RouteAssignment.UserId, User.Name, User.PhoneNumber FROM RouteAssignment INNER JOIN Route ON Route.Id = RouteAssignment.RouteId INNER JOIN User ON RouteAssignment.UserId = User.Id WHERE Route.Id = ' + req.params.RouteId;
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
    studentBoardsBus: function(req, res) {
        var result = {};
        var title = req.body.Name + " has boarded the bus!";
        var description = req.body.Name + " has boarded the bus!";
        var deviceIds = [];
        if (req.body.FatherDeviceId != null && req.body.FatherDeviceId != 'null') {
            deviceIds.push(req.body.FatherDeviceId);
        }
        if (req.body.MotherDeviceId != null && req.body.MotherDeviceId != 'null') {
            deviceIds.push(req.body.MotherDeviceId);
        }
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
                notCode: notificationCodesController.notCodes[3],
                Id: req.body.Id,
                Title: title,
                Description: description
            },
            priority: "high"
        };
        fcm.send(message, function(error, response) {
            if (error) {
                result.Code = statusCodes.successCodes[0].Code;
                result.Message = statusCodes.successCodes[0].Message;
                result.Data = null;
                res.send(result);
            } else {
                result.Code = statusCodes.successCodes[0].Code;
                result.Message = statusCodes.successCodes[0].Message;
                result.Data = null;
                res.send(result);
            }
        });
    },
    studentLeavesBus: function(req, res) {
        var result = {};
        var title = req.body.Name + " has arrived!";
        var description = req.body.Name + " has arrived at the drop off point!";
        var deviceIds = [];
        if (req.body.FatherDeviceId != null && req.body.FatherDeviceId != 'null') {
            deviceIds.push(req.body.FatherDeviceId);
        }
        if (req.body.MotherDeviceId != null && req.body.MotherDeviceId != 'null') {
            deviceIds.push(req.body.MotherDeviceId);
        }
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
                notCode: notificationCodesController.notCodes[3],
                Id: req.body.Id,
                Title: title,
                Description: description
            },
            priority: "high"
        };
        fcm.send(message, function(error, response) {
            if (error) {
                result.Code = statusCodes.successCodes[0].Code;
                result.Message = statusCodes.successCodes[0].Message;
                result.Data = null;
                res.send(result);
            } else {
                result.Code = statusCodes.successCodes[0].Code;
                result.Message = statusCodes.successCodes[0].Message;
                result.Data = null;
                res.send(result);
            }
        });
    },
    busReachedDestination: function(req, res) {
        var result = {};
        // if (parseInt(req.body.IsPickup)) {
        //     var title = "Bus has reached";
        //     var description = "The bus has reached the Institution";
        // } else {
        //     var title = "Bus has started";
        //     var description = "The bus has started from the Institution";
        // }
        // var deviceIds = [];
        // for (var i = 0; i < req.body.Students.length; i++) {
        //     if (req.body.Students[i].FatherDeviceId != null && req.body.Students[i].FatherDeviceId != 'null') {
        //         deviceIds.push(req.body.Students[i].FatherDeviceId);
        //     }
        //     if (req.body.Students[i].MotherDeviceId != null && req.body.Students[i].MotherDeviceId != 'null') {
        //         deviceIds.push(req.body.Students[i].MotherDeviceId);
        //     }
        // }
        // var message = {
        //     registration_ids: deviceIds,
        //     notification: {
        //         title: title,
        //         body: description,
        //         sound: "default",
        //         color: "#387ef5",
        //         icon: "fcm_push_icon",
        //         click_action: "FCM_PLUGIN_ACTIVITY"
        //     },
        //     data: { //you can send only notification or only data(or include both)
        //         notCode: notificationCodesController.notCodes[3],
        //         Id: req.body.Id,
        //         Title: title,
        //         Description: description
        //     },
        //     priority: "high"
        // };
        // fcm.send(message, function(error, response) {
        //     if (error) {
        result.Code = statusCodes.successCodes[0].Code;
        result.Message = statusCodes.successCodes[0].Message;
        result.Data = null;
        res.send(result);
        //     } else {
        //         result.Code = statusCodes.successCodes[0].Code;
        //         result.Message = statusCodes.successCodes[0].Message;
        //         result.Data = null;
        //         res.send(result);
        //     }
        // });
    }
}