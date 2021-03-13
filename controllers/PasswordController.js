'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    changePassword: function (req, res) {
        var result = {};
        if (req.body.CurrentPassword == "" || req.body.NewPassword == "" || req.body.UserId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT Password FROM User WHERE Id = ' + req.body.UserId;
            database.connectionString.query(queryString, function (err, rows) {
                if (!err) {
                    if (req.body.CurrentPassword == rows[0].Password) {
                        var queryString2 = 'UPDATE User SET Password = "' + req.body.NewPassword + '" WHERE Id = "' + req.body.UserId + '"';
                        database.connectionString.query(queryString2, function (err2, rows2) {
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
                        result.Code = statusCodes.errorCodes[3].Code;
                        result.Message = statusCodes.errorCodes[3].Message;
                        result.Data = null;
                        res.send(result);
                        return;
                    }
                } else {
                    res.send(err);
                }
            });
        }
    },
    changeStudentPassword: function (req, res) {
        var result = {};
        if (req.body.CurrentPassword == "" || req.body.NewPassword == "" || req.body.UserId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT Password FROM Student WHERE Id = ' + req.body.UserId;
            database.connectionString.query(queryString, function (err, rows) {
                if (!err) {
                    if (req.body.CurrentPassword == rows[0].Password) {
                        var queryString2 = 'UPDATE Student SET Password = "' + req.body.NewPassword + '" WHERE Id = "' + req.body.UserId + '"';
                        database.connectionString.query(queryString2, function (err2, rows2) {
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
                        result.Code = statusCodes.errorCodes[3].Code;
                        result.Message = statusCodes.errorCodes[3].Message;
                        result.Data = null;
                        res.send(result);
                        return;
                    }
                } else {
                    res.send(err);
                }
            });
        }
    }
}