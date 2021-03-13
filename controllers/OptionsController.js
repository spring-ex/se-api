'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getAllOptionsForQuestion: function(req, res) {
        var result = {};
        if (req.params.PackageCode == "SMART") {
            var queryString = 'SELECT * FROM Options WHERE QuestionId = ' + req.params.QuestionId + ' ORDER BY RAND()';
        } else {
            var queryString = 'SELECT * FROM Options WHERE QuestionId = ' + req.params.QuestionId;
        }
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
    getResultsForQuestion: function(req, res) {
        var result = {};
        var queryString = 'SELECT swst.*, q.Solution FROM StudentWritesSmartTest swst INNER JOIN Question q ON swst.QuestionId = q.Id WHERE swst.QuestionId = ' + req.params.QuestionId + ' And swst.StudentId = ' + req.params.StudentId;
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
    updateOption: function(req, res) {
        var result = {};
        var queryString = 'UPDATE Options SET OptionText = "' + req.body.OptionText + '", OptionValue = ' + req.body.OptionValue + ' WHERE Id = ' + req.body.Id;
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
}