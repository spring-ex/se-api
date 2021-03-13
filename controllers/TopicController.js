'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getAllTopics: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Topic';
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
    getTopicPresentationURL: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM TopicPresentationURL WHERE TopicId = ' + req.params.TopicId + ' AND ClassId= ' + req.params.ClassId + ' AND UserId IN (SELECT Id FROM User WHERE CollegeId = ' + req.params.CollegeId + ')';
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
    getTopicDefaultPresentation: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM TopicHasDefaultPresentation WHERE TopicId = ' + req.params.TopicId + ' AND ChapterId = ' + req.params.ChapterId;
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
    getTopicDefaultPresentationByChapter: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM TopicHasDefaultPresentation WHERE ChapterId = ' + req.params.ChapterId;
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
    getTopicsForSubject: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Topic WHERE Id IN(SELECT TopicId FROM ChapterHasTopic WHERE ChapterId IN (SELECT Id FROM Chapter WHERE SubjectId = ' + req.params.Id + '))';
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
    getTopicsForChapter: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Topic WHERE Id IN(SELECT TopicId FROM ChapterHasTopic WHERE ChapterId = ' + req.params.ChapterId + ')';
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
    getCurrentSubjectTopicsForToday: function(req, res) {
        //req object should be 
        // var obj = {
        //     ClassId: null,
        //     SubjectId: null,
        // }
        var result = {};
        if (req.body.SubjectId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT c.Name AS ChapterName, t.Name AS TopicName, s.Rating, tt.* FROM TopicsTaught tt INNER JOIN Chapter c ON tt.ChapterId = c.Id INNER JOIN Topic t ON tt.TopicId = t.Id LEFT JOIN StudentRatesTopic s ON tt.TopicId = s.TopicId AND s.StudentId = ' + req.body.StudentId + ' WHERE DATE(tt.CreatedAt) = CURDATE() AND tt.SubjectId = ' + req.body.SubjectId + ' AND tt.ClassId = ' + req.body.ClassId + ' ORDER BY tt.TopicId';
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
    getTopicsForChapterWithPPT: function(req, res) {
        var result = {};
        var queryString = 'SELECT t.*, tpu.MediaURL FROM Topic t LEFT JOIN TopicPresentationURL tpu ON t.Id = tpu.TopicId AND tpu.UserId = ' + req.params.UserId + ' WHERE t.Id IN(SELECT TopicId FROM ChapterHasTopic WHERE ChapterId = ' + req.params.ChapterId + ')';
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
    getStudentLikeStatus: function(req, res) {
        var result = {};
        var queryString = 'SELECT HasLiked FROM StudentLikesTopic WHERE TopicId  = ' + req.params.TopicId + ' AND StudentId = ' + req.params.StudentId;
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
    getAllTopicsForSmartTest: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Topic WHERE Id IN(SELECT TopicId FROM TopicHasSmartTest WHERE SmartTestId = ' + req.params.SmartTestId + ')';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var topicIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        topicIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT c.Name as ChapterName, cht.* FROM Chapter c INNER JOIN ChapterHasTopic cht ON c.Id = cht.ChapterId WHERE cht.TopicId IN (' + topicIds.join(",") + ')';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            var chapters = [];
                            for (var i = 0; i < rows2.length; i++) {
                                var topics = [];
                                for (var j = 0; j < rows.length; j++) {
                                    if (rows2[i].TopicId == rows[j].Id) {
                                        topics.push({
                                            Id: rows[j].Id,
                                            Name: rows[j].Name
                                        });
                                    }
                                }
                                chapters.push({
                                    Id: rows2[i].ChapterId,
                                    Name: rows2[i].ChapterName,
                                    Topics: topics
                                });
                            }
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = chapters;
                            res.send(result);
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
    addTopics: function(req, res) {
        var result = {};
        if (req.body.TopicNames.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.TopicNames.length; i++) {
                if (req.body.TopicVideoURLs[i] == null) {
                    var query = 'INSERT INTO Topic(Id, Name, VideoURL) VALUES (null, "' + req.body.TopicNames[i] + '", NULL)';
                } else {
                    var query = 'INSERT INTO Topic(Id, Name, VideoURL) VALUES (null, "' + req.body.TopicNames[i] + '", "' + req.body.TopicVideoURLs[i] + '")';
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
    createTopicsAndAssignToChapter: function(req, res) {
        var result = {};
        if (req.body.Topics.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.Topics.TopicNames.length; i++) {
                if (req.body.Topics.TopicVideoURLs[i] == null) {
                    var query = 'INSERT INTO Topic(Id, Name, VideoURL) VALUES (null, "' + req.body.Topics.TopicNames[i] + '", NULL)';
                } else {
                    var query = 'INSERT INTO Topic(Id, Name, VideoURL) VALUES (null, "' + req.body.Topics.TopicNames[i] + '", "' + req.body.Topics.TopicVideoURLs[i] + '")';
                }
                queries.push(query);
            }
            database.connectionString.query(queries.join("; "), function(err, rows) {
                if (!err) {
                    var topicIds = [];
                    if (rows.length == undefined) {
                        topicIds.push(rows.insertId);
                    } else {
                        for (var i = 0; i < rows.length; i++) {
                            topicIds.push(rows[i].insertId);
                        }
                    }
                    var queries2 = [];
                    for (var i = 0; i < topicIds.length; i++) {
                        var query = 'INSERT INTO ChapterHasTopic(Id, ChapterId, TopicId) VALUES (null, ' + req.body.ChapterId + ', "' + topicIds[i] + '")';
                        queries2.push(query);
                    }
                    database.connectionString.query(queries2.join("; "), function(err2, rows2) {
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
                    res.send(err);
                }
            });
        }
    },
    assignToChapter: function(req, res) {
        var result = {};
        if (req.body.TopicIds.length == 0 || req.body.ChapterId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.TopicIds.length; i++) {
                var query = 'INSERT INTO ChapterHasTopic(Id, ChapterId, TopicId) VALUES (null, ' + req.body.ChapterId + ', "' + req.body.TopicIds[i] + '")';
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
    assignVideosToTopics: function(req, res) {
        var result = {};
        if (req.body.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.length; i++) {
                if (req.body[i].VideoURL == null || req.body[i].VideoURL == "") {
                    var query = 'UPDATE Topic SET VideoURL = NULL WHERE Id = ' + req.body[i].Id;
                } else {
                    var query = 'UPDATE Topic SET VideoURL = "' + req.body[i].VideoURL + '" WHERE Id = ' + req.body[i].Id;
                }
                queries.push(query);
                for (var j = 0; j < req.body[i].SubTopics.length; j++) {
                    var query = 'UPDATE SubTopic SET VideoURL = "' + req.body[i].SubTopics[j].VideoURL + '", YTChannelName = "' + req.body[i].SubTopics[j].YTChannelName + '" WHERE Id = ' + req.body[i].SubTopics[j].Id;
                    queries.push(query);
                }
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
    assignQPToTopics: function(req, res) {
        var result = {};
        if (req.body.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.length; i++) {
                if (req.body[i].QuestionsMediaURL == null || req.body[i].QuestionsMediaURL == "") {
                    var query = 'UPDATE Topic SET QuestionsMediaURL = NULL WHERE Id = ' + req.body[i].Id;
                } else {
                    var query = 'UPDATE Topic SET QuestionsMediaURL = "' + req.body[i].QuestionsMediaURL + '" WHERE Id = ' + req.body[i].Id;
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
    addDefaultPresentationToTopic: function(req, res) {
        var result = {};
        if (req.body.Topics.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.Topics.length; i++) {
                if (req.body.Topics[i].MediaURL == null || req.body.Topics[i].MediaURL == "") {
                    var query = 'INSERT INTO TopicHasDefaultPresentation(TopicId, ChapterId, MediaURL) VALUES(' + req.body.Topics[i].Id + ', ' + req.body.ChapterId + ', NULL) ON DUPLICATE KEY UPDATE MediaURL = "NULL"';
                } else {
                    var query = 'INSERT INTO TopicHasDefaultPresentation(TopicId, ChapterId, MediaURL) VALUES(' + req.body.Topics[i].Id + ',' + req.body.ChapterId + ', "' + req.body.Topics[i].MediaURL + '") ON DUPLICATE KEY UPDATE MediaURL = "' + req.body.Topics[i].MediaURL + '"';
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
    addPresentationToTopic: function(req, res) {
        var result = {};
        var queryString = 'SELECT ClassId FROM UserSubject WHERE UserId = ' + req.body.UserId + ' AND SubjectId = ' + req.body.SubjectId;
        database.connectionString.query(queryString, function(err2, rows2) {
            if (!err2) {
                if (req.body.MediaURL == null) {
                    var query = 'DELETE FROM TopicPresentationURL WHERE TopicId = ' + req.body.TopicId + ' AND UserId = ' + req.body.UserId;
                } else {
                    var query = 'INSERT INTO TopicPresentationURL (TopicId, UserId, ClassId, MediaURL) VALUES(' + req.body.TopicId + ',' + req.body.UserId + ', ' + rows2[0].ClassId + ', "' + req.body.MediaURL + '") ON DUPLICATE KEY UPDATE MediaURL = "' + req.body.MediaURL + '"';
                }
                database.connectionString.query(query, function(err, rows) {
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
    },
    deleteTopic: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Topic WHERE Id = ' + req.body.Id;
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
    },
    editTopic: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Topic SET Name = "' + req.body.Name + '" WHERE Id = ' + req.body.Id;
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
    },
    studentLikesTopic: function(req, res) {
        var result = {};
        if (req.body.StudentId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO StudentLikesTopic(StudentId, ChapterId, TopicId, HasLiked, Comments) VALUES(' + req.body.StudentId + ', ' + req.body.ChapterId + ', ' + req.body.TopicId + ',"' + req.body.HasLiked + '", "' + req.body.Comments + '") ON DUPLICATE KEY UPDATE HasLiked = VALUES(HasLiked), Comments = VALUES(Comments)';
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
    },
    studentRatesTopic: function(req, res) {
        var result = {};
        if (req.body.StudentId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO StudentRatesTopic(StudentId, ChapterId, TopicId, ClassId, Rating) VALUES(' + req.body.StudentId + ', ' + req.body.ChapterId + ', ' + req.body.TopicId + ',' + req.body.ClassId + ', ' + req.body.Rating + ') ON DUPLICATE KEY UPDATE Rating = VALUES(Rating)';
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
    getRatingForTopics: function(req, res) {
        var result = {};
        var queryString = 'SELECT StudentId, ChapterId, TopicId, ClassId, SUM(Rating) AS Rating, COUNT(StudentId) AS NumberOfStudents FROM StudentRatesTopic WHERE ClassId IN (' + req.body.ClassIds.join(",") + ') AND TopicId IN (SELECT  TopicId FROM ChapterHasTopic WHERE ChapterId IN (SELECT  Id FROM Chapter WHERE SubjectId IN (' + req.body.SubjectIds.join(",") + '))) GROUP BY TopicId';
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
    getStudentRatingForTopic: function(req, res) {
        var result = {};
        var queryString = 'SELECT Rating FROM StudentRatesTopic WHERE TopicId = ' + req.body.TopicId + ' AND StudentId = ' + req.body.StudentId + ' AND ChapterId = ' + req.body.ChapterId;
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
    getLikeStatsForTopic: function(req, res) {
        var result = {};
        if (req.body.StudentId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT COUNT(IF(HasLiked = "1", 1, NULL)) AS LikeCount, Count(IF(HasLiked = "0", 1, NULL)) AS DislikeCount FROM StudentLikesTopic WHERE TopicId = ' + req.params.TopicId;
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