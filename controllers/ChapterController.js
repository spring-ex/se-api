'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getChaptersBySubject: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Chapter WHERE SubjectId = ' + req.params.SubjectId;
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
    getChapterAndTopicsBySubject: function(req, res) {
        var result = {};
        if (req.params.IsElective == "true") {
            var queryString = 'SELECT * FROM Chapter WHERE SubjectId IN (SELECT Id FROM Subject WHERE SpecialSubjectId = ' + req.params.SubjectId + ')';
        } else {
            var queryString = 'SELECT * FROM Chapter WHERE SubjectId = ' + req.params.SubjectId;
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var chapterIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        chapterIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT Topic.Name as TopicName, ChapterHasTopic.TopicId, ChapterHasTopic.ChapterId FROM Topic INNER JOIN ChapterHasTopic ON Topic.Id = ChapterHasTopic.TopicId WHERE ChapterId IN (' + chapterIds.join(",") + ')';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            if (rows2.length == 0) {
                                result.Code = statusCodes.errorCodes[0].Code;
                                result.Message = statusCodes.errorCodes[0].Message;
                                result.Data = null;
                                res.send(result);
                            } else {
                                var response = [];
                                for (var i = 0; i < rows.length; i++) {
                                    var chapter = {
                                        Id: rows[i].Id,
                                        Name: rows[i].Name,
                                        DisplayOrder: rows[i].DisplayOrder,
                                        Topics: []
                                    };
                                    for (var j = 0; j < rows2.length; j++) {
                                        if (rows[i].Id == rows2[j].ChapterId) {
                                            chapter.Topics.push({
                                                Id: rows2[j].TopicId,
                                                Name: rows2[j].TopicName
                                            });
                                        }
                                    }
                                    response.push(chapter);
                                }
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = response;
                                res.send(result);
                            }
                        } else {
                            res.send(err2);
                        }
                    });
                }
            } else {
                res.send(err);
            }
        });
    },
    addChapters: function(req, res) {
        var result = {};
        if (req.body.SubjectId == "" || req.body.ChapterNames.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT COUNT(Id) AS ChapterCount FROM Chapter WHERE SubjectId = ' + req.body.SubjectId;
            database.connectionString.query(queryString, function(err2, rows2) {
                if (!err2) {
                    var queries = [];
                    var chapterCount = rows2[0].ChapterCount;
                    for (var i = 0; i < req.body.ChapterNames.length; i++) {
                        chapterCount++;
                        var query = 'INSERT INTO Chapter(Id, Name, SubjectId, DisplayOrder) VALUES (null, "' + req.body.ChapterNames[i] + '", ' + req.body.SubjectId + ', ' + chapterCount + ')';
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
                } else {
                    res.send(err2);
                }
            });
        }
    },
    editChapter: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Chapter SET Name = "' + req.body.Name + '" WHERE Id = ' + req.body.Id;
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