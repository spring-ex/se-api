'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');
var asyncLoop = require('node-async-loop');

module.exports = {
    getUsersByCollege: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from User WHERE IsActive = "true" AND CollegeId = "' + req.params.CollegeId + '"';
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
    getUserById: function(req, res) {
        var result = {};
        var response;
        var queryString = 'SELECT * FROM User WHERE Id = "' + req.params.UserId + '"';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                    return;
                } else {
                    var queryString2 = 'SELECT * FROM UserEducation WHERE UserId = "' + req.params.UserId + '"';
                    response = rows[0];
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            if (rows2.length == 0) {
                                response.UserEducation = [];
                            } else {
                                response.UserEducation = rows2;
                            }
                            var queryString3 = 'SELECT * FROM UserExperience WHERE UserId = "' + req.params.UserId + '"';
                            database.connectionString.query(queryString3, function(err3, rows3) {
                                if (!err3) {
                                    if (rows3.length == 0) {
                                        response.UserExperience = [];
                                    } else {
                                        response.UserExperience = rows3;
                                    }
                                    var queryString4 = 'SELECT Subject.Name as Name, Course.Name as CourseName, Branch.Name as BranchName, Semester.SemesterNumber as SemesterName, Class.Name as ClassName, UserSubject.Id as UserSubjectId, UserSubject.CourseId, UserSubject.BranchId, UserSubject.SemesterId, UserSubject.ClassId, UserSubject.SubjectId as Id FROM Subject,Course,Branch,Semester,Class INNER JOIN UserSubject WHERE Subject.Id = UserSubject.SubjectId AND Course.Id = UserSubject.CourseId AND Branch.Id = UserSubject.BranchId AND Semester.Id = UserSubject.SemesterId AND Class.Id = UserSubject.ClassId AND UserSubject.UserId = "' + req.params.UserId + '"';
                                    database.connectionString.query(queryString4, function(err4, rows4) {
                                        if (!err4) {
                                            if (rows4.length == 0) {
                                                response.Subjects = [];
                                            } else {
                                                response.Subjects = rows4;
                                            }
                                            var queryString5 = 'SELECT ss.*, se.SemesterNumber as SemesterNumber, sc.Id AS SpecialClassId, sc.Name AS ClassName FROM UserTakesSpecialSubject utss INNER JOIN SpecialSubject ss ON utss.SpecialSubjectId = ss.Id INNER JOIN SpecialClass sc ON utss.SpecialClassId = sc.Id INNER JOIN Semester se ON ss.SemesterId = se.Id WHERE utss.UserId = ' + req.params.UserId;
                                            database.connectionString.query(queryString5, function(err5, rows5) {
                                                if (!err5) {
                                                    if (rows5.length == 0) {
                                                        response.SpecialSubjects = [];
                                                    } else {
                                                        response.SpecialSubjects = rows5;
                                                    }
                                                    result.Code = statusCodes.successCodes[0].Code;
                                                    result.Message = statusCodes.successCodes[0].Message;
                                                    result.Data = response;
                                                    res.send(result);
                                                } else {
                                                    res.send(err5);
                                                }
                                            });
                                        } else {
                                            res.send(err4);
                                        }
                                    });
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
    addUser: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Role == "" || req.body.Username == "" || req.body.Password == "" || req.body.CollegeId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO User SET ?';
            var obj = {
                Id: null,
                Name: req.body.Name,
                DateOfBirth: req.body.DateOfBirth ? req.body.DateOfBirth : null,
                Email: req.body.Email ? req.body.Email : null,
                PhoneNumber: req.body.PhoneNumber ? req.body.PhoneNumber : null,
                Address: req.body.Address ? req.body.Address : null,
                City: req.body.City ? req.body.City : null,
                State: req.body.State ? req.body.State : null,
                Designation: req.body.Designation ? req.body.Designation : null,
                ProfileImageURL: req.body.ProfileImageURL ? req.body.ProfileImageURL : null,
                Role: req.body.Role,
                Username: req.body.Username,
                Password: req.body.Password,
                CollegeId: req.body.CollegeId
            };
            database.connectionString.query(queryString, obj, function(err, rows) {
                if (!err) {
                    if (req.body.UserEducation.length != 0) {
                        var queries = [];
                        for (var i = 0; i < req.body.UserEducation.length; i++) {
                            var query = 'INSERT INTO UserEducation(Id, University, Degree, YearOfPassing, UserId) VALUES (null, "' + req.body.UserEducation[i].University + '","' + req.body.UserEducation[i].Degree + '","' + req.body.UserEducation[i].YearOfPassing + '","' + rows.insertId + '")';
                            queries.push(query);
                        }
                        database.connectionString.query(queries.join("; "), function(err2, rows2) {
                            if (!err2) {
                                var queries = [];
                                if (req.body.SpecialSubjects.length != 0) {
                                    for (var i = 0; i < req.body.SpecialSubjects.length; i++) {
                                        var query = 'INSERT INTO UserTakesSpecialSubject(UserId, SpecialSubjectId) VALUES (' + rows.insertId + ', ' + req.body.SpecialSubjects[i].Id + ')';
                                        queries.push(query);
                                    }
                                }
                                if (req.body.Subjects.length != 0) {
                                    for (var i = 0; i < req.body.Subjects.length; i++) {
                                        var query = 'INSERT INTO UserSubject(Id, UserId, CourseId, BranchId, SemesterId, ClassId, SubjectId) VALUES (null, ' + rows.insertId + ', ' + req.body.Subjects[i].CourseId + ',' + req.body.Subjects[i].BranchId + ',' + req.body.Subjects[i].SemesterId + ',' + req.body.Subjects[i].ClassId + ', ' + req.body.Subjects[i].Id + ')';
                                        queries.push(query);
                                    }
                                    database.connectionString.query(queries.join("; "), function(err3, rows3) {
                                        if (!err3) {
                                            if (req.body.UserExperience.length != 0) {
                                                var queries = [];
                                                for (var i = 0; i < req.body.UserExperience.length; i++) {
                                                    var query = 'INSERT INTO UserExperience(Id, CollegeName, Designation, FromDate, ToDate, UserId) VALUES (null, "' + req.body.UserExperience[i].CollegeName + '","' + req.body.UserExperience[i].Designation + '","' + req.body.UserExperience[i].FromDate + '","' + req.body.UserExperience[i].ToDate + '","' + rows.insertId + '")';
                                                    queries.push(query);
                                                }
                                                database.connectionString.query(queries.join(", "), function(err4, rows4) {
                                                    if (!err4) {
                                                        result.Code = statusCodes.successCodes[0].Code;
                                                        result.Message = statusCodes.successCodes[0].Message;
                                                        result.Data = rows3;
                                                        res.send(result);
                                                    } else {
                                                        res.send(err4);
                                                    }
                                                });
                                            } else {
                                                result.Code = statusCodes.successCodes[0].Code;
                                                result.Message = statusCodes.successCodes[0].Message;
                                                result.Data = rows3;
                                                res.send(result);
                                            }
                                        } else {
                                            res.send(err3);
                                        }
                                    })
                                } else {
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = rows2;
                                    res.send(result);
                                }
                            } else {
                                res.send(err2);
                            }
                        })
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
    bulkAddUserWithoutToken: function(req, res) {
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
                var queryString = 'INSERT INTO User SET ?';
                var obj = {
                    Id: null,
                    Name: item.Name,
                    GenderId: item.GenderId,
                    DateOfBirth: item.DateOfBirth,
                    Email: item.Email,
                    PhoneNumber: item.PhoneNumber,
                    Address: '',
                    City: '',
                    State: '',
                    Designation: '',
                    ProfileImageURL: null,
                    Role: "FACULTY",
                    Username: item.PhoneNumber,
                    Password: item.PhoneNumber,
                    CollegeId: 40 //for teacherinme
                };
                database.connectionString.query(queryString, obj, function(err, rows) {
                    if (!err) {
                        count++;
                        if (count == req.body.length) {
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = rows;
                            res.send(result);
                        } else {
                            next();
                        }
                    } else {
                        res.send(err);
                    }
                });
            });
        }
    },
    updateUser: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Role == "" || req.body.Username == "" || req.body.Password == "" || req.body.CollegeId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var userEducation = req.body.UserEducation;
            var userExperience = req.body.UserExperience;
            var subjects = req.body.Subjects;
            var specialSubjects = req.body.SpecialSubjects;
            delete req.body.UserEducation;
            delete req.body.UserExperience;
            delete req.body.Subjects;
            delete req.body.SpecialSubjects;
            var queryString = 'UPDATE User SET ? WHERE Id = ' + req.body.Id;
            database.connectionString.query(queryString, req.body, function(err, rows) {
                if (!err) {
                    var queryString2 = 'DELETE FROM UserEducation WHERE UserId = ' + req.body.Id;
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            var queryString3 = 'DELETE FROM UserExperience WHERE UserId = ' + req.body.Id;
                            database.connectionString.query(queryString3, function(err3, rows3) {
                                if (!err3) {
                                    var queryString4 = 'DELETE FROM UserSubject WHERE UserId = ' + req.body.Id;
                                    var query = 'DELETE FROM UserTakesSpecialSubject WHERE UserId = ' + req.body.Id;
                                    var queries = [];
                                    queries.push(queryString4);
                                    queries.push(query);
                                    database.connectionString.query(queries.join("; "), function(err4, rows4) {
                                        if (!err4) {
                                            if (userEducation.length != 0) {
                                                var queries = [];
                                                for (var i = 0; i < userEducation.length; i++) {
                                                    var query = 'INSERT INTO UserEducation(Id, University, Degree, YearOfPassing, UserId) VALUES (null, "' + userEducation[i].University + '","' + userEducation[i].Degree + '","' + userEducation[i].YearOfPassing + '","' + req.body.Id + '")';
                                                    queries.push(query);
                                                }
                                                database.connectionString.query(queries.join("; "), function(err5, rows5) {
                                                    if (!err5) {
                                                        var queries = [];
                                                        if (specialSubjects.length != 0) {
                                                            for (var i = 0; i < specialSubjects.length; i++) {
                                                                var query = 'INSERT INTO UserTakesSpecialSubject(UserId, SpecialSubjectId) VALUES ("' + req.body.Id + '","' + specialSubjects[i].Id + '")';
                                                                queries.push(query);
                                                            }
                                                        }
                                                        if (subjects.length != 0) {
                                                            for (var i = 0; i < subjects.length; i++) {
                                                                var query = 'INSERT INTO UserSubject(Id, UserId, CourseId, BranchId, SemesterId, ClassId, SubjectId) VALUES (null, "' + req.body.Id + '","' + subjects[i].CourseId + '","' + subjects[i].BranchId + '","' + subjects[i].SemesterId + '","' + subjects[i].ClassId + '","' + subjects[i].Id + '")';
                                                                queries.push(query);
                                                            }
                                                            database.connectionString.query(queries.join("; "), function(err6, rows6) {
                                                                if (!err6) {
                                                                    if (userExperience.length != 0) {
                                                                        var queries = [];
                                                                        for (var i = 0; i < userExperience.length; i++) {
                                                                            var query = 'INSERT INTO UserExperience(Id, CollegeName, Designation, FromDate, ToDate, UserId) VALUES (null, "' + userExperience[i].CollegeName + '","' + userExperience[i].Designation + '","' + userExperience[i].FromDate + '","' + userExperience[i].ToDate + '","' + req.body.Id + '")';
                                                                            queries.push(query);
                                                                        }
                                                                        database.connectionString.query(queries.join("; "), function(err7, rows7) {
                                                                            if (!err7) {
                                                                                result.Code = statusCodes.successCodes[0].Code;
                                                                                result.Message = statusCodes.successCodes[0].Message;
                                                                                result.Data = rows7;
                                                                                res.send(result);
                                                                            } else {
                                                                                res.send(err7);
                                                                            }
                                                                        });
                                                                    } else {
                                                                        result.Code = statusCodes.successCodes[0].Code;
                                                                        result.Message = statusCodes.successCodes[0].Message;
                                                                        result.Data = rows6;
                                                                        res.send(result);
                                                                    }
                                                                } else {
                                                                    res.send(err6);
                                                                }
                                                            })
                                                        } else {
                                                            result.Code = statusCodes.successCodes[0].Code;
                                                            result.Message = statusCodes.successCodes[0].Message;
                                                            result.Data = rows5;
                                                            res.send(result);
                                                        }
                                                    } else {
                                                        res.send(err5);
                                                    }
                                                })
                                            } else {
                                                result.Code = statusCodes.successCodes[0].Code;
                                                result.Message = statusCodes.successCodes[0].Message;
                                                result.Data = rows;
                                                res.send(result);
                                            }
                                        } else {
                                            res.send(err4);
                                        }
                                    });
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
        }
    },
    updateUserNew: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Role == "" || req.body.Username == "" || req.body.Password == "" || req.body.CollegeId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var userEducation = req.body.UserEducation;
            var userExperience = req.body.UserExperience;
            var subjects = req.body.Subjects;
            var specialSubjects = req.body.SpecialSubjects;
            delete req.body.UserEducation;
            delete req.body.UserExperience;
            delete req.body.Subjects;
            delete req.body.SpecialSubjects;
            var queryString = 'UPDATE User SET ? WHERE Id = ' + req.body.Id;
            database.connectionString.query(queryString, req.body, function(err, rows) {
                if (!err) {
                    var deleteQueries = [];
                    var query2 = 'DELETE FROM UserEducation WHERE UserId = ' + req.body.Id;
                    deleteQueries.push(query2);
                    var query3 = 'DELETE FROM UserExperience WHERE UserId = ' + req.body.Id;
                    deleteQueries.push(query3);
                    var query4 = 'DELETE FROM UserSubject WHERE UserId = ' + req.body.Id;
                    deleteQueries.push(query4);
                    var query5 = 'DELETE FROM UserTakesSpecialSubject WHERE UserId = ' + req.body.Id;
                    deleteQueries.push(query5);
                    database.connectionString.query(deleteQueries.join("; "), function(err2, rows2) {
                        if (!err2) {
                            var createQueries = [];
                            if (userEducation.length != 0) {
                                for (var i = 0; i < userEducation.length; i++) {
                                    var query = 'INSERT INTO UserEducation(Id, University, Degree, YearOfPassing, UserId) VALUES (null, "' + userEducation[i].University + '","' + userEducation[i].Degree + '","' + userEducation[i].YearOfPassing + '","' + req.body.Id + '")';
                                    createQueries.push(query);
                                }
                            }
                            if (subjects.length != 0) {
                                for (var i = 0; i < subjects.length; i++) {
                                    var query = 'INSERT INTO UserSubject(Id, UserId, CourseId, BranchId, SemesterId, ClassId, SubjectId) VALUES (null, "' + req.body.Id + '","' + subjects[i].CourseId + '","' + subjects[i].BranchId + '","' + subjects[i].SemesterId + '","' + subjects[i].ClassId + '","' + subjects[i].Id + '")';
                                    createQueries.push(query);
                                }
                            }
                            if (specialSubjects.length != 0) {
                                for (var i = 0; i < specialSubjects.length; i++) {
                                    var query = 'INSERT INTO UserTakesSpecialSubject(UserId, SpecialSubjectId) VALUES ("' + req.body.Id + '","' + specialSubjects[i].Id + '")';
                                    createQueries.push(query);
                                }
                            }
                            if (userExperience.length != 0) {
                                for (var i = 0; i < userExperience.length; i++) {
                                    var query = 'INSERT INTO UserExperience(Id, CollegeName, Designation, FromDate, ToDate, UserId) VALUES (null, "' + userExperience[i].CollegeName + '","' + userExperience[i].Designation + '","' + userExperience[i].FromDate + '","' + userExperience[i].ToDate + '","' + req.body.Id + '")';
                                    createQueries.push(query);
                                }
                            }
                            database.connectionString.query(createQueries.join("; "), function(err3, rows3) {
                                if (!err2) {
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = rows3;
                                    res.send(result);
                                } else {
                                    res.send(err2);
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
    deleteUser: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE User SET IsActive = "false" WHERE Id = ' + req.body.Id;
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
    resetUserPassword: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE User SET Password = PhoneNumber WHERE Id = ' + req.body.Id;
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
    //new set for new web ui
    updateUserProfile: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Role == "" || req.body.CollegeId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            delete req.body.UserEducation;
            delete req.body.UserExperience;
            delete req.body.Subjects;
            delete req.body.SpecialSubjects;
            var queryString = 'UPDATE User SET ? WHERE Id = ' + req.body.Id;
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
    addSubjects: function(req, res) {
        var result = {};
        if (req.body.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var deleteQuery = 'DELETE FROM UserSubject WHERE UserId = ' + req.body.UserId;
            database.connectionString.query(deleteQuery, function(err, rows) {
                if (!err) {
                    var queries = [];
                    for (var i = 0; i < req.body.Subjects.length; i++) {
                        var query = 'INSERT INTO UserSubject(Id, UserId, CourseId, BranchId, SemesterId, ClassId, SubjectId) VALUES (null, "' + req.body.UserId + '","' + req.body.Subjects[i].CourseId + '","' + req.body.Subjects[i].BranchId + '","' + req.body.Subjects[i].SemesterId + '","' + req.body.Subjects[i].ClassId + '","' + req.body.Subjects[i].Id + '")';
                        queries.push(query);
                    }
                    database.connectionString.query(queries.join(";"), function(err2, rows2) {
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
    removeSubject: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM UserSubject WHERE Id = ' + req.body.UserSubjectId;
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
    addSpecialSubjects: function(req, res) {
        var result = {};
        if (req.body.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var deleteQuery = 'DELETE FROM UserTakesSpecialSubject WHERE UserId = ' + req.body.UserId;
            database.connectionString.query(deleteQuery, function(err, rows) {
                if (!err) {
                    var queries = [];
                    for (var i = 0; i < req.body.SpecialSubjects.length; i++) {
                        var query = 'INSERT INTO UserTakesSpecialSubject(UserId, SpecialSubjectId, SpecialClassId) VALUES ("' + req.body.UserId + '","' + req.body.SpecialSubjects[i].Id + '", "' + req.body.SpecialSubjects[i].SpecialClassId + '")';
                        queries.push(query);
                    }
                    database.connectionString.query(queries.join(";"), function(err2, rows2) {
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
    removeSpecialSubject: function(req, res) {
        var result = {};
        if (req.body.UserId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM UserTakesSpecialSubject WHERE UserId = ' + req.body.UserId + ' AND SpecialSubjectId = ' + req.body.SpecialSubjectId + ' AND SpecialClassId = ' + req.body.SpecialClassId;
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
    addEducation: function(req, res) {
        var result = {};
        if (req.body.UserId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO UserEducation SET ?';
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
    removeEducation: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM UserEducation WHERE Id = ' + req.body.Id;
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
    addExperience: function(req, res) {
        var result = {};
        if (req.body.UserId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO UserExperience SET ?';
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
    removeExperience: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM UserExperience WHERE Id = ' + req.body.Id;
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
    }
}