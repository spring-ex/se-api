'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');
var urlencode = require('urlencode');
var http = require('http');
var asyncLoop = require('node-async-loop');

module.exports = {
    getAllEnquires: function(req, res) {
        var result = {};
        var queryString = 'SELECT Enquiry.Id, Enquiry.CourseId, Enquiry.BranchId, Enquiry.Name, Enquiry.FatherName, Enquiry.PhoneNumber, Enquiry.MotherPhoneNumber, Enquiry.FollowUpDate, Enquiry.UniqueId, Enquiry.CreatedAt, Enquiry.Status, Enquiry.Searchterm, Enquiry.Note, Branch.Name as BranchName from Enquiry INNER JOIN Branch ON Enquiry.BranchId = Branch.Id WHERE Enquiry.CollegeId = ' + req.params.CollegeId + ' AND YEAR(Enquiry.CreatedAt) = YEAR(CURDATE())';
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
    changeEnquiryStatus: function(req, res) {
        var result = {};
        var queryString = 'UPDATE Enquiry SET Status = "' + req.body.Status + '" WHERE Id = ' + req.body.Id;
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
    getEnquiryById: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Enquiry WHERE Id = ' + req.params.EnquiryId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                } else {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows[0];
                }
                res.send(result);
            } else {
                res.send(err);
            }
        });
    },
    addEnquiry: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.PhoneNumber == "" || req.body.FatherName == "" || req.body.MotherName == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var collegeName = req.body.CollegeName;
            var collegePh = req.body.CollegePhone;
            delete req.body.CollegeName;
            delete req.body.CollegePhone;
            var queryString = 'INSERT INTO Enquiry SET ?';
            database.connectionString.query(queryString, req.body, function(err, rows) {
                if (!err) {
                    var message = urlencode("Thank you for visiting " + collegeName + ". For any further queries, please contact " + collegePh + ".");
                    var username = '<text_local_username>';
                    var hash = '<text_local_hash>';
                    var sender = '<text_local_sender_name>';
                    req.body.PhoneNumber = parseInt(req.body.PhoneNumber);
                    var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + req.body.PhoneNumber + '&message=' + message
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
                } else {
                    res.send(err);
                }
            });
        }
    },
    addEnquiryWithoutToken: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.PhoneNumber == "" || req.body.FatherName == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO Enquiry SET ?';
            database.connectionString.query(queryString, req.body, function(err, rows) {
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
    sendSms: function(req, res) {
        var result = {};
        if (req.body.PhoneNumbers.length == 0 || req.body.Message == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var message = urlencode(req.body.Message);
            var username = '<text_local_username>';
            var hash = '<text_local_hash>';
            var sender = '<text_local_sender_name>';
            for (var i = 0; i < req.body.PhoneNumbers.length; i++) {
                req.body.PhoneNumbers[i] = parseInt(req.body.PhoneNumbers[i]);
            }
            var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + req.body.PhoneNumbers + '&message=' + message
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
    deleteEnquiry: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Enquiry WHERE Id = ' + req.body.Id;
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
    deleteEnquiries: function(req, res) {
        var result = {};
        if (req.body.Ids.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Enquiry WHERE Id IN (' + req.body.Ids.join(",") + ')';
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
    updateEnquiry: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Enquiry SET ? WHERE Id = ' + req.body.Id;
            database.connectionString.query(queryString, req.body, function(err, rows) {
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
    addBulkEnquiry: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.PhoneNumber == "" || req.body.FatherName == "" || req.body.MotherName == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var count = 0;
            asyncLoop(req.body, function(item, next) {
                var queryString = 'INSERT INTO Enquiry SET ?';
                database.connectionString.query(queryString, item, function(err, rows) {
                    if (!err) {
                        count++;
                        if (count == req.body.length) {
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = rows;
                            res.send(result);
                        } else {
                            next();
                        }
                    } else {
                        res.send(err);
                    }
                });
            }, function(err) {
                if (err) {
                    res.send(err);
                    return;
                }
            });
        }
    }
}