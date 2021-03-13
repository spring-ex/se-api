'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');
var moment = require('moment');

module.exports = {
    getMarksStatisticsByRangeForOBE: function(req, res) {
        var result = {};
        var response = {
            Students: []
        };
        if (req.body.COId == 0) { // all cos
            var queryString = 'SELECT s.Id, s.Name, s.FindInboxId, IFNULL(AVG(swc.ResultPercentage), 0) AS COFromTest, IFNULL(AVG(swst.ResultPercentage), 0) AS COFromQuiz FROM Student s LEFT JOIN StudentWritesCriteria swc ON s.Id = swc.StudentId LEFT JOIN StudentWritesSmartTest swst ON s.Id = swst.StudentId AND swst.QuestionId IN (SELECT QuestionId FROM TopicHasQuestion WHERE COId IN (SELECT Id FROM CourseOutcome WHERE SubjectId IN (' + req.body.SubjectIds.join(",") + '))) WHERE s.Id IN (SELECT Id FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ')) GROUP BY s.Id';
        } else {
            var queryString = 'SELECT s.Id, s.Name, s.FindInboxId, IFNULL(AVG(spi.COFromTest), 0) AS COFromTest, IFNULL(AVG(spi.COFromQuiz), 0) AS COFromQuiz FROM Student s LEFT JOIN StudentCOPerformanceIndex spi ON s.Id = spi.StudentId WHERE s.Id IN (SELECT Id FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ') AND spi.COId = ' + req.body.COId + ') GROUP BY s.Id';
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                var queryString2 = 'SELECT StudentId, AVG(ResultPercentage) AS ExamScore FROM StudentWritesTest WHERE StudentId IN (SELECT Id FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ')) AND TestId IN (SELECT Id FROM Test WHERE SubjectId = (' + req.body.SubjectIds.join(",") + ') AND IsFinal = TRUE) GROUP BY StudentId';
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        if (rows2.length == 0) {
                            for (var i = 0; i < rows.length; i++) {
                                rows[i].ExamScore = 0;
                            }
                            response.Students = rows;
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = response;
                            res.send(result);
                        } else {
                            for (var i = 0; i < rows.length; i++) {
                                for (var k = 0; k < rows2.length; k++) {
                                    if (rows[i].Id == rows2[k].StudentId) {
                                        rows[i].ExamScore = rows2[k].ExamScore;
                                    }
                                }
                            }
                            response.Students = rows;
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = response;
                            res.send(result);
                        }
                    } else {
                        res.send(err2);
                    }
                });
            } else {
                res.send(err);
            }
        });
    },
    getMarksStatisticsForOBE: function(req, res) {
        var result = {};
        var response = {
            Average: null,
            Tests: []
        };
        var queryString = 'SELECT t.*, avg(swt.MarksObtained) AS AverageMarks, avg(swt.ResultPercentage) AS AveragePercentage FROM Test t INNER JOIN StudentWritesTest swt ON t.Id = swt.TestId AND t.ClassId IN(' + req.body.ClassIds.join(",") + ') AND t.SubjectId IN (' + req.body.SubjectIds.join(",") + ') GROUP BY t.Id;';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                var queryString2 = 'SELECT IFNULL(AVG(ResultPercentage), 0) AS COAverageFromQuiz FROM StudentWritesSmartTest WHERE QuestionId IN (SELECT QuestionId FROM TopicHasQuestion WHERE COId IN (SELECT Id FROM CourseOutcome WHERE SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND ClassId IN (' + req.body.ClassIds.join(",") + ')))';
                response.Tests = rows;
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        response.AverageFromQuiz = rows2[0].COAverageFromQuiz;
                        result.Code = statusCodes.successCodes[0].Code;
                        result.Message = statusCodes.successCodes[0].Message;
                        result.Data = response;
                        res.send(result);
                    } else {
                        res.send(err2);
                    }
                });
            } else {
                res.send(err);
            }
        });
    },

    getStudentMarksStatisticsForOBE: function(req, res) {
        var result = {};
        var response = {
            Average: null,
            Tests: []
        };
        //get average of each test for whole class
        var queryString = 'SELECT t.*, avg(swt.MarksObtained) AS Marks, avg(swt.ResultPercentage) AS AveragePercentage FROM Test t INNER JOIN StudentWritesTest swt ON t.Id = swt.TestId AND swt.StudentId = ' + req.params.StudentId + ' AND t.ClassId = ' + req.params.ClassId + ' AND t.SubjectId = ' + req.params.SubjectId + ' GROUP BY t.Id;';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                var queryString2 = 'SELECT IFNULL(AVG(ResultPercentage), 0) AS COAverageFromQuiz FROM StudentWritesSmartTest WHERE StudentId = ' + req.params.StudentId + ' AND QuestionId IN (SELECT QuestionId FROM TopicHasQuestion WHERE COId IN (SELECT Id FROM CourseOutcome WHERE SubjectId = ' + req.params.SubjectId + ' AND ClassId = ' + req.params.ClassId + '))';
                response.Tests = rows;
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        response.AverageFromQuiz = rows2[0].COAverageFromQuiz;
                        result.Code = statusCodes.successCodes[0].Code;
                        result.Message = statusCodes.successCodes[0].Message;
                        result.Data = response;
                        res.send(result);
                    } else {
                        res.send(err2);
                    }
                });
            } else {
                res.send(err);
            }
        });
    },
    getMarksStatisticsNew: function(req, res) {
        var result = {};
        var queryString = 'SELECT t.*, avg(swt.MarksObtained) AS AverageMarks, avg(swt.ResultPercentage) AS AveragePercentage FROM Test t INNER JOIN StudentWritesTest swt ON t.Id = swt.TestId AND t.ClassId IN(' + req.body.ClassIds.join(",") + ') AND t.SubjectId IN (' + req.body.SubjectIds.join(",") + ') WHERE swt.StudentId IN (SELECT Id FROM Student WHERE Status <> 1 AND ClassId IN(' + req.body.ClassIds.join(",") + ')) GROUP BY t.Id;';
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
                    res.send(result)
                }
            } else {
                res.send(err);
            }
        });
    },
    getMarksStatistics: function(req, res) {
        var result = {};
        var response = {
            Average: null,
            Tests: []
        };
        var queryString = 'SELECT * FROM Test WHERE ClassId IN (' + req.body.ClassIds.join(",") + ') AND SubjectId IN (' + req.body.SubjectIds.join(",") + ')';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[4].Code;
                    result.Message = statusCodes.errorCodes[4].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var testIds = [];
                    var testScores = [];
                    var categories = [];
                    var testCategoryIds = [];
                    var flag = 0;
                    for (var i = 0; i < rows.length; i++) {
                        testIds.push(rows[i].Id);
                        if (rows[i].TestCategoryId != null) {
                            flag = 1;
                            testCategoryIds.push(rows[i].TestCategoryId);
                        }
                    }
                    var queryString2 = 'SELECT * FROM StudentWritesTest WHERE TestId In (' + testIds.join(", ") + ')';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            if (flag) {
                                var queryString3 = 'SELECT * FROM TestCategory WHERE Id IN (' + testCategoryIds.join(", ") + ')';
                                database.connectionString.query(queryString3, function(err3, rows3) {
                                    if (!err3) {
                                        var totalTests = rows.length;
                                        var totalEntriesInMarksTable = rows2.length;
                                        var sumOfAveragesOfTests = 0;
                                        var sumOfMarksOfAllTestsInThisCategory = 0;
                                        var sumOfMaxMarksOfAllTestsInThisCategory = 0;
                                        var testsBelongingToThisCategory = [];
                                        for (var i = 0; i < totalTests; i++) {
                                            var sumOfTestMarks = 0;
                                            var totalStudents = 0;
                                            for (var j = 0; j < totalEntriesInMarksTable; j++) {
                                                if (rows[i].Id == rows2[j].TestId) {
                                                    if (rows2[j].MarksObtained != "Ab") {
                                                        sumOfTestMarks += parseFloat(rows2[j].MarksObtained);
                                                    }
                                                    totalStudents++;
                                                }
                                            }
                                            sumOfAveragesOfTests += (sumOfTestMarks / totalStudents) / parseInt(rows[i].MaxMarks);
                                            testScores.push({
                                                Id: rows[i].Id,
                                                Name: rows[i].Name,
                                                TestCategoryId: rows[i].TestCategoryId,
                                                MaxMarks: parseInt(rows[i].MaxMarks),
                                                AverageMarks: (sumOfTestMarks / totalStudents),
                                                CreatedAt: rows[i].CreatedAt
                                            });
                                        }
                                        for (var i = 0; i < rows3.length; i++) {
                                            testsBelongingToThisCategory = [];
                                            sumOfMarksOfAllTestsInThisCategory = 0;
                                            sumOfMaxMarksOfAllTestsInThisCategory = 0;
                                            for (var j = 0; j < testScores.length; j++) {
                                                if (rows3[i].Id == testScores[j].TestCategoryId) {
                                                    sumOfMarksOfAllTestsInThisCategory += testScores[j].AverageMarks;
                                                    sumOfMaxMarksOfAllTestsInThisCategory += testScores[j].MaxMarks;
                                                    testsBelongingToThisCategory.push(testScores[j]);
                                                }
                                            }
                                            categories.push({
                                                Id: rows3[i].Id,
                                                CategoryName: rows3[i].Name,
                                                CategoryAverage: (sumOfMarksOfAllTestsInThisCategory / testsBelongingToThisCategory.length),
                                                CategoryMaxMarks: (sumOfMaxMarksOfAllTestsInThisCategory / testsBelongingToThisCategory.length),
                                                Tests: testsBelongingToThisCategory
                                            });
                                        }
                                        response.Average = (sumOfAveragesOfTests / totalTests) * 100;
                                        response.Tests = [];
                                        response.Categories = categories;
                                        result.Code = statusCodes.successCodes[0].Code;
                                        result.Message = statusCodes.successCodes[0].Message;
                                        result.Data = response;
                                        res.send(result);
                                    } else {
                                        res.send(err3);
                                    }
                                });
                            } else {
                                var totalTests = rows.length;
                                var totalEntriesInMarksTable = rows2.length;
                                var sumOfAveragesOfTests = 0;
                                for (var i = 0; i < totalTests; i++) {
                                    var sumOfTestMarks = 0;
                                    var totalStudents = 0;
                                    for (var j = 0; j < totalEntriesInMarksTable; j++) {
                                        if (rows[i].Id == rows2[j].TestId) {
                                            if (rows2[j].MarksObtained != "Ab") {
                                                sumOfTestMarks += parseFloat(rows2[j].MarksObtained);
                                            }
                                            totalStudents++;
                                        }
                                    }
                                    sumOfAveragesOfTests += (sumOfTestMarks / totalStudents) / parseInt(rows[i].MaxMarks);
                                    testScores.push({
                                        Id: rows[i].Id,
                                        Name: rows[i].Name,
                                        MaxMarks: parseInt(rows[i].MaxMarks),
                                        AverageMarks: (sumOfTestMarks / totalStudents),
                                        CreatedAt: rows[i].CreatedAt
                                    });
                                }
                                response.Average = (sumOfAveragesOfTests / totalTests) * 100;
                                response.Tests = testScores;
                                response.Categories = [];
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
    getAttendanceStatistics: function(req, res) {
        var result = {};
        var yearReceived = moment().year();
        var today1 = new Date();
        var today2 = new Date();
        if (today1.getMonth() <= 6) {
            today1.setYear(yearReceived - 1);
            today2.setYear(yearReceived);
        } else {
            today1.setYear(yearReceived);
            today2.setYear(yearReceived + 1);
        }
        today1.setMonth(6);
        today2.setMonth(7);
        today1.setDate(1);
        today2.setDate(31);
        var startYear = moment(today1).format("YYYY-MM-DD");
        var endYear = moment(today2).format("YYYY-MM-DD");
        if (req.body.IsElective == "true") {
            var queryString = 'SELECT Student.Id FROM Student WHERE Id IN (SELECT StudentId FROM StudentTakesSpecialClass WHERE SpecialClassId = ' + req.body.SpecialClassId + ') AND Student.Status <> 1 ORDER BY Student.UpdatedAt';
        } else {
            var queryString = 'SELECT Id FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ') AND CollegeId = ' + req.body.CollegeId + ' AND Status <> 1 ORDER BY Student.UpdatedAt';
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var totalStudents = rows.length;
                    var studentIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        studentIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT * FROM Attendance WHERE StudentId IN (' + studentIds.join(",") + ') AND SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND AttendanceDate BETWEEN "' + startYear + '" AND "' + endYear + '"';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            var totalEntries = rows2.length;
                            var totalClasses = 0;
                            var totalPresent = 0;
                            for (var i = 0; i < rows2.length; i++) {
                                if (rows[0].Id == rows2[i].StudentId) {
                                    totalClasses++;
                                }
                                if (rows2[i].IsPresent == "true") {
                                    totalPresent++;
                                }
                            }
                            var response = {
                                TotalClassesTaken: totalClasses,
                                TotalEntries: totalEntries,
                                TotalPresent: totalPresent
                            };
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = response;
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
    getStudentMarksStatisticsNew: function(req, res) {
        var result = {};
        var queryString = 'SELECT t.*, swt.MarksObtained AS Marks, avg(swt.ResultPercentage) AS AveragePercentage FROM Test t INNER JOIN StudentWritesTest swt ON t.Id = swt.TestId AND swt.StudentId = ' + req.params.StudentId + ' AND t.ClassId = ' + req.params.ClassId + ' AND t.SubjectId = ' + req.params.SubjectId + ' GROUP BY t.Id;';
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
                    res.send(result)
                }
            } else {
                res.send(err);
            }
        });
    },
    getStudentMarksStatistics: function(req, res) {
        var result = {};
        var response = {
            Average: null,
            Tests: []
        };
        var queryString = 'SELECT * FROM Test WHERE ClassId = ' + req.params.ClassId + ' AND SubjectId = ' + req.params.SubjectId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[4].Code;
                    result.Message = statusCodes.errorCodes[4].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var testIds = [];
                    var testScores = [];
                    var categories = [];
                    var testCategoryIds = [];
                    var flag = 0;
                    for (var i = 0; i < rows.length; i++) {
                        testIds.push(rows[i].Id);
                        if (rows[i].TestCategoryId != null) {
                            flag = 1;
                            testCategoryIds.push(rows[i].TestCategoryId);
                        }
                    }
                    for (var i = 0; i < rows.length; i++) {
                        testIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT * FROM StudentWritesTest WHERE TestId In (' + testIds.join(", ") + ') AND StudentId = ' + req.params.StudentId;
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            if (flag) {
                                var queryString3 = 'SELECT * FROM TestCategory WHERE Id IN (' + testCategoryIds.join(", ") + ')';
                                database.connectionString.query(queryString3, function(err3, rows3) {
                                    if (!err3) {
                                        var totalTests = rows.length;
                                        var totalEntriesInMarksTable = rows2.length;
                                        var sumOfPercentages = 0;
                                        var sumOfMarksOfAllTestsInThisCategory = 0;
                                        var sumOfMaxMarksOfAllTestsInThisCategory = 0;
                                        var testsBelongingToThisCategory = [];
                                        for (var i = 0; i < totalTests; i++) {
                                            var testMarks = 0;
                                            for (var j = 0; j < totalEntriesInMarksTable; j++) {
                                                if (rows[i].Id == rows2[j].TestId) {
                                                    if (rows2[j].MarksObtained != "Ab") {
                                                        testMarks = parseFloat(rows2[j].MarksObtained);
                                                    } else {
                                                        testMarks = rows2[j].MarksObtained;
                                                    }
                                                }
                                            }
                                            if (testMarks != "Ab") {
                                                sumOfPercentages += testMarks / parseInt(rows[i].MaxMarks);
                                            }
                                            testScores.push({
                                                Id: rows[i].Id,
                                                Name: rows[i].Name,
                                                MaxMarks: parseInt(rows[i].MaxMarks),
                                                TestCategoryId: rows[i].TestCategoryId,
                                                Marks: testMarks,
                                                CreatedAt: rows[i].CreatedAt
                                            });
                                        }
                                        for (var i = 0; i < rows3.length; i++) {
                                            testsBelongingToThisCategory = [];
                                            sumOfMarksOfAllTestsInThisCategory = 0;
                                            sumOfMaxMarksOfAllTestsInThisCategory = 0;
                                            for (var j = 0; j < testScores.length; j++) {
                                                if (rows3[i].Id == testScores[j].TestCategoryId) {
                                                    sumOfMarksOfAllTestsInThisCategory += testScores[j].Marks;
                                                    sumOfMaxMarksOfAllTestsInThisCategory += testScores[j].MaxMarks;
                                                    testsBelongingToThisCategory.push(testScores[j]);
                                                }
                                            }
                                            categories.push({
                                                Id: rows3[i].Id,
                                                CategoryName: rows3[i].Name,
                                                CategoryAverage: (sumOfMarksOfAllTestsInThisCategory / testsBelongingToThisCategory.length),
                                                CategoryMaxMarks: (sumOfMaxMarksOfAllTestsInThisCategory / testsBelongingToThisCategory.length),
                                                Tests: testsBelongingToThisCategory
                                            });
                                        }
                                        response.Average = (sumOfPercentages / totalTests) * 100;
                                        response.Tests = [];
                                        response.Categories = categories;
                                        result.Code = statusCodes.successCodes[0].Code;
                                        result.Message = statusCodes.successCodes[0].Message;
                                        result.Data = response;
                                        res.send(result);
                                    } else {
                                        res.send(err3);
                                    }
                                });
                            } else {
                                var totalTests = rows.length;
                                var totalEntriesInMarksTable = rows2.length;
                                var sumOfPercentages = 0;
                                for (var i = 0; i < totalTests; i++) {
                                    var testMarks = 0;
                                    for (var j = 0; j < totalEntriesInMarksTable; j++) {
                                        if (rows[i].Id == rows2[j].TestId) {
                                            if (rows2[j].MarksObtained != "Ab") {
                                                testMarks = parseFloat(rows2[j].MarksObtained);
                                            } else {
                                                testMarks = rows2[j].MarksObtained;
                                            }
                                        }
                                    }
                                    if (testMarks != "Ab") {
                                        sumOfPercentages += testMarks / parseInt(rows[i].MaxMarks);
                                    }
                                    testScores.push({
                                        Id: rows[i].Id,
                                        Name: rows[i].Name,
                                        MaxMarks: parseInt(rows[i].MaxMarks),
                                        Marks: testMarks,
                                        CreatedAt: rows[i].CreatedAt
                                    });
                                }
                                response.Average = (sumOfPercentages / totalTests) * 100;
                                response.Tests = testScores;
                                response.Categories = [];
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
    getStudentMarksStatisticsForSkillsAndYou: function(req, res) {
        var result = {};
        var response = {
            Average: null,
            Tests: []
        };
        var queryString = 'SELECT * FROM Test WHERE ClassId = ' + req.params.ClassId + ' AND SubjectId = ' + req.params.SubjectId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    var queryString4 = 'SELECT Id, Name AS CategoryName from TestCategory WHERE Id IN(SELECT TestCategoryId From SubjectHasCategory WHERE SubjectId = ' + req.params.SubjectId + ')';
                    database.connectionString.query(queryString4, function(err4, rows4) {
                        if (!err4) {
                            for (var i = 0; i < rows4.length; i++) {
                                rows4[i].Tests = [];
                            }
                            response.Categories = rows4;
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = response;
                            res.send(result);
                        } else {
                            res.send(err4)
                        }
                    });
                } else {
                    var testIds = [];
                    var testScores = [];
                    var categories = [];
                    var testCategoryIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        testIds.push(rows[i].Id);
                        if (rows[i].TestCategoryId != null) {
                            testCategoryIds.push(rows[i].TestCategoryId);
                        }
                    }
                    for (var i = 0; i < rows.length; i++) {
                        testIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT * FROM StudentWritesTest WHERE TestId In (' + testIds.join(", ") + ') AND StudentId = ' + req.params.StudentId;
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            var queryString3 = 'SELECT * FROM TestCategory WHERE Id IN (SELECT TestCategoryId From SubjectHasCategory WHERE SubjectId = ' + req.params.SubjectId + ')';
                            database.connectionString.query(queryString3, function(err3, rows3) {
                                if (!err3) {
                                    var totalTests = rows.length;
                                    var totalEntriesInMarksTable = rows2.length;
                                    var sumOfPercentages = 0;
                                    var sumOfMarksOfAllTestsInThisCategory = 0;
                                    var sumOfMaxMarksOfAllTestsInThisCategory = 0;
                                    var testsBelongingToThisCategory = [];
                                    for (var i = 0; i < totalTests; i++) {
                                        var testMarks = 0;
                                        for (var j = 0; j < totalEntriesInMarksTable; j++) {
                                            if (rows[i].Id == rows2[j].TestId) {
                                                if (rows2[j].MarksObtained != "Ab") {
                                                    testMarks = parseFloat(rows2[j].MarksObtained);
                                                } else {
                                                    testMarks = rows2[j].MarksObtained;
                                                }
                                            }
                                        }
                                        if (testMarks != "Ab") {
                                            sumOfPercentages += testMarks / parseInt(rows[i].MaxMarks);
                                        }
                                        testScores.push({
                                            Id: rows[i].Id,
                                            Name: rows[i].Name,
                                            MaxMarks: parseInt(rows[i].MaxMarks),
                                            TestCategoryId: rows[i].TestCategoryId,
                                            Marks: testMarks,
                                            CreatedAt: rows[i].CreatedAt
                                        });
                                    }
                                    for (var i = 0; i < rows3.length; i++) {
                                        testsBelongingToThisCategory = [];
                                        sumOfMarksOfAllTestsInThisCategory = 0;
                                        sumOfMaxMarksOfAllTestsInThisCategory = 0;
                                        for (var j = 0; j < testScores.length; j++) {
                                            if (rows3[i].Id == testScores[j].TestCategoryId) {
                                                sumOfMarksOfAllTestsInThisCategory += testScores[j].Marks;
                                                sumOfMaxMarksOfAllTestsInThisCategory += testScores[j].MaxMarks;
                                                testsBelongingToThisCategory.push(testScores[j]);
                                            }
                                        }
                                        categories.push({
                                            Id: rows3[i].Id,
                                            CategoryName: rows3[i].Name,
                                            CategoryAverage: (sumOfMarksOfAllTestsInThisCategory / testsBelongingToThisCategory.length),
                                            CategoryMaxMarks: (sumOfMaxMarksOfAllTestsInThisCategory / testsBelongingToThisCategory.length),
                                            Tests: testsBelongingToThisCategory
                                        });
                                    }
                                    response.Average = (sumOfPercentages / totalTests) * 100;
                                    response.Tests = [];
                                    response.Categories = categories;
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = response;
                                    res.send(result);
                                } else {
                                    res.send(err3);
                                }
                            });
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
    getStudentAttendanceStatistics: function(req, res) {
        var result = {};
        var currentYear = moment().year();
        var today1 = new Date();
        var today2 = new Date();
        if (today1.getMonth() <= 6) {
            today1.setYear(currentYear - 1);
            today2.setYear(currentYear);
        } else {
            today1.setYear(currentYear);
            today2.setYear(currentYear + 1);
        }
        today1.setMonth(6);
        today2.setMonth(7);
        today1.setDate(1);
        today2.setDate(31);
        var startYear = moment(today1).format("YYYY-MM-DD");
        var endYear = moment(today2).format("YYYY-MM-DD");
        var queryString2 = 'SELECT * FROM Attendance WHERE StudentId = ' + req.params.StudentId + ' AND SubjectId = ' + req.params.SubjectId + ' AND AttendanceDate BETWEEN "' + startYear + '" AND "' + endYear + '"';
        database.connectionString.query(queryString2, function(err2, rows2) {
            if (!err2) {
                var totalEntries = rows2.length;
                var totalPresent = 0;
                for (var i = 0; i < rows2.length; i++) {
                    if (rows2[i].IsPresent == "true") {
                        totalPresent++;
                    }
                }
                var response = {
                    TotalClasses: totalEntries,
                    TotalPresent: totalPresent
                };
                result.Code = statusCodes.successCodes[0].Code;
                result.Message = statusCodes.successCodes[0].Message;
                result.Data = response;
                res.send(result);
            } else {
                res.send(err2);
            }
        });
    },
    getAttendanceByDateRange: function(req, res) {
        var result = {};
        if (req.params.IsElective == "true") {
            var queryString = 'SELECT Student.Id,Student.Name,Student.FindInboxId FROM Student INNER JOIN StudentTakesElective ON Student.Id = StudentTakesElective.StudentId WHERE StudentTakesElective.SubjectId = ' + req.params.SubjectId + ' AND Student.ClassId = ' + req.params.ClassId + ' AND Student.CollegeId = ' + req.params.CollegeId + ' AND Student.Status <> 1';
        } else {
            var queryString = 'SELECT Id,Name,FindInboxId FROM Student WHERE ClassId = ' + req.params.ClassId + ' AND CollegeId = ' + req.params.CollegeId + ' AND Status <> 1';
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var totalStudents = rows.length;
                    var studentIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        studentIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT * FROM Attendance WHERE StudentId IN (' + studentIds.join(",") + ') AND SubjectId = ' + req.params.SubjectId;
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            var totalClasses = 0;
                            for (var i = 0; i < rows2.length; i++) {
                                if (rows[0].Id == rows2[i].StudentId) {
                                    totalClasses++;
                                }
                            }
                            var response = {
                                TotalClasses: totalClasses,
                                Students: []
                            };
                            for (var i = 0; i < rows.length; i++) {
                                var student = {
                                    Id: rows[i].Id,
                                    Name: rows[i].Name,
                                    FindInboxId: rows[i].FindInboxId,
                                    TotalPresent: 0
                                };
                                for (var j = 0; j < rows2.length; j++) {
                                    if (rows[i].Id == rows2[j].StudentId && rows2[j].IsPresent == "true") {
                                        student.TotalPresent++;
                                    }
                                }
                                if (req.params.RangeId == 1) {
                                    response.Students.push(student);
                                }
                                if (req.params.RangeId == 2 && (student.TotalPresent / response.TotalClasses) < 0.5) {
                                    response.Students.push(student);
                                }
                                if (req.params.RangeId == 3 && (student.TotalPresent / response.TotalClasses) >= 0.5 && (student.TotalPresent / response.TotalClasses) < 0.75) {
                                    response.Students.push(student);
                                }
                                if (req.params.RangeId == 4 && (student.TotalPresent / response.TotalClasses) >= 0.75) {
                                    response.Students.push(student);
                                }
                            }
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = response;
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
    getAttendanceForWeb: function(req, res) {
        var result = {};
        var currentYear = moment().year();
        var today1 = new Date();
        var today2 = new Date();
        if (today1.getMonth() <= 6) {
            today1.setYear(currentYear - 1);
            today2.setYear(currentYear);
        } else {
            today1.setYear(currentYear);
            today2.setYear(currentYear + 1);
        }
        today1.setMonth(6);
        today2.setMonth(7);
        today1.setDate(1);
        today2.setDate(31);
        var startYear = moment(today1).format("YYYY-MM-DD");
        var endYear = moment(today2).format("YYYY-MM-DD");
        if (req.body.IsElective == "true") {
            var queryString = 'SELECT Student.Id,Student.Name,Student.FindInboxId FROM Student INNER JOIN StudentTakesElective ON Student.Id = StudentTakesElective.StudentId WHERE StudentTakesElective.SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND Student.ClassId IN (' + req.body.ClassIds.join(",") + ') AND Student.Status <> 1 ORDER BY Student.UpdatedAt';
        } else {
            var queryString = 'SELECT Id,Name,FindInboxId FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ') AND Status <> 1 ORDER BY Student.UpdatedAt';
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var totalStudents = rows.length;
                    var studentIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        studentIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT * FROM Attendance WHERE StudentId IN (' + studentIds.join(",") + ') AND SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND AttendanceDate BETWEEN "' + startYear + '" AND "' + endYear + '"';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            var totalClasses = 0;
                            for (var i = 0; i < rows2.length; i++) {
                                if (rows[0].Id == rows2[i].StudentId) {
                                    totalClasses++;
                                }
                            }
                            var response = {
                                TotalClasses: totalClasses,
                                Students: []
                            };
                            for (var i = 0; i < rows.length; i++) {
                                var student = {
                                    Id: rows[i].Id,
                                    Name: rows[i].Name,
                                    FindInboxId: rows[i].FindInboxId,
                                    TotalPresent: 0
                                };
                                for (var j = 0; j < rows2.length; j++) {
                                    if (rows[i].Id == rows2[j].StudentId && rows2[j].IsPresent == "true") {
                                        student.TotalPresent++;
                                    }
                                }
                                response.Students.push(student);
                            }
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = response;
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
    getMarksStatisticsByRangeNew: function(req, res) {
        var result = {};
        if (req.body.IsElective == "true") {
            var queryString = 'SELECT s.Id, s.Name, s.FindInboxId FROM Student s INNER JOIN StudentTakesElective ste ON s.Id = ste.StudentId WHERE ste.SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND s.ClassId IN (' + req.body.ClassIds.join(",") + ') AND s.CollegeId = ' + req.body.CollegeId + ' AND s.Status <> 1 GROUP BY s.Id';
        } else {
            var queryString = 'SELECT s.Id, s.Name, s.FindInboxId FROM Student s WHERE s.ClassId = ' + req.body.ClassIds[0] + ' AND s.CollegeId = ' + req.body.CollegeId + ' AND s.Status <> 1 GROUP BY s.Id';
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                var queryString2 = 'SELECT t.*, swt.StudentId, swt.ResultPercentage AS ResultPercentage FROM Test t LEFT JOIN StudentWritesTest swt ON t.Id = swt.TestId WHERE t.ClassId IN (' + req.body.ClassIds.join(",") + ') AND t.SubjectId IN (' + req.body.SubjectIds.join(",") + ')';
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        var queryString3 = 'SELECT StudentId, AVG(ResultPercentage) AS QuizScore FROM StudentWritesSmartTest WHERE StudentId IN(SELECT Id FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ')) AND QuestionId IN(SELECT QuestionId FROM TopicHasQuestion WHERE ChapterId IN(SELECT Id FROM Chapter WHERE SubjectId IN(' + req.body.SubjectIds.join(",") + '))) GROUP BY StudentId';
                        database.connectionString.query(queryString3, function(err3, rows3) {
                            if (!err3) {
                                for (var i = 0; i < rows.length; i++) {
                                    rows[i].TestScore = 0;
                                    rows[i].ExamScore = 0;
                                    rows[i].QuizScore = 0;
                                    var no_of_tests = 0,
                                        testTotal = 0;
                                    var no_of_exams = 0,
                                        examTotal = 0;
                                    for (var j = 0; j < rows2.length; j++) {
                                        if (rows[i].Id == rows2[j].StudentId) {
                                            if (rows2[j].IsFinal == '1') {
                                                no_of_exams++;
                                                examTotal += rows2[j].ResultPercentage;
                                            } else {
                                                no_of_tests++;
                                                testTotal += rows2[j].ResultPercentage;
                                            }
                                        }
                                    }
                                    if (no_of_exams != 0) {
                                        rows[i].ExamScore = examTotal / no_of_exams;
                                    }
                                    if (no_of_tests != 0) {
                                        rows[i].TestScore = testTotal / no_of_tests;
                                    }
                                    for (var k = 0; k < rows3.length; k++) {
                                        if (rows[i].Id == rows3[k].StudentId) {
                                            rows[i].QuizScore = rows3[k].QuizScore;
                                        }
                                    }
                                }
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = rows;
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
    getMarksStatisticsByRange: function(req, res) {
        var result = {};
        var response = {
            MaxMarks: 0,
            Students: []
        };
        if (req.body.IsElective == "true") {
            var queryString = 'SELECT Student.Id, Student.Name, Student.FindInboxId FROM Student INNER JOIN StudentTakesElective ON Student.Id = StudentTakesElective.StudentId WHERE StudentTakesElective.SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND Student.ClassId IN (' + req.body.ClassIds.join(",") + ') AND Student.CollegeId = ' + req.body.CollegeId + ' AND Student.Status <> 1';
        } else {
            var queryString = 'SELECT Id, Name, FindInboxId FROM Student WHERE ClassId = ' + req.body.ClassIds[0] + ' AND CollegeId = ' + req.body.CollegeId + ' AND Status <> 1';
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var totalStudents = rows.length;
                    var studentIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        studentIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT * FROM StudentWritesTest WHERE StudentId IN (' + studentIds + ');SELECT * FROM StudentWritesSmartTest WHERE StudentId IN (' + studentIds + ')';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            if (rows2.length == 0) {
                                for (var i = 0; i < rows.length; i++) {
                                    response.Students.push({
                                        Id: rows[i].Id,
                                        Name: rows[i].Name,
                                        FindInboxId: rows[i].FindInboxId,
                                        Marks: 0
                                    });
                                }
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = response;
                                res.send(result);
                            } else {
                                var queryString3 = 'SELECT * FROM Test WHERE ClassId IN (' + req.body.ClassIds.join(",") + ') AND SubjectId IN (' + req.body.SubjectIds.join(",") + ')';
                                database.connectionString.query(queryString3, function(err3, rows3) {
                                    if (!err3) {
                                        if (rows3.length == 0) {
                                            for (var i = 0; i < rows.length; i++) {
                                                response.Students.push({
                                                    Id: rows[i].Id,
                                                    Name: rows[i].Name,
                                                    FindInboxId: rows[i].FindInboxId,
                                                    Marks: 0
                                                });
                                            }
                                            result.Code = statusCodes.successCodes[0].Code;
                                            result.Message = statusCodes.successCodes[0].Message;
                                            result.Data = response;
                                            res.send(result);
                                        } else {
                                            var maxMarks = 0;
                                            if (req.body.TestId != 0) {
                                                for (var i = 0; i < rows3.length; i++) {
                                                    if (req.body.TestId == rows3[i].Id) {
                                                        maxMarks = rows3[i].MaxMarks;
                                                    }
                                                }
                                                for (var i = 0; i < rows.length; i++) {
                                                    var student = {
                                                        Id: rows[i].Id,
                                                        Name: rows[i].Name,
                                                        FindInboxId: rows[i].FindInboxId,
                                                        Marks: 0
                                                    }
                                                    for (var j = 0; j < rows2.length; j++) {
                                                        if (rows[i].Id == rows2[j].StudentId && rows2[j].TestId == req.body.TestId) {
                                                            if (rows2[j].MarksObtained != "Ab") {
                                                                student.Marks = (parseFloat(rows2[j].MarksObtained) / parseFloat(maxMarks)) * 100;
                                                            } else {
                                                                student.Marks = (rows2[j].MarksObtained);
                                                            }
                                                        }
                                                    }
                                                    response.Students.push(student);
                                                }
                                            } else {
                                                for (var i = 0; i < rows.length; i++) {
                                                    var student = {
                                                        Id: rows[i].Id,
                                                        Name: rows[i].Name,
                                                        FindInboxId: rows[i].FindInboxId,
                                                        Marks: 0
                                                    }
                                                    var sumOfPercentagesOfEachTest = 0;
                                                    for (var j = 0; j < rows2.length; j++) {
                                                        for (var k = 0; k < rows3.length; k++) {
                                                            if (rows[i].Id == rows2[j].StudentId && rows2[j].TestId == rows3[k].Id) {
                                                                if (rows2[j].MarksObtained != "Ab") {
                                                                    sumOfPercentagesOfEachTest += (parseFloat(rows2[j].MarksObtained) / parseFloat(rows3[k].MaxMarks));
                                                                }
                                                            }
                                                        }
                                                    }
                                                    student.Marks = (sumOfPercentagesOfEachTest / rows3.length) * 100;
                                                    response.Students.push(student);
                                                }
                                            }
                                            result.Code = statusCodes.successCodes[0].Code;
                                            result.Message = statusCodes.successCodes[0].Message;
                                            result.Data = response;
                                            res.send(result);
                                        }
                                    } else {
                                        res.send(err3)
                                    }
                                });
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
    getStudentMarksStatisticsForAllSubjects: function(req, res) {
        var result = {};
        var response = {
            Average: null,
            Tests: []
        };
        var queryString = 'SELECT * FROM Test WHERE ClassId = ' + req.params.ClassId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[4].Code;
                    result.Message = statusCodes.errorCodes[4].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var testIds = [];
                    var testScores = [];
                    for (var i = 0; i < rows.length; i++) {
                        testIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT * FROM StudentWritesTest WHERE TestId In (' + testIds.join(", ") + ') AND StudentId = ' + req.params.StudentId;
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            var totalTests = rows.length;
                            var totalEntriesInMarksTable = rows2.length;
                            var sumOfPercentages = 0;
                            for (var i = 0; i < totalTests; i++) {
                                var testMarks = 0;
                                for (var j = 0; j < totalEntriesInMarksTable; j++) {
                                    if (rows[i].Id == rows2[j].TestId) {
                                        if (rows2[j].MarksObtained != "Ab") {
                                            testMarks = parseFloat(rows2[j].MarksObtained);
                                        } else {
                                            testMarks = rows2[j].MarksObtained;
                                        }
                                    }
                                }
                                if (testMarks != "Ab") {
                                    sumOfPercentages += testMarks / parseInt(rows[i].MaxMarks);
                                }
                                testScores.push({
                                    Id: rows[i].Id,
                                    Name: rows[i].Name,
                                    MaxMarks: parseInt(rows[i].MaxMarks),
                                    Marks: testMarks
                                });
                            }
                            response.Average = (sumOfPercentages / totalTests) * 100;
                            response.Tests = testScores;
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = response;
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
    getStudentAttendanceStatisticsForAllSubjects: function(req, res) {
        var result = {};
        var queryString2 = 'SELECT * FROM Attendance WHERE StudentId = ' + req.params.StudentId + ' AND ClassId = ' + req.params.ClassId;
        database.connectionString.query(queryString2, function(err2, rows2) {
            if (!err2) {
                var totalEntries = rows2.length;
                var totalPresent = 0;
                for (var i = 0; i < rows2.length; i++) {
                    if (rows2[i].IsPresent == "true") {
                        totalPresent++;
                    }
                }
                var response = {
                    TotalClasses: totalEntries,
                    TotalPresent: totalPresent
                };
                result.Code = statusCodes.successCodes[0].Code;
                result.Message = statusCodes.successCodes[0].Message;
                result.Data = response;
                res.send(result);
            } else {
                res.send(err2);
            }
        });
    },
    getCollegeAttendanceStatistics: function(req, res) {
        var result = {};
        if (req.body.CollegeId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var response = {
                Percentage: 0
            };
            if (req.body.CourseId != null && req.body.BranchId != null && req.body.SemesterId != null && req.body.ClassId != null) {
                var queryString3 = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND BranchId = ' + req.body.BranchId + ' AND SemesterId = ' + req.body.SemesterId + ' AND ClassId = ' + req.body.ClassId + ' AND Status <> 1';
            } else if (req.body.CourseId != null && req.body.BranchId != null && req.body.SemesterId != null) {
                var queryString3 = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND BranchId = ' + req.body.BranchId + ' AND SemesterId = ' + req.body.SemesterId + ' AND Status <> 1';
            } else if (req.body.CourseId != null && req.body.BranchId != null) {
                var queryString3 = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND BranchId = ' + req.body.BranchId + ' AND Status <> 1';
            } else if (req.body.CourseId != null) {
                var queryString3 = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND Status <> 1';
            } else {
                var queryString3 = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND Status <> 1';
            }
            database.connectionString.query(queryString3, function(err, rows) {
                if (!err) {
                    var studentIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        studentIds.push(rows[i].Id);
                    }
                    if (studentIds.length == 0) {
                        result.Code = statusCodes.errorCodes[4].Code;
                        result.Message = statusCodes.errorCodes[4].Message;
                        result.Data = null;
                        res.send(result);
                    } else {
                        var now = moment().add(1, 'days').toISOString();
                        var last15Days = moment().subtract(10, 'days').toISOString();
                        var queryString2 = 'SELECT * FROM Attendance WHERE StudentId IN (' + studentIds.join(",") + ') AND AttendanceDate BETWEEN "' + last15Days + '" AND "' + now + '" ORDER BY AttendanceDate ASC';
                        database.connectionString.query(queryString2, function(err2, rows2) {
                            if (!err2) {
                                var totalEntries = rows2.length;
                                var totalPresent = 0;
                                var dates = [];
                                var percentages = [];
                                var totalClasses = 0;
                                for (var i = 0; i < rows2.length; i++) {
                                    var momentDate = moment(rows2[i].AttendanceDate).format("DD/MM/YY");
                                    if (dates.indexOf(momentDate) == -1) {
                                        dates.push(momentDate);
                                    }
                                }
                                for (var i = 0; i < dates.length; i++) {
                                    totalClasses = 0;
                                    totalPresent = 0;
                                    for (var j = 0; j < rows2.length; j++) {
                                        if (dates[i] == moment(rows2[j].AttendanceDate).format("DD/MM/YY")) {
                                            totalClasses++;
                                            if (rows2[j].IsPresent == "true") {
                                                totalPresent++;
                                            }
                                        }
                                    }
                                    var percentage = (totalPresent / totalClasses) * 100
                                    percentages.push(parseFloat(percentage.toFixed(2)));
                                }
                                var response = {
                                    Dates: dates,
                                    Percentages: percentages
                                };
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = response;
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
        }
    },
    getCollegeMarksStatistics: function(req, res) {
        var result = {};
        if (req.body.CollegeId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var response = {
                Percentage: 0
            };
            if (req.body.CourseId != null && req.body.BranchId != null && req.body.SemesterId != null && req.body.ClassId != null) {
                var queryString3 = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND BranchId = ' + req.body.BranchId + ' AND SemesterId = ' + req.body.SemesterId + ' AND ClassId = ' + req.body.ClassId + ' AND Status <> 1';
            } else if (req.body.CourseId != null && req.body.BranchId != null && req.body.SemesterId != null) {
                var queryString3 = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND BranchId = ' + req.body.BranchId + ' AND SemesterId = ' + req.body.SemesterId + ' AND Status <> 1';
            } else if (req.body.CourseId != null && req.body.BranchId != null) {
                var queryString3 = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND BranchId = ' + req.body.BranchId + ' AND Status <> 1';
            } else if (req.body.CourseId != null) {
                var queryString3 = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND Status <> 1';
            } else {
                var queryString3 = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND Status <> 1';
            }
            database.connectionString.query(queryString3, function(err3, rows3) {
                if (!err3) {
                    var studentIds = [];
                    for (var i = 0; i < rows3.length; i++) {
                        studentIds.push(rows3[i].Id);
                    }
                    if (studentIds.length == 0) {
                        result.Code = statusCodes.errorCodes[4].Code;
                        result.Message = statusCodes.errorCodes[4].Message;
                        result.Data = null;
                        res.send(result);
                    } else {
                        var queryString = 'SELECT * FROM StudentWritesTest WHERE StudentId IN (' + studentIds.join(",") + ')';
                        database.connectionString.query(queryString, function(err, rows) {
                            if (!err) {
                                if (rows.length == 0) {
                                    result.Code = statusCodes.errorCodes[4].Code;
                                    result.Message = statusCodes.errorCodes[4].Message;
                                    result.Data = null;
                                    res.send(result);
                                } else {
                                    var testIds = [];
                                    for (var i = 0; i < rows.length; i++) {
                                        testIds.push(rows[i].TestId);
                                    }
                                    var queryString2 = 'SELECT * FROM Test WHERE Id IN (' + testIds.join(",") + ')';
                                    database.connectionString.query(queryString2, function(err2, rows2) {
                                        if (!err2) {
                                            var totalMarksForTest = 0;
                                            for (var i = 0; i < rows2.length; i++) {
                                                for (var j = 0; j < rows.length; j++) {
                                                    if (rows2[i].Id == rows[j].TestId) {
                                                        if (rows[j].MarksObtained != "Ab") {
                                                            totalMarksForTest += (rows[j].MarksObtained / rows2[i].MaxMarks);
                                                        }
                                                    }
                                                }
                                            }
                                            var studentsWhoWroteTests = [];
                                            for (var i = 0; i < rows.length; i++) {
                                                studentsWhoWroteTests.push(rows[i].StudentId);
                                            }
                                            var uniqueStudents = studentsWhoWroteTests.filter(function(item, i, ar) { return ar.indexOf(item) === i; });
                                            response.Percentage = ((totalMarksForTest / rows2.length) / uniqueStudents.length) * 100;
                                            result.Code = statusCodes.successCodes[0].Code;
                                            result.Message = statusCodes.successCodes[0].Message;
                                            result.Data = response;
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
                    }
                } else {
                    res.send(err3);
                }
            });
        }
    },
    //po co attainment
    getCoAttainmentForTest: function(req, res) {
        var result = {};
        var queryString = 'SELECT StudentId, AVG(ResultPercentage) AS Average FROM StudentWritesCriteria WHERE TestId = ' + req.params.TestId + ' AND CriteriaId IN (SELECT CriteriaId FROM TestHasCriteria WHERE COId = ' + req.params.COId + ' AND TestId = ' + req.params.TestId + ') GROUP BY StudentId';
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
    getOverallCOAttainmentFromSEE: function(req, res) {
        var result = {};
        if (req.body.SubjectIds.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT AVG(ResultPercentage) AS Average FROM StudentWritesTest WHERE TestId IN (SELECT Id FROM Test WHERE IsFinal = "1" AND SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND ClassId IN (' + req.body.ClassIds.join(",") + '))';
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
    },
    getOverallCOAttainmentFromChapter: function(req, res) {
        var result = {};
        var queryString = 'SELECT StudentId, AVG(ResultPercentage) AS Average FROM StudentWritesSmartTest WHERE QuestionId IN(SELECT QuestionId FROM TopicHasQuestion WHERE ChapterId = ' + req.params.ChapterId + ' AND COId = ' + req.params.COId + ') GROUP BY StudentId';
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
    getStatisticsByBloomsLevel: function(req, res) {
        var result = {};
        if (req.body.IsElective == "true") {
            var queryString = 'SELECT s.Id, s.Name, s.FindInboxId FROM Student s INNER JOIN StudentTakesElective ste ON s.Id = ste.StudentId WHERE ste.SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND s.ClassId IN (' + req.body.ClassIds.join(",") + ') AND s.CollegeId = ' + req.body.CollegeId + ' AND s.Status <> 1 GROUP BY s.Id';
        } else {
            var queryString = 'SELECT s.Id, s.Name, s.FindInboxId FROM Student s WHERE s.ClassId = ' + req.body.ClassIds[0] + ' AND s.CollegeId = ' + req.body.CollegeId + ' AND s.Status <> 1 GROUP BY s.Id';
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                var queryString2 = 'SELECT swc.StudentId, swc.CriteriaId, AVG(swc.ResultPercentage) AS Marks FROM StudentWritesCriteria swc WHERE swc.CriteriaId IN (SELECT CriteriaId FROM TestHasCriteria WHERE BTId = ' + req.body.BTId + ' AND TestId IN (SELECT Id FROM Test WHERE SubjectId IN (' + req.body.SubjectIds.join(",") + '))) GROUP BY swc.StudentId';
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        var queryString3 = 'SELECT StudentId, AVG(ResultPercentage) AS QuizScore FROM StudentWritesSmartTest WHERE StudentId IN(SELECT Id FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ')) AND QuestionId IN(SELECT QuestionId FROM TopicHasQuestion WHERE BTId = ' + req.body.BTId + ') GROUP BY StudentId';
                        database.connectionString.query(queryString3, function(err3, rows3) {
                            if (!err3) {
                                for (var i = 0; i < rows.length; i++) {
                                    rows[i].TestScore = 0;
                                    rows[i].ExamScore = 0;
                                    rows[i].QuizScore = 0;
                                    var no_of_tests = 0,
                                        testTotal = 0;
                                    // var no_of_exams = 0,
                                    //     examTotal = 0;
                                    for (var j = 0; j < rows2.length; j++) {
                                        if (rows[i].Id == rows2[j].StudentId) {
                                            // if (rows2[j].IsFinal == '1') {
                                            //     no_of_exams++;
                                            //     examTotal += rows2[j].Marks;
                                            // } else {
                                            no_of_tests++;
                                            testTotal += rows2[j].Marks;
                                            // }
                                        }
                                    }
                                    // if (no_of_exams != 0) {
                                    //     rows[i].ExamScore = examTotal / no_of_exams;
                                    // }
                                    if (no_of_tests != 0) {
                                        rows[i].TestScore = testTotal / no_of_tests;
                                    }
                                    for (var k = 0; k < rows3.length; k++) {
                                        if (rows[i].Id == rows3[k].StudentId) {
                                            rows[i].QuizScore = rows3[k].QuizScore;
                                        }
                                    }
                                }
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = rows;
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
    getStatisticsByTags: function(req, res) {
        var result = {};
        if (req.body.IsElective == "true") {
            var queryString = 'SELECT s.Id, s.Name, s.FindInboxId FROM Student s INNER JOIN StudentTakesElective ste ON s.Id = ste.StudentId WHERE ste.SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND s.ClassId IN (' + req.body.ClassIds.join(",") + ') AND s.CollegeId = ' + req.body.CollegeId + ' AND s.Status <> 1 GROUP BY s.Id';
        } else {
            var queryString = 'SELECT s.Id, s.Name, s.FindInboxId FROM Student s WHERE s.ClassId = ' + req.body.ClassIds[0] + ' AND s.CollegeId = ' + req.body.CollegeId + ' AND s.Status <> 1 GROUP BY s.Id';
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (req.body.Quizzes.length == 0) {
                    if (req.body.Tags.length == 0) {
                        var queryString3 = 'SELECT StudentId, AVG(ResultPercentage) AS QuizScore FROM StudentWritesSmartTest WHERE StudentId IN(SELECT Id FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ')) GROUP BY StudentId';
                    } else {
                        var queryString3 = 'SELECT StudentId, AVG(ResultPercentage) AS QuizScore FROM StudentWritesSmartTest WHERE StudentId IN(SELECT Id FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ')) AND QuestionId IN(SELECT QuestionId FROM TopicHasQuestion WHERE Tags REGEXP "' + req.body.Tags.join("|") + '") GROUP BY StudentId';
                    }
                } else {
                    if (req.body.Tags.length == 0) {
                        var queryString3 = 'SELECT StudentId, AVG(ResultPercentage) AS QuizScore FROM StudentWritesSmartTest WHERE StudentId IN(SELECT Id FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ')) AND QuestionId IN(SELECT thq.QuestionId FROM TopicHasQuestion thq INNER JOIN SmartTestHasQuestions sthq ON sthq.QuestionId = thq.QuestionId AND sthq.SmartTestId IN (' + req.body.Quizzes.join(",") + ')) GROUP BY StudentId';
                    } else {
                        var queryString3 = 'SELECT StudentId, AVG(ResultPercentage) AS QuizScore FROM StudentWritesSmartTest WHERE StudentId IN(SELECT Id FROM Student WHERE ClassId IN (' + req.body.ClassIds.join(",") + ')) AND QuestionId IN(SELECT thq.QuestionId FROM TopicHasQuestion thq INNER JOIN SmartTestHasQuestions sthq ON sthq.QuestionId = thq.QuestionId AND sthq.SmartTestId IN (' + req.body.Quizzes.join(",") + ') AND thq.Tags REGEXP "' + req.body.Tags.join("|") + '") GROUP BY StudentId';
                    }
                }
                database.connectionString.query(queryString3, function(err3, rows3) {
                    if (!err3) {
                        var queryString2 = 'SELECT t.*, swt.StudentId, swt.ResultPercentage AS ResultPercentage FROM Test t LEFT JOIN StudentWritesTest swt ON t.Id = swt.TestId WHERE t.Id IN (SELECT TestId FROM TestHasCriteria WHERE CriteriaId IN (SELECT CriteriaId FROM TopicHasCriteria WHERE Tags REGEXP "' + req.body.Tags.join(",") + '")) AND t.ClassId IN (' + req.body.ClassIds.join(",") + ') AND t.SubjectId IN (' + req.body.SubjectIds.join(",") + ')';
                        database.connectionString.query(queryString2, function(err4, rows4) {
                            if (!err4) {
                                for (var i = 0; i < rows.length; i++) {
                                    rows[i].TestScore = 0;
                                    rows[i].ExamScore = 0;
                                    rows[i].QuizScore = 0;
                                    var no_of_tests = 0,
                                        testTotal = 0;
                                    var no_of_exams = 0,
                                        examTotal = 0;
                                    for (var j = 0; j < rows4.length; j++) {
                                        if (rows[i].Id == rows4[j].StudentId) {
                                            if (rows4[j].IsFinal == '1') {
                                                no_of_exams++;
                                                examTotal += rows4[j].ResultPercentage;
                                            } else {
                                                no_of_tests++;
                                                testTotal += rows4[j].ResultPercentage;
                                            }
                                        }
                                    }
                                    if (no_of_exams != 0) {
                                        rows[i].ExamScore = examTotal / no_of_exams;
                                    }
                                    if (no_of_tests != 0) {
                                        rows[i].TestScore = testTotal / no_of_tests;
                                    }
                                    for (var k = 0; k < rows3.length; k++) {
                                        if (rows[i].Id == rows3[k].StudentId) {
                                            rows[i].QuizScore = rows3[k].QuizScore;
                                        }
                                    }
                                }
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = rows;
                                res.send(result);
                            } else {
                                res.send(err4);
                            }
                        });
                    } else {
                        res.send(err3);
                    }
                });

            } else {
                res.send(err);
            }
        });
    }
}