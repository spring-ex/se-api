'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');
var notificationCodesController = require('./NotificationCodesController.js');
var FCM = require('fcm-push');
var serverKey = 'AAAAdvkI0U4:APA91bG7diSbxUWg-WFkyKrWTorqy_kPnhfo1dmzk0wznMNKjRVTg3y5CFCBwlcxW6U1D3tGPJhB17gjsHynke4ZaP5b2Xr99WTwVXY_jNooBhNHb4ImcZ90ejNH6sU36AJQ79eGQ4Nu';
var fcm = new FCM(serverKey);

module.exports = {
    getAllSmartTestsForSubject: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from SmartTest WHERE Id IN(SELECT SmartTestId FROM TopicHasSmartTest WHERE SubjectId = ' + req.params.SubjectId + ')';
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
    getAllSmartTestsForChapter: function(req, res) {
        var result = {};
        var queryString = 'SELECT st.*, COUNT(sthq.Id) as QuestionCount FROM SmartTest st LEFT JOIN SmartTestHasQuestions sthq ON st.Id = sthq.SmartTestId WHERE st.ChapterId = ' + req.params.ChapterId + ' GROUP BY sthq.SmartTestId';
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
    getSmartTestMetrics: function(req, res) {
        var result = {};
        var queryString = 'SELECT COUNT(Id) as QuestionCount FROM SmartTestHasQuestions WHERE SmartTestId = ' + req.params.SmartTestId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var queryString2 = 'SELECT COUNT(IF(ResultPercentage = 100, 1, NULL)) as CorrectAnswers FROM StudentWritesSmartTest WHERE StudentId = ' + req.params.StudentId + ' AND QuestionId IN (SELECT QuestionId FROM SmartTestHasQuestions WHERE SmartTestId = ' + req.params.SmartTestId + ')';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = [{
                                QuestionCount: rows[0].QuestionCount,
                                CorrectAnswers: rows2[0].CorrectAnswers
                            }];
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
    getTopicsForStudent: function(req, res) {
        var result = {};
        var queryString = 'SELECT TopicId, CAST(TopicScore AS DECIMAL (10 , 6 )) AS TopicAverage, CAST(TestScore AS DECIMAL (10 , 6 )) AS TopicTestAverage FROM TopicPerformanceIndex WHERE SubjectId = ' + req.params.SubjectId + ' AND StudentId = ' + req.params.StudentId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows;
                    res.send(result);
                }
            } else {
                res.send(err);
            }
        });
    },
    getTopicsForClass: function(req, res) {
        var result = {};
        var queryString = 'SELECT TopicId, AVG(TopicScore) AS TopicAverage, AVG(TestScore) AS TopicTestAverage FROM TopicPerformanceIndex WHERE SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND StudentId IN(SELECT Id From Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ')) GROUP BY TopicId';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows;
                    res.send(result);
                }
            } else {
                res.send(err);
            }
        });
    },
    createSmartTest: function(req, res) {
        var result = {};
        if (req.body.Name == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO SmartTest(Id, Name, EndDate, EnableTimeConstraint, Instructions, ChapterId, SubjectId, TestType) VALUES(null, "' + req.body.Name + '", NOW(), "' + req.body.EnableTimeConstraint + '", "' + req.body.Instructions + '", ' + req.body.ChapterId + ', ' + req.body.SubjectId + ', ' + req.body.TestType + ')';
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    var queries = [];
                    for (var i = 0; i < req.body.Questions.length; i++) {
                        var query = 'INSERT INTO SmartTestHasQuestions(Id, SmartTestId, QuestionId) VALUES(null, ' + rows.insertId + ', ' + req.body.Questions[i].Id + ')';
                        queries.push(query);
                    }
                    database.connectionString.query(queries.join(";"), function(err2, rows2) {
                        if (!err) {
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = rows2;
                            res.send(result);
                        } else {
                            res.send(err2);
                        }
                    });
                } else {
                    res.send(err2);
                }
            });

        }
    },
    activateSmartTestForClass: function(req, res) {
        var result = {};
        if (req.body.ClassId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            if (req.body.Action == "add") {
                var queryString = 'INSERT INTO ClassHasSmartTest(ClassId, ChapterId) VALUES(' + req.body.ClassId + ', ' + req.body.ChapterId + ')';
            } else {
                var queryString = 'DELETE FROM ClassHasSmartTest WHERE ClassId = ' + req.body.ClassId + ' AND ChapterId = ' + req.body.ChapterId;
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
    },
    getAllSmartTestsForClass: function(req, res) {
        var result = {};
        var queryString = 'SELECT st.* FROM SmartTest st INNER JOIN TopicHasSmartTest thst ON st.Id = thst.SmartTestId WHERE thst.SubjectId = ' + req.params.SubjectId + ' AND st.ClassId = ' + req.params.ClassId;
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
    getAllSmartTestsForStudent: function(req, res) {
        var result = {};
        if (req.params.TestType == 1) {
            var queryString = 'SELECT * FROM SmartTest WHERE ChapterId = ' + req.params.ChapterId + ' AND TestType = ' + req.params.TestType;
        } else {
            var queryString = 'SELECT * FROM SmartTest WHERE ChapterId IN (SELECT Id FROM Chapter WHERE SubjectId IN (SELECT Id FROM Subject WHERE BranchId = ' + req.params.BranchId + ')) AND TestType = ' + req.params.TestType;
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var smartTestIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        smartTestIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT * FROM StudentCompletesSmartTest WHERE StudentId = ' + req.params.StudentId + ' AND SmartTestId IN (' + smartTestIds.join(", ") + ')';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            for (var i = 0; i < rows.length; i++) {
                                rows[i].IsComplete = false;
                                for (var j = 0; j < rows2.length; j++) {
                                    if (rows[i].Id == rows2[j].SmartTestId && rows2[j].IsCompleted == '1') {
                                        rows[i].IsComplete = true;
                                    }
                                }
                            }
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = rows;
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
    studentAnswersQuestion: function(req, res) {
        var result = {};
        if (req.body.Name == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString3 = 'SELECT * FROM StudentWritesSmartTest WHERE StudentId = ' + req.body.StudentId + ' AND QuestionId = ' + req.body.QuestionId;
            database.connectionString.query(queryString3, function(err3, rows3) {
                if (!err3) {
                    if (rows3.length == 0) {
                        var hasCompleted = req.body.HasCompleted;
                        var smartTestId = req.body.SmartTestId;
                        delete req.body.HasCompleted;
                        delete req.body.SmartTestId;
                        var queryString = 'INSERT INTO StudentWritesSmartTest SET ?';
                        database.connectionString.query(queryString, req.body, function(err, rows) {
                            if (!err) {
                                if (hasCompleted) {
                                    var obj = {
                                        Id: null,
                                        StudentId: req.body.StudentId,
                                        SmartTestId: smartTestId,
                                        IsCompleted: hasCompleted
                                    };
                                    var queryString2 = 'INSERT INTO StudentCompletesSmartTest SET ?';
                                    database.connectionString.query(queryString2, obj, function(err2, rows2) {
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
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = rows;
                                    res.send(result);
                                }
                            } else {
                                res.send(err);
                            }
                        });
                    } else {
                        var hasCompleted = req.body.HasCompleted;
                        var smartTestId = req.body.SmartTestId;
                        delete req.body.HasCompleted;
                        delete req.body.SmartTestId;
                        var queryString = 'UPDATE StudentWritesSmartTest SET SelectedOption = ' + req.body.SelectedOption + ', ResultPercentage = ' + req.body.ResultPercentage + ' WHERE StudentId = ' + req.body.StudentId + ' AND QuestionId = ' + req.body.QuestionId;
                        database.connectionString.query(queryString, req.body, function(err, rows) {
                            if (!err) {
                                if (hasCompleted) {
                                    var obj = {
                                        Id: null,
                                        StudentId: req.body.StudentId,
                                        SmartTestId: smartTestId,
                                        IsCompleted: hasCompleted
                                    };
                                    var queryString2 = 'INSERT INTO StudentCompletesSmartTest SET ?';
                                    database.connectionString.query(queryString2, obj, function(err2, rows2) {
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
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = rows;
                                    res.send(result);
                                }
                            } else {
                                res.send(err);
                            }
                        });
                    }
                } else {
                    res.send(err3);
                }
            });
        }
    },
    deleteSmartTest: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM StudentWritesSmartTest WHERE QuestionId IN (SELECT QuestionId FROM SmartTestHasQuestions WHERE SmartTestId  = ' + req.body.Id + ')';
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    var queryString2 = 'DELETE FROM SmartTest WHERE Id = ' + req.body.Id;
                    database.connectionString.query(queryString2, function(err2, rows2) {
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
    }
}