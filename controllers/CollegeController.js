'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');
var moment = require('moment');

module.exports = {
    getAllColleges: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from College';
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
    addCollege: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.UniversityId == "" || req.body.PackageCode == "" || req.body.StateId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var userDetails = req.body.UserDetails;
            delete req.body.UserDetails;
            var queryString = 'INSERT INTO College SET ?';
            database.connectionString.query(queryString, req.body, function(err, rows) {
                if (!err) {
                    var queryString3 = 'INSERT INTO CollegeHasFeesKeywords(CollegeId) VALUES(' + rows.insertId + ')';
                    database.connectionString.query(queryString3, function(err3, rows3) {
                        if (!err3) {
                            userDetails.CollegeId = rows.insertId;
                            var queryString2 = 'INSERT INTO User SET ?';
                            database.connectionString.query(queryString2, userDetails, function(err2, rows2) {
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
                            res.send(err3);
                        }
                    });
                } else {
                    res.send(err);
                }
            });
        }
    },
    updateCollege: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE College SET Name = "' + req.body.Name + '" WHERE Id = ' + req.body.Id;
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
    updatePackageForCollege: function(req, res) {
        var result = {};
        if (req.body.PackageCode == "" || req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE College SET PackageCode = "' + req.body.PackageCode + '" WHERE Id = ' + req.body.Id;
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
    deleteCollege: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM College WHERE Id = ' + req.body.Id;
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
    getFeesInfo: function(req, res) {
        var result = {};
        if (req.body.CollegeId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            // var academicYear = (new Date().getMonth() <= 3) ? moment().subtract(1, 'years').year() + "-" + moment().year() : moment.year() + "-" + moment().add(1, 'years').year();
            var academicYear = req.body.AcademicYear;
            var queryString = 'SELECT * FROM FeesStructure WHERE CollegeId = ' + req.body.CollegeId + ' AND BranchId = ' + req.body.BranchId + ' AND AcademicYear = "' + academicYear + '"';
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    if (rows.length == 0) {
                        result.Code = statusCodes.errorCodes[1].Code;
                        result.Message = statusCodes.errorCodes[1].Message;
                        result.Data = null;
                        res.send(result);
                    } else {
                        var tuitionFees = rows[0].TuitionFees * 12;
                        var developmentFeesForNew = rows[0].OtherComponent1;
                        var developmentFeesForOld = rows[0].OtherComponent2;
                        var queryString2 = 'SELECT s.Id, s.Name, s.DeviceId, s.BranchId, s.StudentType, a.FatherDeviceId, a.MotherDeviceId, fc.TuitionFees, t4fc.DevelopmentFees, t4fc.Discount, t4fc.AddOnFees, r.Discount AS TuitionFeesDiscount FROM Student s INNER JOIN Admission a ON s.AdmissionId = a.Id LEFT JOIN (SELECT StudentId, SUM(Type1Fees) AS TuitionFees FROM FeesCollection WHERE Type1Status = 1 AND AcademicYear = "' + academicYear + '" GROUP BY StudentId) fc ON s.Id = fc.StudentId LEFT JOIN (SELECT StudentId, SUM(Type4Fees) AS DevelopmentFees, MAX(Discount) AS Discount, MAX(AddOnFees) AS AddOnFees FROM Type4FeesCollection WHERE AcademicYear = "' + academicYear + '" GROUP BY StudentId) t4fc ON s.Id = t4fc.StudentId LEFT JOIN (SELECT StudentId, MAX(Discount) AS Discount FROM Receipt WHERE AcademicYear = "' + academicYear + '" AND FeesType = "Type1" GROUP BY StudentId) AS r ON s.Id = r.StudentId WHERE s.CollegeId = ' + req.body.CollegeId + ' AND s.BranchId = ' + req.body.BranchId + ' AND s.Status <> 1 AND s.IsRTE <> 1 GROUP BY s.Id';
                        database.connectionString.query(queryString2, function(err2, rows2) {
                            if (!err2) {
                                for (var i = 0; i < rows2.length; i++) {
                                    rows2[i].BalanceTuitionFees = (tuitionFees - rows2[i].TuitionFeesDiscount) - rows2[i].TuitionFees;
                                    var balanceDevFees = rows2[i].StudentType == 1 ? ((developmentFeesForNew + rows2[i].AddOnFees) - rows2[i].Discount) : ((developmentFeesForOld + rows2[i].AddOnFees) - rows2[i].Discount)
                                    rows2[i].BalanceDevelopmentFees = balanceDevFees - rows2[i].DevelopmentFees;
                                }
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = rows2;
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
    }
}