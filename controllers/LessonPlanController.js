'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getLessonPlan: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM TopicsTaught WHERE SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND ClassId IN (' + req.body.ClassIds.join(",") + ') AND DATE(CreatedAt) = CURDATE()';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                var chapterIds = [];
                var topicIds = [];
                for (var i = 0; i < rows.length; i++) {
                    chapterIds.push(rows[i].ChapterId);
                    topicIds.push(rows[i].TopicId);
                }
                chapterIds = chapterIds.filter(function(item, i, ar) { return ar.indexOf(item) === i; });
                topicIds = topicIds.filter(function(item, i, ar) { return ar.indexOf(item) === i; });
                var queryString2 = 'SELECT c.*, COUNT(st.ChapterId) AS SmartTestCount FROM Chapter c LEFT JOIN ClassHasSmartTest st ON c.Id = st.ChapterId AND st.ClassId IN (' + req.body.ClassIds.join(",") + ') WHERE c.SubjectId IN (' + req.body.SubjectIds.join(",") + ') GROUP BY c.DisplayOrder';
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        var queryString3 = 'SELECT ChapterHasTopic.ChapterId, ChapterHasTopic.TopicId, Chapter.Name AS ChapterName, Topic.Name AS TopicName, Topic.VideoURL, Topic.QuestionsMediaURL FROM ChapterHasTopic INNER JOIN Chapter ON ChapterHasTopic.ChapterId = Chapter.Id INNER JOIN Topic ON ChapterHasTopic.TopicId = Topic.Id WHERE Chapter.SubjectId IN (' + req.body.SubjectIds.join(",") + ')';
                        database.connectionString.query(queryString3, function(err3, rows3) {
                            if (!err3) {
                                var chapters = [],
                                    topics = [],
                                    chapterAttendance = 0,
                                    topicAttendance = 0,
                                    topicName, videoURL, questionsMediaURL, topicId, chapterName, pushTopics = 0;
                                for (var i = 0; i < rows2.length; i++) {
                                    topics = [];
                                    chapterAttendance = 0;
                                    for (var j = 0; j < rows3.length; j++) {
                                        topicAttendance = 0;
                                        if (rows2[i].Id == rows3[j].ChapterId) {
                                            chapterName = rows3[j].ChapterName;
                                            topicName = rows3[j].TopicName;
                                            videoURL = rows3[j].VideoURL;
                                            questionsMediaURL = rows3[j].QuestionsMediaURL;
                                            topicId = rows3[j].TopicId;
                                            for (var k = 0; k < rows.length; k++) {
                                                if (rows[k].TopicId == rows3[j].TopicId && rows[k].ChapterId == rows3[j].ChapterId) {
                                                    topicAttendance++;
                                                    chapterAttendance++;
                                                }
                                            }
                                            topics.push({
                                                Id: topicId,
                                                Name: topicName,
                                                VideoURL: videoURL,
                                                QuestionsMediaURL: questionsMediaURL,
                                                TopicAttendance: topicAttendance == 0 ? null : topicAttendance
                                            });
                                        }
                                    }
                                    chapters.push({
                                        Id: rows2[i].Id,
                                        Name: chapterName,
                                        DisplayOrder: rows2[i].DisplayOrder,
                                        SmartTestCount: rows2[i].SmartTestCount,
                                        ChapterAttendance: chapterAttendance,
                                        Topics: topics
                                    });
                                }
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = chapters;
                                res.send(result);
                            } else {
                                res.send(err3);
                            }
                        });
                    } else {
                        res.send(err2);
                    }
                });
            } else {
                res.send(err);
            }
        });
    },
    getLessonPlanForSkill: function(req, res) {
        var result = {};
        var queryString = '(SELECT TopicId FROM TopicHasQuestion WHERE Tags REGEXP "' + req.body.Tag + '") UNION (SELECT TopicId FROM TopicHasCriteria WHERE Tags REGEXP "' + req.body.Tag + '")';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                var topicIds = [];
                for (var i = 0; i < rows.length; i++) {
                    topicIds.push(rows[i].TopicId);
                }
                var queryString2 = 'SELECT * FROM Chapter WHERE SubjectId = ' + req.body.SubjectId + ' GROUP BY DisplayOrder';
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        var queryString3 = 'SELECT ChapterHasTopic.ChapterId, ChapterHasTopic.TopicId, Chapter.Name AS ChapterName, Topic.Name AS TopicName, Topic.VideoURL, Topic.QuestionsMediaURL FROM ChapterHasTopic INNER JOIN Chapter ON ChapterHasTopic.ChapterId = Chapter.Id INNER JOIN Topic ON ChapterHasTopic.TopicId = Topic.Id WHERE Chapter.SubjectId = ' + req.body.SubjectId + ' AND Topic.Id IN (' + topicIds.join(",") + ')';
                        database.connectionString.query(queryString3, function(err3, rows3) {
                            if (!err3) {
                                var chapters = [],
                                    topics = [],
                                    topicId, topicName, chapterName;
                                for (var i = 0; i < rows2.length; i++) {
                                    topics = [];
                                    chapterName = rows2[i].Name;
                                    for (var j = 0; j < rows3.length; j++) {
                                        if (rows2[i].Id == rows3[j].ChapterId) {
                                            topicName = rows3[j].TopicName;
                                            topicId = rows3[j].TopicId;
                                            topics.push({
                                                Id: topicId,
                                                Name: topicName
                                            });
                                        }
                                    }
                                    chapters.push({
                                        Id: rows2[i].Id,
                                        Name: chapterName,
                                        DisplayOrder: rows2[i].DisplayOrder,
                                        Topics: topics
                                    });
                                }
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = chapters;
                                res.send(result);
                            } else {
                                res.send(err3);
                            }
                        });
                    } else {
                        res.send(err2);
                    }
                });
            } else {
                res.send(err);
            }
        });
    },
    getLessonPlanForSmartTest: function(req, res) {
        var result = {};
        var queryString2 = 'SELECT * FROM Chapter WHERE SubjectId = ' + req.body.SubjectId;
        database.connectionString.query(queryString2, function(err2, rows2) {
            if (!err2) {
                var queryString3 = 'SELECT DISTINCT t.*, cht.ChapterId FROM Topic t INNER JOIN TopicHasQuestion thq ON t.Id = thq.TopicId INNER JOIN ChapterHasTopic cht ON t.Id = cht.TopicId WHERE t.Id IN (SELECT TopicId FROM ChapterHasTopic WHERE ChapterId IN(SELECT Id FROM Chapter WHERE SubjectId = ' + req.body.SubjectId + '))';
                database.connectionString.query(queryString3, function(err3, rows3) {
                    if (!err3) {
                        var chapters = [],
                            topics = [];
                        for (var i = 0; i < rows2.length; i++) {
                            topics = [];
                            for (var j = 0; j < rows3.length; j++) {
                                if (rows2[i].Id == rows3[j].ChapterId) {
                                    topics.push({
                                        Id: rows3[j].Id,
                                        Name: rows3[j].Name
                                    });
                                }
                            }
                            chapters.push({
                                Id: rows2[i].Id,
                                Name: rows2[i].Name,
                                Topics: topics
                            });
                        }
                        result.Code = statusCodes.successCodes[0].Code;
                        result.Message = statusCodes.successCodes[0].Message;
                        result.Data = chapters;
                        res.send(result);
                    } else {
                        res.send(err3);
                    }
                });
            } else {
                res.send(err2);
            }
        });
    },
    topicTaught: function(req, res) {
        var result = {};
        if (req.body.Action == 'add') {
            var queryString = 'INSERT INTO TopicsTaught(Id, ChapterId, TopicId, ClassId, SubjectId) VALUES(null, ' + req.body.ChapterId + ', ' + req.body.TopicId + ', ' + req.body.ClassId + ', ' + req.body.SubjectId + ')';
        } else {
            var queryString = 'DELETE FROM TopicsTaught WHERE ChapterId = ' + req.body.ChapterId + ' AND TopicId = ' + req.body.TopicId + ' AND ClassId = ' + req.body.ClassId + ' AND SubjectId = ' + req.body.SubjectId;
        }
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
}