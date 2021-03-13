'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getClassStatsForSubject: function(req, res) {
        //req object should be 
        // var obj = {
        //     ClassIds: [],
        //     SubjectIds: []
        // }
        var result = {};
        if (req.body.ClassIds.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryForExamAverage = 'SELECT AVG(ResultPercentage) AS AvgFromExam FROM StudentWritesTest WHERE TestId IN(SELECT Id FROM Test WHERE ClassId IN (' + req.body.ClassIds.join(",") + ') AND SubjectId IN(' + req.body.SubjectIds.join(",") + ') AND IsFinal = true)';
            var queryForTestAverage = 'SELECT AVG(ResultPercentage) AS AvgFromTest FROM StudentWritesTest WHERE TestId IN(SELECT Id FROM Test WHERE ClassId IN (' + req.body.ClassIds.join(",") + ') AND SubjectId IN(' + req.body.SubjectIds.join(",") + ') AND IsFinal = false)';
            var queryForQuizAverage = 'SELECT AVG(ResultPercentage) AS AvgFromQuiz FROM StudentWritesSmartTest WHERE StudentId IN(SELECT Id FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ')) AND QuestionId IN(SELECT QuestionId FROM TopicHasQuestion WHERE ChapterId IN(SELECT Id FROM Chapter WHERE SubjectId IN(' + req.body.SubjectIds.join(",") + ')))';
            var queryString = queryForExamAverage + ';' + queryForTestAverage + ';' + queryForQuizAverage + ';';
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = {
                        AverageFromExam: rows[0][0].AvgFromExam,
                        AverageFromTest: rows[1][0].AvgFromTest,
                        AverageFromQuiz: rows[2][0].AvgFromQuiz
                    }
                    res.send(result);
                } else {
                    res.send(err);
                }
            });
        }
    },
    getAllSubjectStatsForStudent: function(req, res) {
        //req object should be 
        // var obj = {
        //     StudentId: null,
        //     ClassId: null
        // }
        var result = {};
        if (req.body.ClassId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryForExamAverage = 'SELECT AVG(ResultPercentage) AS AvgFromExam FROM StudentWritesTest WHERE StudentId = ' + req.body.StudentId + ' AND TestId IN(SELECT Id FROM Test WHERE ClassId IN (' + req.body.ClassId + ') AND IsFinal = true)';
            var queryForTestAverage = 'SELECT AVG(ResultPercentage) AS AvgFromTest FROM StudentWritesTest WHERE StudentId = ' + req.body.StudentId + ' AND TestId IN(SELECT Id FROM Test WHERE ClassId IN (' + req.body.ClassId + ') AND IsFinal = false)';
            var queryForQuizAverage = 'SELECT AVG(ResultPercentage) AS AvgFromQuiz FROM StudentWritesSmartTest WHERE StudentId =' + req.body.StudentId;
            var queryString = queryForExamAverage + ';' + queryForTestAverage + ';' + queryForQuizAverage + ';';
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = {
                        AverageFromExam: rows[0][0].AvgFromExam,
                        AverageFromTest: rows[1][0].AvgFromTest,
                        AverageFromQuiz: rows[2][0].AvgFromQuiz
                    }
                    res.send(result);
                } else {
                    res.send(err);
                }
            });
        }
    },
    getSubjectStatsForStudent: function(req, res) {
        //req object should be 
        // var obj = {
        //     StudentId: null,
        //     ClassId: null,
        //     SubjectId: null
        // }
        var result = {};
        if (req.body.ClassId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryForExamAverage = 'SELECT AVG(ResultPercentage) AS AvgFromExam FROM StudentWritesTest WHERE StudentId = ' + req.body.StudentId + ' AND TestId IN(SELECT Id FROM Test WHERE ClassId = ' + req.body.ClassId + ' AND SubjectId = ' + req.body.SubjectId + ' AND IsFinal = true)';
            var queryForTestAverage = 'SELECT AVG(ResultPercentage) AS AvgFromTest FROM StudentWritesTest WHERE StudentId = ' + req.body.StudentId + ' AND TestId IN(SELECT Id FROM Test WHERE ClassId = ' + req.body.ClassId + ' AND SubjectId = ' + req.body.SubjectId + ' AND IsFinal = false)';
            var queryForQuizAverage = 'SELECT AVG(ResultPercentage) AS AvgFromQuiz FROM StudentWritesSmartTest WHERE StudentId = ' + req.body.StudentId + ' AND QuestionId IN(SELECT QuestionId FROM TopicHasQuestion WHERE ChapterId IN(SELECT Id FROM Chapter WHERE SubjectId = ' + req.body.SubjectId + '))';
            var queryString = queryForExamAverage + ';' + queryForTestAverage + ';' + queryForQuizAverage + ';';
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = {
                        AverageFromExam: rows[0][0].AvgFromExam,
                        AverageFromTest: rows[1][0].AvgFromTest,
                        AverageFromQuiz: rows[2][0].AvgFromQuiz
                    }
                    res.send(result);
                } else {
                    res.send(err);
                }
            });
        }
    },
    getClassStatsForPrimeKeywords: function(req, res) {
        //req object should be 
        // var obj = {
        //     ClassIds: [],
        //     SubjectIds: [],
        //     Tag: null
        // }
        var result = {};
        if (req.body.ClassIds.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryForExamAverage = 'SELECT AVG(ResultPercentage) AS AvgFromExam FROM StudentWritesCriteria WHERE CriteriaId IN (SELECT thc.CriteriaId FROM TestHasCriteria thc INNER JOIN TopicHasCriteria tohc ON thc.CriteriaId = tohc.CriteriaId WHERE thc.TestId IN (SELECT Id FROM Test WHERE ClassId IN (' + req.body.ClassIds.join(",") + ') AND SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND IsFinal = true)AND tohc.Tags REGEXP "' + req.body.Tag + '")';
            var queryForTestAverage = 'SELECT AVG(ResultPercentage) AS AvgFromTest FROM StudentWritesCriteria WHERE CriteriaId IN (SELECT thc.CriteriaId FROM TestHasCriteria thc INNER JOIN TopicHasCriteria tohc ON thc.CriteriaId = tohc.CriteriaId WHERE thc.TestId IN (SELECT Id FROM Test WHERE ClassId IN (' + req.body.ClassIds.join(",") + ') AND SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND IsFinal = false)AND tohc.Tags REGEXP "' + req.body.Tag + '")';
            var queryForQuizAverage = 'SELECT AVG(ResultPercentage) AS AvgFromQuiz FROM StudentWritesSmartTest WHERE StudentId IN(SELECT Id FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ')) AND QuestionId IN(SELECT QuestionId FROM TopicHasQuestion WHERE Tags REGEXP "' + req.body.Tag + '" AND ChapterId IN(SELECT Id FROM Chapter WHERE SubjectId IN(' + req.body.SubjectIds.join(",") + ')))';
            var queryString = queryForExamAverage + ';' + queryForTestAverage + ';' + queryForQuizAverage + ';';
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = {
                        AverageFromExam: rows[0][0].AvgFromExam,
                        AverageFromTest: rows[1][0].AvgFromTest,
                        AverageFromQuiz: rows[2][0].AvgFromQuiz
                    }
                    res.send(result);
                } else {
                    res.send(err);
                }
            });
        }
    },
    getAllSubjectStatsForPrimeKeyword: function(req, res) {
        //req object should be 
        // var obj = {
        //     StudentId: null,
        //     ClassId: null
        // }
        var result = {};
        if (req.body.ClassId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryForExamAverage = 'SELECT AVG(ResultPercentage) AS AvgFromExam FROM StudentWritesCriteria WHERE StudentId = ' + req.body.StudentId + ' AND CriteriaId IN (SELECT thc.CriteriaId FROM TestHasCriteria thc INNER JOIN TopicHasCriteria tohc ON thc.CriteriaId = tohc.CriteriaId WHERE thc.TestId IN (SELECT Id FROM Test WHERE ClassId = ' + req.body.ClassId + ' AND IsFinal = true)AND tohc.Tags REGEXP "' + req.body.Tag + '")';
            var queryForTestAverage = 'SELECT AVG(ResultPercentage) AS AvgFromTest FROM StudentWritesCriteria WHERE StudentId = ' + req.body.StudentId + ' AND CriteriaId IN (SELECT thc.CriteriaId FROM TestHasCriteria thc INNER JOIN TopicHasCriteria tohc ON thc.CriteriaId = tohc.CriteriaId WHERE thc.TestId IN (SELECT Id FROM Test WHERE ClassId = ' + req.body.ClassId + ' AND IsFinal = false)AND tohc.Tags REGEXP "' + req.body.Tag + '")';
            var queryForQuizAverage = 'SELECT AVG(ResultPercentage) AS AvgFromQuiz FROM StudentWritesSmartTest WHERE StudentId = ' + req.body.StudentId + ' AND QuestionId IN(SELECT QuestionId FROM TopicHasQuestion WHERE Tags REGEXP "' + req.body.Tag + '")';
            var queryString = queryForExamAverage + ';' + queryForTestAverage + ';' + queryForQuizAverage + ';';
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = {
                        AverageFromExam: rows[0][0].AvgFromExam,
                        AverageFromTest: rows[1][0].AvgFromTest,
                        AverageFromQuiz: rows[2][0].AvgFromQuiz
                    }
                    res.send(result);
                } else {
                    res.send(err);
                }
            });
        }
    },
    getSubjectStatsForPrimeKeyword: function(req, res) {
        //req object should be 
        // var obj = {
        //     StudentId: null,
        //     ClassId: null,
        //     SubjectId: null
        // }
        var result = {};
        if (req.body.ClassId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryForExamAverage = 'SELECT AVG(ResultPercentage) AS AvgFromExam FROM StudentWritesCriteria WHERE StudentId = ' + req.body.StudentId + ' AND CriteriaId IN (SELECT thc.CriteriaId FROM TestHasCriteria thc INNER JOIN TopicHasCriteria tohc ON thc.CriteriaId = tohc.CriteriaId WHERE thc.TestId IN (SELECT Id FROM Test WHERE ClassId = (' + req.body.ClassId + ') AND SubjectId = (' + req.body.SubjectId + ') AND IsFinal = true)AND tohc.Tags REGEXP "' + req.body.Tag + '")';
            var queryForTestAverage = 'SELECT AVG(ResultPercentage) AS AvgFromTest FROM StudentWritesCriteria WHERE StudentId = ' + req.body.StudentId + ' AND CriteriaId IN (SELECT thc.CriteriaId FROM TestHasCriteria thc INNER JOIN TopicHasCriteria tohc ON thc.CriteriaId = tohc.CriteriaId WHERE thc.TestId IN (SELECT Id FROM Test WHERE ClassId = (' + req.body.ClassId + ') AND SubjectId = (' + req.body.SubjectId + ') AND IsFinal = false)AND tohc.Tags REGEXP "' + req.body.Tag + '")';
            var queryForQuizAverage = 'SELECT AVG(ResultPercentage) AS AvgFromQuiz FROM StudentWritesSmartTest WHERE StudentId = ' + req.body.StudentId + ' AND QuestionId IN(SELECT QuestionId FROM TopicHasQuestion WHERE Tags REGEXP "' + req.body.Tag + '" AND ChapterId IN(SELECT Id FROM Chapter WHERE SubjectId = ' + req.body.SubjectId + '))';
            var queryString = queryForExamAverage + ';' + queryForTestAverage + ';' + queryForQuizAverage + ';';
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = {
                        AverageFromExam: rows[0][0].AvgFromExam,
                        AverageFromTest: rows[1][0].AvgFromTest,
                        AverageFromQuiz: rows[2][0].AvgFromQuiz
                    }
                    res.send(result);
                } else {
                    res.send(err);
                }
            });
        }
    }
}