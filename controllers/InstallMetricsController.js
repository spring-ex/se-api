'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');
var urlencode = require('urlencode');
var http = require('http');

module.exports = {
    getInstallMetrics: function(req, res) {
        var result = {};
        var queryString = 'SELECT s.Id, s.Name, s.PhoneNumber, s.DeviceId, a.Id as AdmissionId, a.FatherPhoneNumber, a.MotherPhoneNumber, a.FatherDeviceId, a.MotherDeviceId FROM Student s INNER JOIN Admission a ON s.AdmissionId = a.Id WHERE s.Status <> 1 AND s.CollegeId = ' + req.params.CollegeId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var response = {
                        StudentCount: rows.length,
                        InstallCount: 0,
                        Installed: [],
                        NotInstalled: []
                    }
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].DeviceId == null && rows[i].FatherDeviceId == null && rows[i].MotherDeviceId == null) {
                            response.NotInstalled.push(rows[i]);
                        } else {
                            response.InstallCount++;
                            response.Installed.push(rows[i]);
                        }
                    }
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = response;
                    res.send(result);
                }
            } else {
                res.send(err);
            }
        });
    },
    sendInstallReminder: function(req, res) {
        var result = {};
        if (req.body.Students.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var students = req.body.Students;
            var collegeName = req.body.CollegeName;
            var text = 'FindInbox is partnered with ' + collegeName + '. Install to stay connected & leverage benefits. Android: https://goo.gl/CNDJCG iOS: https://goo.gl/DXUnCu';
            var message = urlencode(text);
            var username = '<text_local_username>';
            var hash = '<text_local_hash>';
            var sender = '<text_local_sender_name>';
            var phoneNumbers = [];
            for (var i = 0; i < students.length; i++) {
                if (students[i].PhoneNumber != null) {
                    phoneNumbers.push(parseInt(students[i].PhoneNumber));
                }
                if (students[i].FatherPhoneNumber != null) {
                    phoneNumbers.push(parseInt(students[i].FatherPhoneNumber));
                }
                if (students[i].MotherPhoneNumber != null) {
                    phoneNumbers.push(parseInt(students[i].MotherPhoneNumber));
                }
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
    },
}