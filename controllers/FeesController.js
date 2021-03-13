'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getFeesStructure: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from FeesStructure WHERE CollegeId = ' + req.params.CollegeId + ' AND BranchId = ' + req.params.BranchId + ' AND AcademicYear = "' + req.params.AcademicYear + '"';
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
    getFeesComponentNames: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from CollegeHasFeesKeywords WHERE CollegeId = ' + req.params.CollegeId;
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
    setFeesStructure: function(req, res) {
        var result = {};
        var queryString = 'INSERT INTO FeesStructure SET ?';
        database.connectionString.query(queryString, req.body, function(err, rows) {
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
    updateFeesStructure: function(req, res) {
        var result = {};
        var queryString = 'UPDATE FeesStructure SET ? WHERE Id = ' + req.body.Id;
        database.connectionString.query(queryString, req.body, function(err, rows) {
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
    getTransportFee: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM TransportFees WHERE CollegeId = ' + req.params.CollegeId;
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
    getRegularFeesForStudent: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM FeesCollection WHERE StudentId = ' + req.params.StudentId + ' AND AcademicYear = "' + req.params.AcademicYear + '"';
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
    getDevelopmentFeesForStudent: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Type4FeesCollection WHERE StudentId = ' + req.params.StudentId + ' AND AcademicYear = "' + req.params.AcademicYear + '"';
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
    setTransportFee: function(req, res) {
        var result = {};
        var queryString = 'INSERT INTO TransportFees SET ?';
        database.connectionString.query(queryString, req.body, function(err, rows) {
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
    updateTransportFee: function(req, res) {
        var result = {};
        var queryString = 'UPDATE TransportFees SET ? WHERE Id = ' + req.body.Id;
        database.connectionString.query(queryString, req.body, function(err, rows) {
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
    deleteTransportFee: function(req, res) {
        var result = {};
        var queryString = 'DELETE FROM TransportFees WHERE Id = ' + req.body.Id;
        database.connectionString.query(queryString, req.body, function(err, rows) {
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
    saveRegularFees: function(req, res) {
        var result = {};
        var queries = [];
        for (var i = 0; i < req.body.length; i++) {
            var query = 'INSERT INTO FeesCollection(StudentId, AcademicYear, Month, Type1Fees, Type1Status, Type2Fees, Type1ReceiptNumber, Type1PaymentDate, Type1PaymentMode, Type1Note) VALUES(' + req.body[i].StudentId + ',"' + req.body[i].AcademicYear + '","' + req.body[i].Month + '",' + req.body[i].Type1Fees + ',' + req.body[i].Type1Status + ',' + req.body[i].Type2Fees + ',"' + req.body[i].ReceiptNumber + '","' + req.body[i].PaymentDate + '","' + req.body[i].PaymentMode + '","' + req.body[i].Note + '") ON DUPLICATE KEY UPDATE Type1Fees = VALUES(Type1Fees), Type1Status = VALUES(Type1Status), Type2Fees = VALUES(Type2Fees), Type1ReceiptNumber = VALUES(Type1ReceiptNumber), Type1PaymentDate = VALUES(Type1PaymentDate), Type1PaymentMode = VALUES(Type1PaymentMode), Type1Note = VALUES(Type1Note)';
            query = query.split('"null"').join('null');
            queries.push(query);
        }
        database.connectionString.query(queries.join("; "), function(err, rows) {
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
    saveDevelopmentFees: function(req, res) {
        var result = {};
        var queryString = 'INSERT INTO Type4FeesCollection(StudentId, AcademicYear, Type4Fees, Discount, AddOnFees, Type4ReceiptNumber, Type4PaymentDate, Type4PaymentMode, Type4Note) VALUES(' + req.body.StudentId + ',"' + req.body.AcademicYear + '",' + req.body.Type4Fees + ', ' + req.body.Discount + ',' + req.body.AddOnFees + ',"' + req.body.ReceiptNumber + '","' + req.body.PaymentDate + '","' + req.body.PaymentMode + '","' + req.body.Note + '") ON DUPLICATE KEY UPDATE Type4Fees = VALUES(Type4Fees), Type4ReceiptNumber = VALUES(Type4ReceiptNumber), Type4PaymentDate = VALUES(Type4PaymentDate), Type4PaymentMode = VALUES(Type4PaymentMode), Type4Note = VALUES(Type4Note)';
        queryString = queryString.split('"null"').join('null');
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
    saveTransportFees: function(req, res) {
        var result = {};
        var queries = [];
        for (var i = 0; i < req.body.length; i++) {
            var query = 'INSERT INTO FeesCollection(StudentId, AcademicYear, Month, Type3Fees, Type3Status, Type3ReceiptNumber, Type3PaymentDate, Type3PaymentMode, Type3Note) VALUES(' + req.body[i].StudentId + ',"' + req.body[i].AcademicYear + '","' + req.body[i].Month + '",' + req.body[i].Type3Fees + ',' + req.body[i].Type3Status + ',"' + req.body[i].ReceiptNumber + '","' + req.body[i].PaymentDate + '","' + req.body[i].PaymentMode + '","' + req.body[i].Note + '") ON DUPLICATE KEY UPDATE Type3Fees = VALUES(Type3Fees), Type3Status = VALUES(Type3Status), Type3ReceiptNumber = VALUES(Type3ReceiptNumber), Type3PaymentDate = VALUES(Type3PaymentDate), Type3PaymentMode = VALUES(Type3PaymentMode), Type3Note = VALUES(Type3Note)';
            query = query.split('"null"').join('null');
            queries.push(query);
        }
        database.connectionString.query(queries.join("; "), function(err, rows) {
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
    getAllFeesKeywords: function(req, res) {
        var result = {};

        var query = 'SELECT * FROM CollegeHasFeesKeywords WHERE CollegeId = ' + req.params.CollegeId;
        database.connectionString.query(query, function(err, rows) {
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
    updateFeesKeyword: function(req, res) {
        var result = {};

        var query = 'UPDATE CollegeHasFeesKeywords SET OtherComponent1 = "' + req.body.OtherComponent1 + '", OtherComponent2 = "' + req.body.OtherComponent2 + '", RegularComponent1 = "' + req.body.RegularComponent1 + '", RegularComponent2 = "' + req.body.RegularComponent2 + '", RegularComponent3 = "' + req.body.RegularComponent3 + '", RegularComponent4 = "' + req.body.RegularComponent4 + '", RegularComponent5 = "' + req.body.RegularComponent5 + '", RegularComponent6 = "' + req.body.RegularComponent6 + '", RegularComponent7 = "' + req.body.RegularComponent7 + '", RegularComponent8 = "' + req.body.RegularComponent8 + '", RegularComponent9 = "' + req.body.RegularComponent9 + '", RegularComponent10 = "' + req.body.RegularComponent10 + '", RegularComponent11 = "' + req.body.RegularComponent11 + '" WHERE Id = ' + req.body.Id;
        database.connectionString.query(query, function(err, rows) {
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
}