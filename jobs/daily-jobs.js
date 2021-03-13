'use strict';
var notificationCodesController = require('../controllers/NotificationCodesController.js');
var database = require('../database_scripts/connection_string.js');
var FCM = require('fcm-push');
var serverKey = 'AAAAdvkI0U4:APA91bG7diSbxUWg-WFkyKrWTorqy_kPnhfo1dmzk0wznMNKjRVTg3y5CFCBwlcxW6U1D3tGPJhB17gjsHynke4ZaP5b2Xr99WTwVXY_jNooBhNHb4ImcZ90ejNH6sU36AJQ79eGQ4Nu';
var fcm = new FCM(serverKey);
var eventsDone = false;
var calendarDone = false;
var assignmentDone = false;

function eventsScheduler() {
    var queryString = 'SELECT * FROM Event WHERE DATE(EventDate) = CURDATE()';
    database.connectionString.query(queryString, function(err, rows) {
        if (!err) {
            if (rows.length == 0) {
                console.log("No news or events today!");
                eventsDone = true;
                exitProcess();
            } else {
                var collegeIds = rows.map(a => a.CollegeId);
                var queryString2 = 'SELECT DeviceId FROM User WHERE Role = "FACULTY" AND CollegeId IN (' + collegeIds.join(",") + ')';
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        var list = rows2.filter(a => a.DeviceId != 'null');
                        var deviceIds = list.map(a => a.DeviceId);
                        if (deviceIds.length != 0) {
                            var title = "Reminder about the Event today";
                            var description = 'Checkout the event that is happening today!';
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
                                    Id: null
                                },
                                priority: "high"
                            };
                            fcm.send(message, function(error, response) {
                                if (error) {
                                    console.log('Cannot send notification');
                                    eventsDone = true;
                                    exitProcess();
                                } else {
                                    console.log('Notification sent successfully');
                                    eventsDone = true;
                                    exitProcess();
                                }
                            });
                        } else {
                            console.log('No devices to send notification');
                            eventsDone = true;
                            exitProcess();
                        }
                    } else {
                        console.log(err2);
                        eventsDone = true;
                        exitProcess();
                    }
                });
            }
        } else {
            console.log(err);
            eventsDone = true;
            exitProcess();
        }
    });
};

function calendarScheduler() {
    var queryString = 'SELECT * FROM Calendar WHERE DATE(EventStartDate) = CURDATE()';
    database.connectionString.query(queryString, function(err, rows) {
        if (!err) {
            if (rows.length == 0) {
                console.log("No calendar events today!");
                calendarDone = true;
                exitProcess();
            } else {
                var collegeIds = rows.map(a => a.CollegeId);
                var queryString2 = 'SELECT DeviceId FROM User WHERE Role = "FACULTY" AND CollegeId IN (' + collegeIds.join(",") + ')';
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        var list = rows2.filter(a => a.DeviceId != 'null');
                        var deviceIds = list.map(a => a.DeviceId);
                        if (deviceIds.length != 0) {
                            var title = "Reminder about the Event today";
                            var description = 'Checkout the event that is happening today!';
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
                                    notCode: notificationCodesController.notCodes[6]
                                },
                                priority: "high"
                            };
                            fcm.send(message, function(error, response) {
                                if (error) {
                                    console.log('Cannot send notification');
                                    calendarDone = true;
                                    exitProcess();
                                } else {
                                    console.log('Notification sent successfully');
                                    calendarDone = true;
                                    exitProcess();
                                }
                            });
                        } else {
                            console.log('No devices to send notification');
                            calendarDone = true;
                            exitProcess();
                        }
                    } else {
                        console.log(err2);
                        calendarDone = true;
                        exitProcess();
                    }
                });
            }
        } else {
            console.log(err);
            calendarDone = true;
            exitProcess();
        }
    });
};

function assignmentScheduler() {
    var queryString = 'SELECT * FROM Assignment WHERE DATE(CreatedAt) >= CURDATE() - INTERVAL DAYOFWEEK(CURDATE()) + 6 DAY AND DATE(CreatedAt) < CURDATE() - INTERVAL DAYOFWEEK(CURDATE()) - 1 DAY';
    database.connectionString.query(queryString, function(err, rows) {
        if (!err) {
            if (rows.length == 0) {
                console.log("No assignments this week!");
                assignmentDone = true;
                exitProcess();
            } else {
                var classIds = rows.map(a => a.ClassId);
                var queryString2 = 'SELECT s.DeviceId, a.FatherDeviceId, a.MotherDeviceId FROM Student s INNER JOIN Admission a ON s.AdmissionId = a.Id WHERE s.ClassId IN (' + classIds.join(",") + ')';
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        var list = rows2.filter(a => a.DeviceId != 'null');
                        var deviceIds = list.map(a => a.DeviceId);
                        list = rows2.filter(a => a.FatherDeviceId != 'null');
                        deviceIds.push(list.map(a => a.FatherDeviceId));
                        list = rows2.filter(a => a.MotherDeviceId != 'null');
                        deviceIds.push(list.map(a => a.MotherDeviceId));
                        if (deviceIds.length != 0) {
                            var title = "Reminder about the Assignment";
                            var description = 'Checkout the assignment that was shared last week!';
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
                                    Id: null
                                },
                                priority: "high"
                            };
                            fcm.send(message, function(error, response) {
                                if (error) {
                                    console.log('Cannot send notification');
                                    assignmentDone = true;
                                    exitProcess();
                                } else {
                                    console.log('Notification sent successfully');
                                    assignmentDone = true;
                                    exitProcess();
                                }
                            });
                        } else {
                            console.log('No devices to send notification');
                            assignmentDone = true;
                            exitProcess();
                        }
                    } else {
                        console.log(err2);
                        assignmentDone = true;
                        exitProcess();
                    }
                });
            }
        } else {
            console.log(err);
            assignmentDone = true;
            exitProcess();
        }
    });
};

function exitProcess() {
    if (eventsDone && calendarDone && assignmentDone) {
        process.exit();
    }
}

eventsScheduler();
calendarScheduler();
assignmentScheduler();