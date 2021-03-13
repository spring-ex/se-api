'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

var asyncLoop = require('node-async-loop');
var moment = require('moment');

module.exports = {
    getAllStudents: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from Student WHERE Status <> 1 ORDER BY Name ASC';
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
    getStudentsByRoute: function(req, res) {
        var result = {};
        var queryString = 'SELECT Student.Id, Student.Name, Student.PhoneNumber, Student.FindInboxId, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Admission.Id = Student.AdmissionId WHERE Student.RouteId = ' + req.params.RouteId + ' AND Student.Status <> 1 ORDER BY Name ASC';
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
    getAllFeesCollected: function(req, res) {
        var result = {};
        if (req.body.CourseId != null && req.body.BranchId != null && req.body.SemesterId != null && req.body.ClassId != null) {
            var queryString = 'SELECT Student.Id, Student.Name, Admission.TotalFees, Payment.PaymentMode, Payment.FeesPaid, Payment.PaymentModeNumber, Payment.PaymentDate FROM Admission INNER JOIN Student ON Student.AdmissionId = Admission.Id LEFT JOIN Payment ON Admission.Id = Payment.AdmissionId WHERE Student.CollegeId = ' + req.body.CollegeId + ' AND Student.CourseId = ' + req.body.CourseId + ' AND Student.BranchId = ' + req.body.BranchId + ' AND Student.SemesterId = ' + req.body.SemesterId + ' AND Student.ClassId = ' + req.body.ClassId + ' AND Student.Status <> 1 ORDER BY Student.Name ASC';
        } else if (req.body.CourseId != null && req.body.BranchId != null && req.body.SemesterId != null) {
            var queryString = 'SELECT Student.Id, Student.Name, Admission.TotalFees, Payment.PaymentMode, Payment.FeesPaid, Payment.PaymentModeNumber, Payment.PaymentDate FROM Admission INNER JOIN Student ON Student.AdmissionId = Admission.Id LEFT JOIN Payment ON Admission.Id = Payment.AdmissionId WHERE Student.CollegeId = ' + req.body.CollegeId + ' AND Student.CourseId = ' + req.body.CourseId + ' AND Student.BranchId = ' + req.body.BranchId + ' AND Student.SemesterId = ' + req.body.SemesterId + ' AND Student.Status <> 1 ORDER BY Student.Name ASC';
        } else if (req.body.CourseId != null && req.body.BranchId != null) {
            var queryString = 'SELECT Student.Id, Student.Name, Admission.TotalFees, Payment.PaymentMode, Payment.FeesPaid, Payment.PaymentModeNumber, Payment.PaymentDate FROM Admission INNER JOIN Student ON Student.AdmissionId = Admission.Id LEFT JOIN Payment ON Admission.Id = Payment.AdmissionId WHERE Student.CollegeId = ' + req.body.CollegeId + ' AND Student.CourseId = ' + req.body.CourseId + ' AND Student.BranchId = ' + req.body.BranchId + ' AND Student.Status <> 1 ORDER BY Student.Name ASC';
        } else if (req.body.CourseId != null) {
            var queryString = 'SELECT Student.Id, Student.Name, Admission.TotalFees, Payment.PaymentMode, Payment.FeesPaid, Payment.PaymentModeNumber, Payment.PaymentDate FROM Admission INNER JOIN Student ON Student.AdmissionId = Admission.Id LEFT JOIN Payment ON Admission.Id = Payment.AdmissionId WHERE Student.CollegeId = ' + req.body.CollegeId + ' AND Student.CourseId = ' + req.body.CourseId + ' AND Student.Status <> 1 ORDER BY Student.Name ASC';
        } else {
            var queryString = 'SELECT Student.Id, Student.Name, Admission.TotalFees, Payment.PaymentMode, Payment.FeesPaid, Payment.PaymentModeNumber, Payment.PaymentDate FROM Admission INNER JOIN Student ON Student.AdmissionId = Admission.Id LEFT JOIN Payment ON Admission.Id = Payment.AdmissionId WHERE Student.CollegeId = ' + req.body.CollegeId + ' AND Student.Status <> 1 ORDER BY Student.Name ASC';
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    if (req.body.CourseId != null && req.body.BranchId != null && req.body.SemesterId != null && req.body.ClassId != null) {
                        var queryString2 = 'SELECT COUNT(Id) AS StudentCount FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND BranchId = ' + req.body.BranchId + ' AND SemesterId = ' + req.body.SemesterId + ' AND ClassId = ' + req.body.ClassId + ' AND Status <> 1';
                    } else if (req.body.CourseId != null && req.body.BranchId != null && req.body.SemesterId != null) {
                        var queryString2 = 'SELECT COUNT(Id) AS StudentCount FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND BranchId = ' + req.body.BranchId + ' AND SemesterId = ' + req.body.SemesterId + ' AND Status <> 1';
                    } else if (req.body.CourseId != null && req.body.BranchId != null) {
                        var queryString2 = 'SELECT COUNT(Id) AS StudentCount FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND BranchId = ' + req.body.BranchId + ' AND Status <> 1';
                    } else if (req.body.CourseId != null) {
                        var queryString2 = 'SELECT COUNT(Id) AS StudentCount FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND Status <> 1';
                    } else {
                        var queryString2 = 'SELECT COUNT(Id) AS StudentCount FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND Status <> 1';
                    }
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            if (rows2.length == 0) {
                                result.Code = statusCodes.errorCodes[0].Code;
                                result.Message = statusCodes.errorCodes[0].Message;
                                result.Data = null;
                                res.send(result);
                            } else {
                                var rowIdsToSend = [];
                                var repeatIndices = [];
                                for (var i = 0; i < rows.length; i++) {
                                    if (rowIdsToSend.indexOf(rows[i].Id) == -1) {
                                        rowIdsToSend.push(rows[i].Id);
                                    }
                                }
                                var flag = 0;
                                for (var i = 0; i < rowIdsToSend.length; i++) {
                                    flag = 0;
                                    for (var j = 0; j < rows.length; j++) {
                                        if (rowIdsToSend[i] == rows[j].Id) {
                                            if (flag) {
                                                rows[j].TotalFees = 0;
                                            }
                                            flag = 1;
                                        }
                                    }
                                }
                                var response = {
                                    FeesCollected: rows,
                                    StudentCount: rows2[0].StudentCount
                                };
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
    getAllFeesCollectedNew: function(req, res) {
        var result = {};
        var queryString = 'SELECT COUNT(DISTINCT s.Id) AS StudentCount, SUM(TotalTuitionFees) AS TotalTuitionFees, SUM(CollectedTuitionFees) AS CollectedTuitionFees, SUM(TotalTransportFees) AS TotalTransportFees, SUM(CollectedTransportFees) AS CollectedTransportFees, SUM(r.Disc) AS TuitionFeesDiscount FROM Student s LEFT JOIN (SELECT StudentId, SUM(Type1Fees + Type2Fees) AS TotalTuitionFees, SUM(IF(Type1Status = 1, Type1Fees, 0) + Type2Fees) AS CollectedTuitionFees, SUM(Type3Fees) AS TotalTransportFees, SUM(IF(Type3Status = 1, Type3Fees, 0)) AS CollectedTransportFees FROM FeesCollection WHERE StudentId IN (SELECT Id FROM Student WHERE CollegeId = ' + req.params.CollegeId + ') GROUP BY StudentId) fc ON s.Id = fc.StudentId LEFT JOIN (SELECT StudentId, MAX(Discount) AS Disc FROM Receipt WHERE StudentId IN (SELECT Id FROM Student WHERE CollegeId = ' + req.params.CollegeId + ') GROUP BY StudentId) AS r ON s.Id = r.StudentId WHERE s.Status <> 1 AND s.CollegeId = ' + req.params.CollegeId;
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
    getDevelopmentFeesCollected: function(req, res) {
        var result = {};
        var queryString = 'SELECT COUNT(DISTINCT s.Id) AS StudentCount, SUM(Type4Fees) AS CollectedDevelopmentFees FROM Student s LEFT JOIN Type4FeesCollection fc ON s.Id = fc.StudentId WHERE s.Status <> 1 AND s.CollegeId = ' + req.params.CollegeId;
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
    getAllStudentsByCourseBranchSem: function(req, res) {
        var result = {};
        var queryString = 'SELECT Student.FindInboxId, Student.Name, Student.PhoneNumber, Student.DeviceId, Student.RollNumber, Class.Name as ClassName, Class.Id as ClassId, Student.Id, Student.BranchId, Admission.FatherPhoneNumber, Admission.DateOfBirth, Admission.Id as AdmissionId from Student INNER JOIN Class ON Student.ClassId = Class.Id INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.CourseId = ' + req.params.CourseId + ' AND Student.BranchId = ' + req.params.BranchId + ' AND Student.SemesterId = ' + req.params.SemesterId + ' AND Student.ClassId = ' + req.params.ClassId + ' AND Student.CollegeId = ' + req.params.CollegeId + ' AND Student.Status <> 1 ORDER BY Student.Name ASC';
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
    getAllStudentsBySubject: function(req, res) {
        var result = {};
        var queryString = 'SELECT Id, Name FROM Student WHERE ClassId = ' + req.params.ClassId + ' AND Id NOT IN (SELECT StudentId FROM StudentTakesElective WHERE ClassId = ' + req.params.ClassId + ' AND SubjectId = ' + req.params.SubjectId + ') AND Student.Status <> 1 ORDER BY Student.Name ASC';
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
    getBalanceFeesforStudent: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM FeesStructure WHERE BranchId = ' + req.body.BranchId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var annualFees = 0;
                    if (rows[0].TuitionFees != null) {
                        annualFees = rows[0].TuitionFees * 12;
                    }
                    var queryString2 = 'SELECT SUM(Type1Fees) AS TotalFees FROM FeesCollection WHERE Type1Status = 1 AND StudentId = ' + req.body.StudentId;
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            var balanceTuitionFees = annualFees - rows2[0].TotalFees;
                            var response = {
                                HasPaid: rows2[0].TotalFees > 0 ? true : false,
                                BalanceTuitionFees: balanceTuitionFees,
                                BalanceDevelopmentFees: 0
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
    setTrialStartDate: function(req, res) {
        var result = {};
        var queryString = 'UPDATE Student SET TrialStartDate = "' + req.body.TrialStartDate + '" WHERE Id = ' + req.body.StudentId;
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
    promoteStudents: function(req, res) {
        var result = {};
        var queryString = 'UPDATE Student SET SemesterId = ' + req.body.SemesterId + ', ClassId = ' + req.body.ClassId + ' WHERE Id IN (' + req.body.StudentIds.join(",") + ')';
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
    },
    assignStudentToSubject: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Subject WHERE SpecialSubjectId = ' + req.body.SpecialSubjectId + ' AND BranchId = ' + req.body.Student.BranchId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                req.body.Student.SubjectId = rows[0].Id;
                var queryString2 = 'INSERT INTO StudentTakesElective(StudentId, ClassId, SubjectId) VALUES (' + req.body.Student.Id + ', ' + req.body.Student.ClassId + ', ' + req.body.Student.SubjectId + ') ON DUPLICATE KEY UPDATE SubjectId = VALUES(SubjectId)';
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        var queryString3 = 'INSERT INTO StudentTakesSpecialClass(StudentId, SpecialClassId, NormalSubjectId) VALUES (' + req.body.Student.Id + ', ' + req.body.SpecialClassId + ', ' + req.body.Student.SubjectId + ') ON DUPLICATE KEY UPDATE NormalSubjectId = VALUES(NormalSubjectId)';
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
                        res.send(err2);
                    }
                });
            } else {
                res.send(err);
            }
        });
    },
    unAssignStudentFromSubject: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Subject WHERE SpecialSubjectId = ' + req.body.SpecialSubjectId + ' AND BranchId = ' + req.body.Student.BranchId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                req.body.Student.SubjectId = rows[0].Id;
                var queryString2 = 'DELETE FROM StudentTakesElective WHERE StudentId = ' + req.body.Student.Id + ' AND ClassId = ' + req.body.Student.ClassId + ' AND SubjectId = ' + req.body.Student.SubjectId;
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        var queryString3 = 'DELETE FROM StudentTakesSpecialClass WHERE StudentId = ' + req.body.Student.Id + ' AND SpecialClassId = ' + req.body.SpecialClassId + ' AND NormalSubjectId = ' + req.body.Student.SubjectId;
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
                        res.send(err2);
                    }
                });
            } else {
                res.send(err);
            }
        });
    },
    assignStudentToElectiveSubject: function(req, res) {
        var result = {};
        var queries = [];
        for (var i = 0; i < req.body.Students.length; i++) {
            var query = 'INSERT INTO StudentTakesElective(StudentId, ClassId, SubjectId) VALUES (' + req.body.Students[i].Id + ', ' + req.body.Students[i].ClassId + ', ' + req.body.Students[i].SubjectId + ')';
            queries.push(query);
        }
        database.connectionString.query(queries.join("; "), function(err2, rows2) {
            if (!err2) {
                result.Code = statusCodes.successCodes[0].Code;
                result.Message = statusCodes.successCodes[0].Message;
                result.Data = rows2;
                res.send(result);
            } else {
                res.send(err2);
            }
        });
    },
    assignStudentsToSection: function(req, res) {
        var result = {};
        if (req.body.ClassId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Student SET ClassId = ' + req.body.ClassId + ' WHERE Id IN (' + req.body.StudentIds.join(",") + ') AND CollegeId = ' + req.body.CollegeId;
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
    getStudentsForCollege: function(req, res) {
        var result = {};
        if (req.params.CollegeId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT * from Student WHERE CollegeId = ' + req.params.CollegeId + ' AND Status <> 1  ORDER BY Name ASC';
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
    getStudentsByClass: function(req, res) {
        var result = {};
        if (req.params.IsElective == "true") {
            var queryString2 = 'SELECT Student.Id, Student.Name, Student.DeviceId, Student.FindInboxId, Student.PhoneNumber, Student.CollegeId, Student.CourseId, Student.BranchId, Student.SemesterId, Student.RollNumber, Student.ClassId, Student.PhoneNumber, Admission.DateOfBirth, Admission.FatherPhoneNumber, Admission.MotherPhoneNumber, Admission.FatherDeviceId, Admission.MotherDeviceId, StudentTakesSpecialClass.NormalSubjectId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id INNER JOIN StudentTakesSpecialClass ON Student.Id = StudentTakesSpecialClass.StudentId WHERE StudentTakesSpecialClass.SpecialClassId = ' + req.params.ClassId + ' AND Student.Status <> 1 ORDER BY Name ASC';
        } else {
            var queryString2 = 'SELECT Student.Id, Student.Name, Student.DeviceId, Student.FindInboxId, Student.PhoneNumber, Student.CollegeId, Student.CourseId, Student.BranchId, Student.SemesterId, Student.RollNumber, Student.ClassId, Student.PhoneNumber, Admission.DateOfBirth, Admission.FatherPhoneNumber, Admission.MotherPhoneNumber, Admission.FatherDeviceId, Admission.MotherDeviceId from Student INNER JOIN Admission ON Student.AdmissionId = Admission.Id WHERE Student.ClassId = ' + req.params.ClassId + ' AND Student.CollegeId = ' + req.params.CollegeId + ' AND Student.Status <> 1 ORDER BY Name ASC';
        }
        database.connectionString.query(queryString2, function(err2, rows2) {
            if (!err2) {
                if (rows2.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                } else {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows2;
                }
                res.send(result);
            } else {
                res.send(err2);
            }
        });
    },
    getStudentById: function(req, res) {
        var result = {};
        if (req.params.StudentId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT Student.Id, Student.Name, Student.RollNumber, Student.CourseId, Student.BranchId, Student.SemesterId, Student.ClassId, Student.PhoneNumber, Student.FindInboxId, Admission.Id as AdmissionId, Admission.GenderId, Admission.DateOfBirth, Admission.FatherName, Admission.FatherOccupation, Admission.MotherName, Admission.MotherOccupation, Admission.FatherPhoneNumber,  Admission.MotherPhoneNumber, Admission.Email, Admission.Address, Admission.TotalFees, Admission.Remarks, Admission.BloodGroup, Admission.AadhaarNumber, Admission.ProfileImageURL, Admission.FatherImageURL, Admission.MotherImageURL, Admission.ApplicationFormNumber FROM Student INNER JOIN Admission ON Admission.Id = Student.AdmissionId WHERE Student.Id = ' + req.params.StudentId + ' AND Student.Status <> 1';
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    if (rows.length == 0) {
                        result.Code = statusCodes.errorCodes[0].Code;
                        result.Message = statusCodes.errorCodes[0].Message;
                        result.Data = null;
                        res.send(result);
                        return;
                    } else {
                        var queryString2 = 'SELECT * FROM Payment WHERE AdmissionId IN (SELECT AdmissionId FROM Student WHERE Id = ' + req.params.StudentId + ' AND Status <> 1)';
                        database.connectionString.query(queryString2, function(err2, rows2) {
                            if (!err2) {
                                rows[0].Payment = rows2;
                                var response = rows;
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = response;
                                res.send(result);
                            } else {
                                res.send(err2)
                            }
                        });
                    }
                } else {
                    res.send(err);
                }
            });
        }
    },
    getStudentByPhoneNumber: function(req, res) {
        var result = {};
        if (req.params.PhoneNumber == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT * FROM Student WHERE PhoneNumber = "' + req.params.PhoneNumber + '" AND CollegeId = ' + req.params.CollegeId;
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    if (rows.length == 0) {
                        result.Code = statusCodes.errorCodes[1].Code;
                        result.Message = statusCodes.errorCodes[1].Message;
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
    addStudent: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.CollegeId == "" || req.body.CourseId == "" || req.body.BranchId == "" || req.body.SemesterId == "" || req.body.ClassId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var admissionTableValues = {
                Id: null,
                CollegeId: req.body.CollegeId,
                Name: req.body.Name,
                GenderId: req.body.GenderId,
                DateOfBirth: req.body.DateOfBirth,
                AadhaarNumber: req.body.AadhaarNumber,
                FatherName: req.body.FatherName,
                MotherName: req.body.MotherName,
                PhoneNumber: req.body.PhoneNumber,
                FatherPhoneNumber: req.body.FatherPhoneNumber,
                MotherPhoneNumber: req.body.MotherPhoneNumber,
                Address: req.body.Address,
                Email: req.body.Email,
                FatherOccupation: req.body.FatherOccupation,
                MotherOccupation: req.body.MotherOccupation,
                TotalFees: req.body.TotalFees,
                Remarks: req.body.Remarks,
                BloodGroup: req.body.BloodGroup,
                MotherTongue: req.body.MotherTongue,
                SocialCategory: req.body.SocialCategory,
                Nationality: req.body.Nationality,
                Caste: req.body.Caste,
                SubCaste: req.body.SubCaste,
                CasteCertificateNumber: req.body.CasteCertificateNumber,
                PreviousSchoolName: req.body.PreviousSchoolName,
                PreviousClass: req.body.PreviousClass,
                PreviousMediumOfInstruction: req.body.PreviousMediumOfInstruction,
                TransferCertificateNumber: req.body.TransferCertificateNumber,
                SATSNumber: req.body.SATSNumber,
                ApplicationFormNumber: req.body.UniqueId
            };
            var queryString = 'INSERT INTO Admission SET ?';
            database.connectionString.query(queryString, admissionTableValues, function(err, rows) {
                if (!err) {
                    var studentTableValues = {
                        Id: null,
                        CollegeId: req.body.CollegeId,
                        CourseId: req.body.CourseId,
                        BranchId: req.body.BranchId,
                        SemesterId: req.body.SemesterId,
                        ClassId: req.body.ClassId,
                        Name: req.body.Name,
                        PhoneNumber: req.body.PhoneNumber,
                        Password: req.body.PhoneNumber,
                        FindInboxId: module.exports.getUniqueId(),
                        AdmissionId: rows.insertId,
                        Status: 0,
                        RollNumber: req.body.RollNumber,
                        StudentType: req.body.StudentType,
                        IsRTE: req.body.IsRTE
                    };
                    var queryString2 = 'INSERT INTO Student SET ?';
                    database.connectionString.query(queryString2, studentTableValues, function(err2, rows2) {
                        if (!err2) {
                            if (req.body.Payment.length > 0) {
                                var queries = [];
                                for (var i = 0; i < req.body.Payment.length; i++) {
                                    var query = 'INSERT INTO Payment(Id, AdmissionId, PaymentMode, FeesPaid, PaymentModeNumber, PaymentDate) VALUES (null, ' + rows.insertId + ', "' + req.body.Payment[i].PaymentMode + '", ' + req.body.Payment[i].FeesPaid + ', "' + req.body.Payment[i].PaymentModeNumber + '", "' + req.body.Payment[i].PaymentDate + '")';
                                    queries.push(query);
                                }
                                database.connectionString.query(queries.join("; "), function(err3, rows3) {
                                    if (!err3) {
                                        if (req.body.EnquiryId != null || req.body.EnquiryId != "") {
                                            var queryString4 = 'UPDATE Enquiry SET Status = "CONVERTED" WHERE Id = ' + req.body.EnquiryId;
                                            database.connectionString.query(queryString4, function(err4, rows4) {
                                                if (!err4) {
                                                    result.Code = statusCodes.successCodes[0].Code;
                                                    result.Message = statusCodes.successCodes[0].Message;
                                                    result.Data = rows2; //send rows 2 for UI to proceed with student fees collection
                                                    res.send(result);
                                                } else {
                                                    res.send(err4)
                                                }
                                            });
                                        }
                                    } else {
                                        res.send(err3);
                                    }
                                });
                            } else {
                                if (req.body.EnquiryId != null || req.body.EnquiryId != "") {
                                    var queryString4 = 'UPDATE Enquiry SET Status = "CONVERTED" WHERE Id = ' + req.body.EnquiryId;
                                    database.connectionString.query(queryString4, function(err4, rows4) {
                                        if (!err4) {
                                            result.Code = statusCodes.successCodes[0].Code;
                                            result.Message = statusCodes.successCodes[0].Message;
                                            result.Data = rows2; //send rows 2 for UI to proceed with student fees collection
                                            res.send(result);
                                        } else {
                                            res.send(err4)
                                        }
                                    });
                                }
                            }
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
    updateStudent: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.CollegeId == "" || req.body.CourseId == "" || req.body.BranchId == "" || req.body.SemesterId == "" || req.body.ClassId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var studentTableValues = {
                CourseId: req.body.CourseId,
                BranchId: req.body.BranchId,
                SemesterId: req.body.SemesterId,
                ClassId: req.body.ClassId,
                Name: req.body.Name,
                PhoneNumber: req.body.PhoneNumber,
                RollNumber: req.body.RollNumber,
                StudentType: req.body.StudentType,
                IsRTE: req.body.IsRTE,
                Status: 0 // update api makes the student status 0
            };
            var admissionTableValues = {
                Name: req.body.Name,
                GenderId: req.body.GenderId,
                DateOfBirth: req.body.DateOfBirth,
                AadhaarNumber: req.body.AadhaarNumber,
                FatherName: req.body.FatherName,
                MotherName: req.body.MotherName,
                PhoneNumber: req.body.PhoneNumber,
                FatherPhoneNumber: req.body.FatherPhoneNumber,
                MotherPhoneNumber: req.body.MotherPhoneNumber,
                Address: req.body.Address,
                Email: req.body.Email,
                FatherOccupation: req.body.FatherOccupation,
                MotherOccupation: req.body.MotherOccupation,
                TotalFees: req.body.TotalFees,
                MotherTongue: req.body.MotherTongue,
                SocialCategory: req.body.SocialCategory,
                Nationality: req.body.Nationality,
                Caste: req.body.Caste,
                SubCaste: req.body.SubCaste,
                CasteCertificateNumber: req.body.CasteCertificateNumber,
                PreviousSchoolName: req.body.PreviousSchoolName,
                PreviousClass: req.body.PreviousClass,
                PreviousMediumOfInstruction: req.body.PreviousMediumOfInstruction,
                TransferCertificateNumber: req.body.TransferCertificateNumber,
                SATSNumber: req.body.SATSNumber
            };
            // get previous branch and semesterid of student
            var queryString4 = 'SELECT BranchId, SemesterId FROM Student WHERE Id = ' + req.body.Id;
            database.connectionString.query(queryString4, function(err4, rows4) {
                if (!err4) {
                    var previous_branch_id = rows4[0].BranchId;
                    var previous_semester_id = rows4[0].SemesterId;
                    var queryString = 'UPDATE Student SET ? WHERE Id = ' + req.body.Id;
                    database.connectionString.query(queryString, studentTableValues, function(err, rows) {
                        if (!err) {
                            var queryString2 = 'UPDATE Admission SET ? WHERE Id = ' + req.body.AdmissionId;
                            database.connectionString.query(queryString2, admissionTableValues, function(err2, rows2) {
                                if (!err2) {
                                    if (req.body.BranchId != previous_branch_id || req.body.SemesterId != previous_semester_id) {
                                        //clear their entries from special class and electives tables if branch/semester is updated
                                        var queryString3 = 'DELETE FROM StudentTakesElective WHERE StudentId IN (' + req.body.Id + ');DELETE FROM StudentTakesSpecialClass WHERE StudentId IN (' + req.body.Id + ');';
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
                                        result.Code = statusCodes.successCodes[0].Code;
                                        result.Message = statusCodes.successCodes[0].Message;
                                        result.Data = rows2;
                                        res.send(result);
                                    }
                                } else {
                                    res.send(err2)
                                }
                            })
                        } else {
                            res.send(err);
                        }
                    });
                } else {
                    res.send(err4);
                }
            });
        }
    },
    deleteStudent: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Admission WHERE Id = ' + req.body.AdmissionId;
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
    getUniqueId: function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },
    updatePhoneNumber: function(req, res) {
        var result = {};
        if (req.body.PhoneNumber == "" || req.body.NumberType == "" || req.body.StudentId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            if (req.body.NumberType == 1) {
                var queryString = 'UPDATE Student, Admission SET Student.PhoneNumber = ' + req.body.PhoneNumber + ', Admission.PhoneNumber = ' + req.body.PhoneNumber + ' WHERE Student.AdmissionId = Admission.Id AND Student.Id = ' + req.body.StudentId;
            } else if (req.body.NumberType == 2) {
                var queryString = 'UPDATE Student, Admission SET Admission.FatherPhoneNumber = ' + req.body.PhoneNumber + ' WHERE Student.AdmissionId = Admission.Id AND Student.Id = ' + req.body.StudentId;
            } else {
                var queryString = 'UPDATE Student, Admission SET Admission.MotherPhoneNumber = ' + req.body.PhoneNumber + ' WHERE Student.AdmissionId = Admission.Id AND Student.Id = ' + req.body.StudentId;
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
    updateDateOfBirth: function(req, res) {
        var result = {};
        if (req.body.DateOfBirth == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Student, Admission SET Admission.DateOfBirth = "' + req.body.DateOfBirth + '" WHERE Student.AdmissionId = Admission.Id AND Student.Id = ' + req.body.StudentId;
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
    resetPassword: function(req, res) {
        var result = {};
        if (req.body.StudentId == "" || req.body.PhoneNumber == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Student SET Password = ' + req.body.PhoneNumber + ' WHERE Id = ' + req.body.StudentId;
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
    updatePayment: function(req, res) {
        var result = {};
        if (req.body.Id == "" || req.body.FeesPaid == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Payment SET FeesPaid = ' + req.body.FeesPaid + ' WHERE Id = ' + req.body.Id;
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
    addPayment: function(req, res) {
        var result = {};
        if (req.body.FeesPaid == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO Payment SET ?';
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
    deletePayment: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Payment WHERE Id = ' + req.body.Id;
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
    studentBulkUpload: function(req, res) {
        var result = {};
        if (req.body.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var count = 0;
            asyncLoop(req.body, function(item, next) {
                var admissionTableValues = {
                    Id: null,
                    CollegeId: item.CollegeId,
                    Name: item.Name,
                    GenderId: item.GenderId,
                    DateOfBirth: item.DateOfBirth,
                    FatherName: item.FatherName,
                    MotherName: item.MotherName,
                    PhoneNumber: item.PhoneNumber,
                    FatherPhoneNumber: item.FatherPhoneNumber,
                    MotherPhoneNumber: item.MotherPhoneNumber,
                    Address: item.Address,
                    Email: item.Email,
                    FatherOccupation: item.FatherOccupation,
                    MotherOccupation: item.MotherOccupation,
                    TotalFees: item.TotalFees,
                    Remarks: item.Remarks
                };
                var queryString = 'INSERT INTO Admission SET ?';
                database.connectionString.query(queryString, admissionTableValues, function(err, rows) {
                    if (!err) {
                        var studentTableValues = {
                            Id: null,
                            CollegeId: item.CollegeId,
                            CourseId: item.CourseId,
                            BranchId: item.BranchId,
                            SemesterId: item.SemesterId,
                            ClassId: item.ClassId,
                            Name: item.Name,
                            PhoneNumber: item.PhoneNumber,
                            Password: item.Password,
                            FindInboxId: module.exports.getUniqueId(),
                            AdmissionId: rows.insertId,
                            RollNumber: item.RollNumber,
                            Status: 0
                        };
                        var queryString2 = 'INSERT INTO Student SET ?';
                        database.connectionString.query(queryString2, studentTableValues, function(err2, rows2) {
                            if (!err2) {
                                count++;
                                if (count == req.body.length) {
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = rows2;
                                    res.send(result);
                                } else {
                                    next();
                                }
                            } else {
                                res.send(err2);
                            }
                        });
                    } else {
                        res.send(err);
                    }
                });
            }, function(err) {
                if (err) {
                    res.send(err);
                    return;
                }
            });
        }
    }
}