'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getAllDocuments: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from AdmissionDocuments';
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
    getDocumentsForCollege: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from AdmissionDocuments WHERE Id IN (SELECT DocumentId FROM CollegeHasAdmissionDocuments WHERE CollegeId = ' + req.params.CollegeId + ')';
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
    getDocumentsForStudent: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from AdmissionDocuments WHERE Id IN (SELECT DocumentId FROM StudentHasAdmissionDocuments WHERE StudentId = ' + req.params.StudentId + ')';
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
    addDocumentToCollege: function(req, res) {
        var result = {};
        if (req.body.Type == 1) { //type 1 is for insert, type 2 is for remove document from college
            var queryString = 'INSERT INTO CollegeHasAdmissionDocuments(Id, CollegeId, DocumentId) VALUES (null, ' + req.body.CollegeId + ', ' + req.body.DocumentId + ')';
        } else {
            var queryString = 'DELETE FROM CollegeHasAdmissionDocuments WHERE CollegeId =  ' + req.body.CollegeId + ' AND DocumentId = ' + req.body.DocumentId;
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
    addDocumentToStudent: function(req, res) {
        var result = {};
        if (req.body.Type == 1) { //type 1 is for insert, type 2 is for remove document from college
            var queryString = 'INSERT INTO StudentHasAdmissionDocuments(Id, StudentId, DocumentId) VALUES (null, ' + req.body.StudentId + ', ' + req.body.DocumentId + ')';
        } else {
            var queryString = 'DELETE FROM StudentHasAdmissionDocuments WHERE StudentId =  ' + req.body.StudentId + ' AND DocumentId = ' + req.body.DocumentId;
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
    addPreviousMarksToStudent: function(req, res) {
        var result = {};
        var queryString = 'INSERT INTO StudentPreviousMarks(Id, StudentId, UniversityName, MaxMarks, MarksObtained, CreatedAt, UpdatedAt) VALUES (null, ' + req.body.StudentId + ', "' + req.body.UniversityName + '", ' + req.body.MaxMarks + ', ' + req.body.MarksObtained + ', ' + req.body.CreatedAt + ', ' + req.body.UpdatedAt + ')';
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
    getAllPreviousMarksForStudent: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from StudentPreviousMarks WHERE StudentId = ' + req.params.StudentId;
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
}