'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getAllSubTopics: function(req, res) {
        var result = {};
        if (req.body.ClassId == undefined && req.body.UserId == undefined) {
            var queryString = 'SELECT * from SubTopic WHERE TopicId IN (' + req.body.join(",") + ') AND UserId IS NULL';
        } else if (req.body.UserId != undefined) {
            if (req.body.FilterUserVideos) {
                var queryString = 'SELECT * from SubTopic WHERE TopicId IN (' + req.body.TopicIds.join(",") + ') AND UserId = ' + req.body.UserId;
            } else {
                var queryString = 'SELECT * from SubTopic WHERE TopicId IN (' + req.body.TopicIds.join(",") + ') AND (UserId IS NULL OR UserId = ' + req.body.UserId + ')';
            }
        } else {
            var queryString = 'SELECT * from SubTopic WHERE TopicId IN (' + req.body.TopicIds.join(",") + ') AND (UserId IS NULL OR UserId IN (SELECT UserId FROM UserSubject WHERE ClassId = ' + req.body.ClassId + ' AND SubjectId = ' + req.body.SubjectId + '))';
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
    addSubTopics: function(req, res) {
        var result = {};
        if (req.body.Names.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.Names.length; i++) {
                if (req.body.UserId != undefined) {
                    var query = 'INSERT INTO SubTopic(Id, Name, TopicId, VideoURL, UserId) VALUES (null, "' + req.body.Names[i] + '", ' + req.body.TopicId + ', "' + req.body.VideoURL + '", ' + req.body.UserId + ')';
                } else {
                    var query = 'INSERT INTO SubTopic(Id, Name, TopicId, VideoURL) VALUES (null, "' + req.body.Names[i] + '", ' + req.body.TopicId + ', NULL)';
                }
                queries.push(query);
            }
            database.connectionString.query(queries.join("; "), function(err, rows) {
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
    deleteSubTopic: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM SubTopic WHERE Id = ' + req.body.Id;
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
    editSubTopic: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE SubTopic SET Name = "' + req.body.Name + '" WHERE Id = ' + req.body.Id;
            database.connectionString.query(queryString, function(err2, rows2) {
                if (!err2) {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows2;
                    res.send(result);
                } else {
                    res.send(err2);
                }
            });
        }
    }
}