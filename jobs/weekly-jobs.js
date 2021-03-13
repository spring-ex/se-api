'use strict';
var notificationCodesController = require('../controllers/NotificationCodesController.js');
var database = require('../database_scripts/connection_string.js');
var FCM = require('fcm-push');
var serverKey = 'AAAAdvkI0U4:APA91bG7diSbxUWg-WFkyKrWTorqy_kPnhfo1dmzk0wznMNKjRVTg3y5CFCBwlcxW6U1D3tGPJhB17gjsHynke4ZaP5b2Xr99WTwVXY_jNooBhNHb4ImcZ90ejNH6sU36AJQ79eGQ4Nu';
var fcm = new FCM(serverKey);
var assignmentDone = false;

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
                                    notCode: notificationCodesController.notCodes[2]
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
}

function exitProcess() {
    if (assignmentDone) {
        process.exit();
    }
}

assignmentScheduler();