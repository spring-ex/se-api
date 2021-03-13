'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');
var moment = require('moment');
var notificationCodesController = require('./NotificationCodesController.js');
var asyncLoop = require('node-async-loop');
var FCM = require('fcm-push');
var serverKey = 'AAAAdvkI0U4:APA91bG7diSbxUWg-WFkyKrWTorqy_kPnhfo1dmzk0wznMNKjRVTg3y5CFCBwlcxW6U1D3tGPJhB17gjsHynke4ZaP5b2Xr99WTwVXY_jNooBhNHb4ImcZ90ejNH6sU36AJQ79eGQ4Nu';
var fcm = new FCM(serverKey);

module.exports = {
    getAllBooks: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from Book WHERE CollegeId = ' + req.params.CollegeId;
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
    getAllAvailableBooks: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Book WHERE NOT EXISTS (SELECT * FROM StudentBorrowsBook WHERE Book.Id = StudentBorrowsBook.BookId AND StudentBorrowsBook.HasReturned = false) AND Book.CollegeId = ' + req.params.CollegeId + ' ORDER BY Name';
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
    getBorrowedBooks: function(req, res) {
        var result = {};
        var queryString = 'SELECT b.Name, sbb.*, s.Name as StudentName, s.RollNumber, s.DeviceId FROM StudentBorrowsBook sbb INNER JOIN Book b ON sbb.BookId = b.Id AND sbb.HasReturned = false INNER JOIN Student s ON s.Id = sbb.StudentId WHERE b.CollegeId = ' + req.params.CollegeId + ' ORDER BY b.Name';
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
    getAllBooksToBeReturned: function(req, res) {
        var result = {};
        var queryString = 'SELECT b.*, sbb.StudentId FROM Book b LEFT JOIN StudentBorrowsBook sbb ON b.Id = sbb.BookId WHERE b.CollegeId = ' + req.params.CollegeId;
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
    getAllBooksByStudent: function(req, res) {
        var result = {};
        var queryString = 'SELECT b.*, sbb.StudentId, sbb.ReturnDate FROM Book b LEFT JOIN StudentBorrowsBook sbb ON b.Id = sbb.BookId AND sbb.HasReturned <> 1 WHERE sbb.StudentId = ' + req.params.StudentId;
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
    getAllBooksHistory: function(req, res) {
        var result = {};
        var queryString = 'SELECT s.Id AS StudentId, s.Name AS StudentName, sbb.BorrowDate, sbb.ReturnDate, sbb.ReturnedDate, sbb.HasReturned, b.Id AS BookId, b.Name AS BookName FROM Student s INNER JOIN StudentBorrowsBook sbb ON s.Id = sbb.StudentId AND sbb.HasReturned <> 0 INNER JOIN Book b ON sbb.BookId = b.Id WHERE s.CollegeId = ' + req.params.CollegeId + ' ORDER BY sbb.ReturnedDate;';
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
    addBook: function(req, res) {
        var result = {};
        if (req.body.Name == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO Book SET ?';
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
    updateBook: function(req, res) {
        var result = {};
        if (req.body.Name == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Book SET ? WHERE Id = ' + req.body.Id;
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
    bookBulkUpload: function(req, res) {
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
                var queryString = 'INSERT INTO Book SET ?';
                database.connectionString.query(queryString, item, function(err, rows) {
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
    bookBorrow: function(req, res) {
        var result = {};
        if (req.body.StudentId == "" || req.body.BookId == "" || req.body.BorrowDate == "" || req.body.ReturnDate == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO StudentBorrowsBook (StudentId, BookId, BorrowDate, ReturnDate, HasReturned, ReturnedDate) VALUES (' + req.body.StudentId + ',' + req.body.BookId + ',"' + req.body.BorrowDate + '","' + req.body.ReturnDate + '", false, null)';
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    var title = 'You have borrowed a book!';
                    var description = 'You have borrowed ' + req.body.BookName + '. The return date of the book is ' + moment(req.body.ReturnDate).format("DD/MM/YYYY") + '.';
                    var message = {
                        registration_ids: [req.body.DeviceId],
                        notification: {
                            title: title,
                            body: description,
                            sound: "default",
                            color: "#387ef5",
                            icon: "fcm_push_icon",
                            click_action: "FCM_PLUGIN_ACTIVITY"
                        },
                        data: { //you can send only notification or only data(or include both)
                            notCode: notificationCodesController.notCodes[7],
                            Id: null,
                            Name: title,
                            Description: description,
                            VideoURL: null,
                            CreatedAt: moment().format('YYYY-MM-DD')
                        },
                        priority: "high"
                    };
                    fcm.send(message, function(error, response) {
                        if (error) {
                            console.log(error);
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = rows;
                            res.send(result);
                        } else {
                            var queryString = 'INSERT INTO Notification(Id, Title, Description, NotificationCode) VALUES (null, "' + title + '", "' + description + '", "' + notificationCodesController.notCodes[7] + '")';
                            database.connectionString.query(queryString, function(err4, rows4) {
                                if (!err4) {
                                    var queryString = 'INSERT INTO NotificationLedger(Id, NotificationId, StudentId, UserId, ArticleId) VALUES (null, ' + rows4.insertId + ', ' + req.body.StudentId + ', null, null)';
                                    database.connectionString.query(queryString, function(err5, rows5) {
                                        if (!err5) {
                                            result.Code = statusCodes.successCodes[0].Code;
                                            result.Message = statusCodes.successCodes[0].Message;
                                            result.Data = rows;
                                            res.send(result);
                                        } else {
                                            res.send(err5);
                                        }
                                    });
                                } else {
                                    res.send(err4);
                                }
                            });
                        }
                    });
                } else {
                    res.send(err);
                }
            });
        }
    },
    returnBook: function(req, res) {
        var result = {};
        if (req.body.StudentId == "" || req.body.BookId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE StudentBorrowsBook SET HasReturned = true, ReturnedDate = "' + moment().format("YYYY-MM-DD HH:mm:ss") + '" WHERE StudentId = ' + req.body.StudentId + ' AND BookId = ' + req.body.BookId + ' AND BorrowDate = "' + moment(req.body.BorrowDate).format("YYYY-MM-DD HH:mm:ss") + '"';
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
    deleteBook: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Book WHERE Id = ' + req.body.Id;
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
}