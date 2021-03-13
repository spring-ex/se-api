'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'findinbox',
    api_key: '339474782685825',
    api_secret: 'X29i8LvZJB8chSLvhd97g3mwWCs'
});

module.exports = {
    getAllCriteria: function(req, res) {
        var result = {};
        var queryString = 'SELECT c.*, bt.LevelName, thc.Tags FROM Criteria c LEFT JOIN BloomsTaxonomy bt ON c.BTId = bt.Id LEFT JOIN TopicHasCriteria thc ON c.Id = thc.CriteriaId WHERE thc.TopicId = ' + req.params.TopicId + ' AND thc.ChapterId = ' + req.params.ChapterId;
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
    getQuestionPaper: function(req, res) {
        var result = {};
        var queryString = 'SELECT c.Id, c.Name, c.ImageURL, co.Name AS COName, bt.Name AS BTName, bt.LevelName, thc.COId, thc.BTId, tohc.Tags, thc.MaxScore FROM TestHasCriteria thc LEFT JOIN TopicHasCriteria tohc ON tohc.CriteriaId = thc.CriteriaId LEFT JOIN Criteria c ON c.Id = thc.CriteriaId LEFT JOIN CourseOutcome co ON co.Id = thc.COId LEFT JOIN BloomsTaxonomy bt ON bt.Id = thc.BTId WHERE thc.TestId = ' + req.params.TestId;
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
    getAllCriteriaForStudentAndTest: function(req, res) {
        var result = {};
        var queryString = 'SELECT c.Id, c.Name, c.ImageURL, thc.COId, thc.BTId, thc.MaxScore, tohc.Tags FROM Criteria c, TestHasCriteria thc, TopicHasCriteria tohc WHERE c.Id = thc.CriteriaId AND c.Id = tohc.CriteriaId AND thc.TestId = ' + req.params.TestId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var queryString2 = 'SELECT * FROM StudentWritesCriteria WHERE StudentId = ' + req.params.StudentId + ' AND TestId = ' + req.params.TestId;
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            for (var i = 0; i < rows.length; i++) {
                                rows[i].MarksScored = null;
                                rows[i].TestId = req.params.TestId;
                                for (var j = 0; j < rows2.length; j++) {
                                    if (rows[i].Id == rows2[j].CriteriaId) {
                                        rows[i].MarksScored = rows2[j].MarksScored;
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
    addCriteria: function(req, res) {
        var result = {};
        if (req.body.Name == "" && req.body.ImageURL == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var topics = req.body.Topics;
            delete req.body.Topics;
            var tags = req.body.Tags;
            delete req.body.Tags;
            var queryString = 'INSERT INTO Criteria SET ?';
            database.connectionString.query(queryString, req.body, function(err, rows) {
                if (!err) {
                    var queries = [];
                    for (var i = 0; i < topics.length; i++) {
                        var query = 'INSERT INTO TopicHasCriteria(ChapterId, TopicId, CriteriaId, Tags) VALUES(' + topics[i].ChapterId + ',' + topics[i].TopicId + ',' + rows.insertId + ', "' + tags + '")';
                        queries.push(query);
                    }
                    database.connectionString.query(queries.join(";"), function(err3, rows3) {
                        if (!err3) {
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = rows3;
                            res.send(result);
                        } else {
                            res.send(err3);
                        }
                    });
                } else {
                    res.send(err);
                }
            });
        }
    },
    addQuestionToTest: function(req, res) {
        var result = {};
        if (req.body.TestId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO TestHasCriteria SET ?';
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
    addQuestionsToTest: function(req, res) {
        var result = {};
        if (req.body.TestId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.CriteriaIds.length; i++) {
                var query = 'INSERT INTO TestHasCriteria(TestId, CriteriaId, MaxScore, COId, BTId) VALUES(' + req.body.TestId + ', ' + req.body.CriteriaIds[i] + ', 3, null, null)';
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
    editCriteria: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Criteria SET Name = "' + req.body.Name + '", BTId = ' + req.body.BTId + ' WHERE Id = ' + req.body.Id;
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    if (req.body.TopicId != null) {
                        var queryString2 = 'UPDATE TopicHasCriteria SET TopicId = ' + req.body.TopicId + ', Tags = "' + req.body.Tags + '" WHERE CriteriaId = ' + req.body.Id;
                    } else {
                        var queryString2 = 'UPDATE TopicHasCriteria SET Tags = "' + req.body.Tags + '" WHERE CriteriaId = ' + req.body.Id;
                    }
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err) {
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = rows;
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
    updateCriteriaForStudent: function(req, res) {
        var result = {};
        if (req.body.StudentId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.Criteria.length; i++) {
                var query = 'INSERT INTO StudentWritesCriteria(StudentId, TestId, CriteriaId, MarksScored, ResultPercentage) VALUES(' + req.body.Student.Id + ', ' + req.body.Test.Id + ', ' + req.body.Criteria[i].Id + ', ' + req.body.Criteria[i].MarksScored + ', ' + req.body.Criteria[i].ResultPercentage + ') ON DUPLICATE KEY UPDATE MarksScored = VALUES(MarksScored), ResultPercentage = VALUES(ResultPercentage)';
                queries.push(query);
            }
            database.connectionString.query(queries.join(";"), function(err, rows) {
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
    deleteCriteria: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Criteria WHERE Id = ' + req.body.Id;
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    if (req.body.ImagePublicId != null) {
                        cloudinary.uploader.destroy(req.body.ImagePublicId, function(ress) {
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = rows;
                            res.send(result);
                        }, { invalidate: true });
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
    },
    removeQuestionFromTest: function(req, res) {
        var result = {};
        if (req.body.TestId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM TestHasCriteria WHERE TestId = ' + req.body.TestId + ' AND CriteriaId = ' + req.body.CriteriaId;
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    var queryString3 = 'DELETE FROM StudentWritesCriteria WHERE TestId = ' + req.body.TestId + ' AND CriteriaId = ' + req.body.CriteriaId;
                    database.connectionString.query(queryString3, function(err3, rows3) {
                        if (!err3) {
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = rows3;
                            res.send(result);
                        } else {
                            res.send(err3);
                        }
                    });
                } else {
                    res.send(err);
                }
            });
        }
    },
    removeCriteriaImage: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
        } else {
            var query2 = 'UPDATE Criteria SET ImageURL = null, ImagePublicId = null WHERE Id = ' + req.body.Id;
            database.connectionString.query(query2, function(err2, rows2) {
                if (!err2) {
                    cloudinary.uploader.destroy(req.body.QuestionPublicId, function(ress) {
                        result.Code = statusCodes.successCodes[0].Code;
                        result.Message = statusCodes.successCodes[0].Message;
                        result.Data = rows2;
                        res.send(result);
                    }, { invalidate: true });
                } else {
                    res.send(err2);
                }
            });
        }
    }
}