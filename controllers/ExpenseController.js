'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getAllExpenses: function (req, res) {
        var result = {};
        if (req.body.CollegeId == "" || req.body.CourseId == "" || req.body.BranchId == "" || req.body.DateRange == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT Expenses.Id, Expenses.Particulars, Expenses.Amount, Expenses.ExpenseDate FROM Expenses WHERE CollegeId = ' + req.body.CollegeId + ' AND ExpenseDate BETWEEN "' + req.body.DateRange.startDate + '" AND "' + req.body.DateRange.endDate + '"';
            database.connectionString.query(queryString, function (err, rows) {
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
    addExpense: function (req, res) {
        var result = {};
        if (req.body.Amount == "" || req.body.CollegeId == "" || req.body.Particulars == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO Expenses SET ?';
            database.connectionString.query(queryString, req.body, function (err, rows) {
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
    deleteExpense: function (req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Expenses WHERE Id = ' + req.body.Id;
            database.connectionString.query(queryString, function (err, rows) {
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
    }
}