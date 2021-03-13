'use strict';
var jwt = require('jsonwebtoken');
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dzerq05zm',
    api_key: '199453447665147',
    api_secret: 'BoLRDxRTwA7gYNIJB0seOIeqopU'
});
var TinyURL = require('tinyurl');

module.exports = {
    login: function(req, res) {
        //login logic
        var result = {};
        var queryString = 'SELECT User.Name, User.Id, User.PhoneNumber, User.Password, User.Role, User.ProfileImageURL, User.CollegeId, User.DeviceId, User.RouteId, College.Name as CollegeName, College.Nickname as Nickname, College.PhoneNumber as CollegePhone, College.StateId, College.UniversityId, College.PackageCode, College.LogoImageURL, College.ShareImageURL, College.BankAccountInfo, College.SMSBroadcastAvailable, College.Type, College.CreatedAt, College.Address, College.IsB2C from User INNER JOIN College ON User.CollegeId = College.Id WHERE User.PhoneNumber = "' + req.body.PhoneNumber + '" AND User.Password = "' + req.body.Password + '" AND User.IsActive = "true"';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[2].Code;
                    result.Message = statusCodes.errorCodes[2].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    if (req.body.AdminAppVersion == undefined && req.body.FacultyAppVersion == undefined) {
                        var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                            expiresIn: 100000
                        });
                        result.Code = statusCodes.successCodes[0].Code;
                        result.Message = statusCodes.successCodes[0].Message;
                        var response = rows;
                        for (var i = 0; i < response.length; i++) {
                            response[i].Token = token;
                        }
                        result.Data = response;
                        res.send(result);
                    }
                    if (req.body.AdminAppVersion != undefined) {
                        if (req.body.OperatingSystem == 'android') {
                            if (req.body.PhoneNumber == 9591241474 && req.body.Password == '9591241474') {
                                var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                    expiresIn: 100000
                                });
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                var response = rows;
                                for (var i = 0; i < response.length; i++) {
                                    response[i].Token = token;
                                }
                                result.Data = response;
                                res.send(result);
                            } else {
                                if (process.env.AND_ADMIN_APP_VERSION == req.body.AdminAppVersion) {
                                    var queries = [];
                                    for (var i = 0; i < rows.length; i++) {
                                        var query = 'UPDATE User SET DeviceId = "' + req.body.DeviceId + '" WHERE Id = ' + rows[i].Id;
                                        queries.push(query);
                                    }
                                    database.connectionString.query(queries.join("; "), function(err5, rows5) {
                                        if (!err5) {
                                            var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                                expiresIn: 100000
                                            });
                                            result.Code = statusCodes.successCodes[0].Code;
                                            result.Message = statusCodes.successCodes[0].Message;
                                            var response = rows;
                                            for (var i = 0; i < response.length; i++) {
                                                response[i].Token = token;
                                            }
                                            result.Data = response;
                                            res.send(result);
                                        } else {
                                            res.send(err5);
                                        }

                                    });
                                } else {
                                    result.Code = statusCodes.errorCodes[9].Code;
                                    result.Message = statusCodes.errorCodes[9].Message;
                                    result.Data = null;
                                    res.send(result);
                                }
                            }
                        } else {
                            if (req.body.PhoneNumber == 9591241474 && req.body.Password == '9591241474') {
                                var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                    expiresIn: 100000
                                });
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                var response = rows;
                                for (var i = 0; i < response.length; i++) {
                                    response[i].Token = token;
                                }
                                result.Data = response;
                                res.send(result);
                            } else {
                                if (process.env.ADMIN_APP_VERSION == req.body.AdminAppVersion) {
                                    var queries = [];
                                    for (var i = 0; i < rows.length; i++) {
                                        var query = 'UPDATE User SET DeviceId = "' + req.body.DeviceId + '" WHERE Id = ' + rows[i].Id;
                                        queries.push(query);
                                    }
                                    database.connectionString.query(queries.join("; "), function(err5, rows5) {
                                        if (!err5) {
                                            var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                                expiresIn: 100000
                                            });
                                            result.Code = statusCodes.successCodes[0].Code;
                                            result.Message = statusCodes.successCodes[0].Message;
                                            var response = rows;
                                            for (var i = 0; i < response.length; i++) {
                                                response[i].Token = token;
                                            }
                                            result.Data = response;
                                            res.send(result);
                                        } else {
                                            res.send(err5);
                                        }

                                    });
                                } else {
                                    result.Code = statusCodes.errorCodes[9].Code;
                                    result.Message = statusCodes.errorCodes[9].Message;
                                    result.Data = null;
                                    res.send(result);
                                }
                            }
                        }
                    } else if (req.body.FacultyAppVersion != undefined) {
                        if (req.body.OperatingSystem == 'android') {
                            if (req.body.PhoneNumber == 9591241474 && req.body.Password == '9591241474') {
                                var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                    expiresIn: 100000
                                });
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                var response = rows;
                                for (var i = 0; i < response.length; i++) {
                                    response[i].Token = token;
                                }
                                result.Data = response;
                                res.send(result);
                            } else {
                                if (process.env.AND_FACULTY_APP_VERSION == req.body.FacultyAppVersion) {
                                    var queries = [];
                                    for (var i = 0; i < rows.length; i++) {
                                        var query = 'UPDATE User SET DeviceId = "' + req.body.DeviceId + '" WHERE Id = ' + rows[i].Id;
                                        queries.push(query);
                                    }
                                    database.connectionString.query(queries.join("; "), function(err5, rows5) {
                                        if (!err5) {
                                            var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                                expiresIn: 100000
                                            });
                                            result.Code = statusCodes.successCodes[0].Code;
                                            result.Message = statusCodes.successCodes[0].Message;
                                            var response = rows;
                                            for (var i = 0; i < response.length; i++) {
                                                response[i].Token = token;
                                            }
                                            result.Data = response;
                                            res.send(result);
                                        } else {
                                            res.send(err5);
                                        }

                                    });
                                } else {
                                    result.Code = statusCodes.errorCodes[9].Code;
                                    result.Message = statusCodes.errorCodes[9].Message;
                                    result.Data = null;
                                    res.send(result);
                                }
                            }
                        } else {
                            if (req.body.PhoneNumber == 9591241474 && req.body.Password == '9591241474') {
                                var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                    expiresIn: 100000
                                });
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                var response = rows;
                                for (var i = 0; i < response.length; i++) {
                                    response[i].Token = token;
                                }
                                result.Data = response;
                                res.send(result);
                            } else {
                                if (process.env.FACULTY_APP_VERSION == req.body.FacultyAppVersion) {
                                    var queries = [];
                                    for (var i = 0; i < rows.length; i++) {
                                        var query = 'UPDATE User SET DeviceId = "' + req.body.DeviceId + '" WHERE Id = ' + rows[i].Id;
                                        queries.push(query);
                                    }
                                    database.connectionString.query(queries.join("; "), function(err5, rows5) {
                                        if (!err5) {
                                            var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                                expiresIn: 100000
                                            });
                                            result.Code = statusCodes.successCodes[0].Code;
                                            result.Message = statusCodes.successCodes[0].Message;
                                            var response = rows;
                                            for (var i = 0; i < response.length; i++) {
                                                response[i].Token = token;
                                            }
                                            result.Data = response;
                                            res.send(result);
                                        } else {
                                            res.send(err5);
                                        }

                                    });
                                } else {
                                    result.Code = statusCodes.errorCodes[9].Code;
                                    result.Message = statusCodes.errorCodes[9].Message;
                                    result.Data = null;
                                    res.send(result);
                                }
                            }
                        }
                    }
                }
            } else {
                res.send(err);
            }
        });
    },
    studentLogin: function(req, res) {
        //login logic
        var result = {};
        var queryString = 'SELECT Student.Id, Student.Name, Student.PhoneNumber, Student.Password, Student.IdCardImageURL, Student.FindInboxId, Student.RollNumber, Student.CollegeId, Student.CourseId, Student.BranchId, Student.SemesterId, Student.ClassId, Student.Status, Student.RouteId, Student.StudentType, Student.TrialStartDate, College.PackageCode, College.LogoImageURL, College.BankAccountInfo, College.SMSBroadcastAvailable, College.Type, College.PhoneNumber AS CollegePhoneNumber, College.ShareImageURL, College.CreatedAt, College.TrialPeriodDays, College.IsB2C, Class.MeetingURL, Class.MeetingCredentials FROM Student INNER JOIN College ON Student.CollegeId = College.Id INNER JOIN Class ON Student.ClassId = Class.Id WHERE (Student.PhoneNumber = "' + req.body.PhoneNumber + '" AND Student.Password = "' + req.body.Password + '") OR (Student.RollNumber = "' + req.body.PhoneNumber + '" AND Student.Password = "' + req.body.Password + '") AND Student.Status <> 1';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[2].Code;
                    result.Message = statusCodes.errorCodes[2].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    if (req.body.OperatingSystem == 'android') {
                        if (req.body.PhoneNumber == 9591241474) {
                            var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                expiresIn: 100000
                            });
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            var response = rows;
                            for (var i = 0; i < response.length; i++) {
                                response[i].Token = token;
                            }
                            result.Data = response;
                            res.send(result);
                        } else {
                            if (process.env.AND_STUDENT_APP_VERSION == req.body.AppVersion) {
                                var queries = [];
                                for (var i = 0; i < rows.length; i++) {
                                    var query = 'UPDATE Student SET DeviceId = "' + req.body.DeviceId + '" WHERE Id = ' + rows[i].Id;
                                    queries.push(query);
                                }
                                database.connectionString.query(queries.join("; "), function(err2, rows2) {
                                    if (!err2) {
                                        var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                            expiresIn: 100000
                                        });
                                        result.Code = statusCodes.successCodes[0].Code;
                                        result.Message = statusCodes.successCodes[0].Message;
                                        var response = rows;
                                        for (var i = 0; i < response.length; i++) {
                                            response[i].Token = token;
                                        }
                                        result.Data = response;
                                        res.send(result);
                                    } else {
                                        res.send(err2);
                                    }
                                });
                            } else {
                                result.Code = statusCodes.errorCodes[9].Code;
                                result.Message = statusCodes.errorCodes[9].Message;
                                result.Data = null;
                                res.send(result);
                            }
                        }
                    } else {
                        if (req.body.PhoneNumber == 9591241474) {
                            var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                expiresIn: 100000
                            });
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            var response = rows;
                            for (var i = 0; i < response.length; i++) {
                                response[i].Token = token;
                            }
                            result.Data = response;
                            res.send(result);
                        } else {
                            if (process.env.STUDENT_APP_VERSION == req.body.AppVersion) {
                                var queries = [];
                                for (var i = 0; i < rows.length; i++) {
                                    var query = 'UPDATE Student SET DeviceId = "' + req.body.DeviceId + '" WHERE Id = ' + rows[i].Id;
                                    queries.push(query);
                                }
                                database.connectionString.query(queries.join("; "), function(err2, rows2) {
                                    if (!err2) {
                                        var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                            expiresIn: 100000
                                        });
                                        result.Code = statusCodes.successCodes[0].Code;
                                        result.Message = statusCodes.successCodes[0].Message;
                                        var response = rows;
                                        for (var i = 0; i < response.length; i++) {
                                            response[i].Token = token;
                                        }
                                        result.Data = response;
                                        res.send(result);
                                    } else {
                                        res.send(err2);
                                    }
                                });
                            } else {
                                result.Code = statusCodes.errorCodes[9].Code;
                                result.Message = statusCodes.errorCodes[9].Message;
                                result.Data = null;
                                res.send(result);
                            }
                        }
                    }
                }
            } else {
                res.send(err);
            }
        });
    },
    parentLogin: function(req, res) {
        //login logic
        var result = {};
        var queryString = 'SELECT Student.Id, Student.Name, Student.PhoneNumber, Student.Password, Student.IdCardImageURL,Student.RollNumber, Student.FindInboxId, Student.CollegeId, Student.CourseId, Student.BranchId, Student.SemesterId, Student.ClassId, Student.Status, Student.RouteId, Student.StudentType, Student.TrialStartDate, College.PackageCode, College.LogoImageURL, College.BankAccountInfo, College.SMSBroadcastAvailable, College.Type, College.PhoneNumber AS CollegePhoneNumber, College.ShareImageURL, College.CreatedAt, College.IsB2C, College.TrialPeriodDays, Admission.FatherPhoneNumber, Admission.MotherPhoneNumber, Admission.DateOfBirth, Admission.Id AS AdmissionId, Class.MeetingURL, Class.MeetingCredentials FROM Student INNER JOIN College ON Student.CollegeId = College.Id INNER JOIN Admission ON Student.AdmissionId = Admission.Id LEFT JOIN Class ON Student.ClassId = Class.Id WHERE (Admission.FatherPhoneNumber = "' + req.body.PhoneNumber + '" OR Admission.MotherPhoneNumber = "' + req.body.PhoneNumber + '") AND Admission.DateOfBirth = "' + req.body.DateOfBirth + '" AND Student.Status <> 1';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[10].Code;
                    result.Message = statusCodes.errorCodes[10].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    if (req.body.OperatingSystem == 'android') {
                        //if (process.env.AND_STUDENT_APP_VERSION == req.body.AppVersion) {
                        var queries = [];
                        for (var i = 0; i < rows.length; i++) {
                            var query = 'UPDATE Admission SET FatherDeviceId = "' + req.body.DeviceId + '", MotherDeviceId = "' + req.body.DeviceId + '" WHERE Id = ' + rows[i].AdmissionId;
                            queries.push(query);
                        }
                        database.connectionString.query(queries.join("; "), function(err2, rows2) {
                            if (!err2) {
                                var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                    expiresIn: 100000
                                });
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                var response = rows;
                                for (var i = 0; i < response.length; i++) {
                                    response[i].Token = token;
                                }
                                result.Data = response;
                                res.send(result);
                            } else {
                                res.send(err2);
                            }
                        });
                        // } else {
                        //     result.Code = statusCodes.errorCodes[9].Code;
                        //     result.Message = statusCodes.errorCodes[9].Message;
                        //     result.Data = null;
                        //     res.send(result);
                        // }
                    } else {
                        if (req.body.PhoneNumber == 9591241474) {
                            var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                expiresIn: 100000
                            });
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            var response = rows;
                            for (var i = 0; i < response.length; i++) {
                                response[i].Token = token;
                            }
                            result.Data = response;
                            res.send(result);
                        } else {
                            //if (process.env.STUDENT_APP_VERSION == req.body.AppVersion) {
                            var queries = [];
                            for (var i = 0; i < rows.length; i++) {
                                var query = 'UPDATE Admission SET FatherDeviceId = "' + req.body.DeviceId + '", MotherDeviceId = "' + req.body.DeviceId + '" WHERE Id = ' + rows[i].AdmissionId;
                                queries.push(query);
                            }
                            database.connectionString.query(queries.join("; "), function(err2, rows2) {
                                if (!err2) {
                                    var token = jwt.sign(req.body, process.env.SECRET_KEY, {
                                        expiresIn: 100000
                                    });
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    var response = rows;
                                    for (var i = 0; i < response.length; i++) {
                                        response[i].Token = token;
                                    }
                                    result.Data = response;
                                    res.send(result);
                                } else {
                                    res.send(err2);
                                }
                            });
                            // } else {
                            //     result.Code = statusCodes.errorCodes[9].Code;
                            //     result.Message = statusCodes.errorCodes[9].Message;
                            //     result.Data = null;
                            //     res.send(result);
                            // }
                        }
                    }
                }
            } else {
                res.send(err);
            }
        });
    },
    checkRegistrationStatus: function(req, res) {
        var result = {};
        var queryString = 'SELECT Id, Name, FindInboxId, Status, PhoneNumber FROM Student WHERE FindInboxId = "' + req.params.FindInboxId + '"';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[5].Code;
                    result.Message = statusCodes.errorCodes[5].Message;
                    result.Data = null;
                } else {
                    if (rows[0].Status == 2) {
                        result.Code = statusCodes.errorCodes[6].Code;
                        result.Message = statusCodes.errorCodes[6].Message;
                        result.Data = null;
                    } else if (rows[0].Status == 3) {
                        result.Code = statusCodes.errorCodes[7].Code;
                        result.Message = statusCodes.errorCodes[7].Message;
                        result.Data = null;
                    } else {
                        result.Code = statusCodes.successCodes[0].Code;
                        result.Message = statusCodes.successCodes[0].Message;
                        result.Data = rows;
                    }
                }
                res.send(result);
            } else {
                res.send(err);
            }
        });
    },
    registerStudent: function(req, res) {
        var result = {};
        var result = {};
        if (req.body.Name == "" || req.body.CollegeId == "" || req.body.CourseId == "" || req.body.BranchId == "" || req.body.SemesterId == "") {
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
                TotalFees: 0,
                Remarks: null,
                BloodGroup: req.body.BloodGroup,
                MotherTongue: req.body.MotherTongue,
                SocialCategory: req.body.SocialCategory,
                Nationality: req.body.Nationality,
                Religion: req.body.Religion,
                Caste: req.body.Caste,
                SubCaste: req.body.SubCaste,
                CasteCertificateNumber: req.body.CasteCertificateNumber,
                PreviousSchoolName: req.body.PreviousSchoolName,
                PreviousClass: req.body.PreviousClass,
                PreviousMediumOfInstruction: req.body.PreviousMediumOfInstruction,
                TransferCertificateNumber: req.body.TransferCertificateNumber,
                SATSNumber: req.body.SATSNumber,
                ApplicationFormNumber: req.body.ApplicationFormNumber
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
                        Status: 1
                    };
                    var queryString2 = 'INSERT INTO Student SET ?';
                    database.connectionString.query(queryString2, studentTableValues, function(err2, rows2) {
                        if (!err2) {
                            var queryString3 = 'DELETE FROM Enquiry WHERE Id = ' + req.body.EnquiryId;
                            database.connectionString.query(queryString3, function(err3, rows3) {
                                if (!err3) {
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = rows2;
                                    res.send(result);
                                } else {
                                    res.send(err3)
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
        }
    },
    getDeactivatedStudents: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Student WHERE Status = 1 AND CollegeId = ' + req.params.CollegeId + ' AND CourseId = ' + req.params.CourseId + ' AND BranchId = ' + req.params.BranchId + ' AND SemesterId = ' + req.params.SemesterId + ' AND ClassId = ' + req.params.ClassId;
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
    approveStudent: function(req, res) {
        var result = {};
        var queryString = 'UPDATE Student SET Status = 0 WHERE Id = ' + req.body.Id;
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
    rejectStudent: function(req, res) {
        var result = {};
        var queryString = 'UPDATE Student SET Status = 1 WHERE Id = ' + req.body.Id;
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
    getShortURL: function(req, res) {
        var result = {};
        TinyURL.shorten(req.body.LongURL, function(shortURL) {
            result.Code = statusCodes.successCodes[0].Code;
            result.Message = statusCodes.successCodes[0].Message;
            result.Data = shortURL;
            res.send(result);
        });
    },
    verifyUniqueId: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Enquiry WHERE UniqueId = "' + req.body.UniqueId + '"';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var queryString2 = 'SELECT Id FROM Class WHERE CollegeId = ' + rows[0].CollegeId + ' AND CourseId = ' + rows[0].CourseId + ' AND BranchId = ' + rows[0].BranchId + ' AND SemesterId = ' + rows[0].SemesterId;
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            rows[0].ClassId = rows2[0].Id;
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
    getUniqueId: function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },
    getStudentForApplicationVerification: function(req, res) {
        var result = {};
        if (req.params.StudentId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT Student.Id, Student.Name, Student.RollNumber, Student.CourseId, Student.BranchId, Student.SemesterId, Student.ClassId, Student.PhoneNumber, Student.FindInboxId, Student.StudentType, Student.IsRTE, Admission.Id as AdmissionId, Admission.GenderId, Admission.DateOfBirth, Admission.FatherName, Admission.FatherOccupation, Admission.MotherName, Admission.MotherOccupation, Admission.FatherPhoneNumber,  Admission.MotherPhoneNumber, Admission.Email, Admission.Address, Admission.BloodGroup, Admission.AadhaarNumber, Admission.ProfileImageURL, Admission.FatherImageURL, Admission.MotherImageURL, Admission.MotherTongue, Admission.SocialCategory, Admission.Nationality, Admission.Religion, Admission.Caste, Admission.SubCaste, Admission.CasteCertificateNumber, Admission.PreviousSchoolName, Admission.PreviousClass, Admission.PreviousMediumOfInstruction, Admission.TransferCertificateNumber, Admission.SATSNumber, Admission.ApplicationFormNumber FROM Student INNER JOIN Admission ON Admission.Id = Student.AdmissionId WHERE Student.Id = ' + req.params.StudentId;
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    if (rows.length == 0) {
                        result.Code = statusCodes.errorCodes[0].Code;
                        result.Message = statusCodes.errorCodes[0].Message;
                        result.Data = null;
                        res.send(result);
                        return;
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
};