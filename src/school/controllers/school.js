var express = require('express');
var router = express.Router();
var model = require('../models/school')
var logger = require('../../utils/logger');

module.exports = {
    getAllSchoolInfo: async function (req, res) {
        if (!req.body.request) {
            res.statusCode = 404
            res.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "request object is a required field in requestBody"
                    }
                }
            })
        }
        if (!req.body.request.filters) {
            res.statusCode = 404
            res.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "request.filter object is a required field in requestBody"
                    }
                }
            })
        }
        if (!req.body.request.filters.schoolId) {
            res.statusCode = 404
            res.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "request.filter.schoolId object is a required field in requestBody"
                    }
                }
            })
        }

        if (Array.isArray(req.body.request.filters.schoolId) == true) {
            if ((req.body.request.filters.schoolId).length == 0) {
                model.getAllSchoolInfo(function (err, data) {
                    if (err) throw err;
                    res.statusCode = 200;
                    if (res.statusCode == 200) {
                        responseCode = "OK"
                    }
                    resultdata = {
                        responseCode: responseCode,
                        result: {
                            response: {
                                count: data.length,
                                content: data
                            }
                        }
                    }
                    res.send(resultdata)
                })
            }
            else if ((req.body.request.filters.schoolId).length > 0) {
                querySchool = req.body.request.filters.schoolId
                var schoolInfo = new Array()
                for (var i = 0; i < querySchool.length; i++) {
                    if (isNaN(querySchool[i]) == false) {
                        try {
                            let data = await model.getSchoolInfoSpecific(querySchool[i]);
                            // console.log(data[0])
                            if (data[0] != undefined) {
                                schoolInfo.push(data[0])
                            }
                        }
                        catch (error) {
                            console.log(error)
                        }
                    }
                    else {
                        res.statusCode = 400
                        res.send({
                            responseCode: "CLIENT_ERROR",
                            result: {
                                response: {
                                    // message: "schoolId should not be string or no of digits is not equal to 7"
                                    message: "schoolId " + querySchool[i] + " should be a number"
                                }
                            }
                        })
                        return
                    }
                }
                res.statusCode = 200;
                if (res.statusCode == 200) {
                    responseCode = "OK"
                }
                resultdata = {
                    responseCode: responseCode,
                    result: {
                        response: {
                            count: schoolInfo.length,
                            content: schoolInfo
                        }
                    }
                }
                res.send(resultdata)
            }
        }
        else {
            res.statusCode = 400
            res.send({
                responseCode: "CLIENT_ERROR",
                result: {
                    response: {
                        message: "schoolId should be an array in requestBody"
                    }
                }
            })
        }
    },

    getSingleSchoolInfo: function (req, res) {
        externalId = req.params.id;
        idlen = externalId.length;
        // console.log(typeof (externalId))
        // if (isNaN(externalId) == false && idlen == 7) {
        if (isNaN(externalId) == false) {
            model.getSingleSchoolInfo(externalId, function (err, data) {
                if (err) throw err;
                res.statusCode = 200;
                if (res.statusCode == 200) {
                    responseCode = "OK"
                }
                resultdata = {
                    responseCode: responseCode,
                    result: {
                        response: {
                            content: data[0]
                        }
                    }
                }
                res.send(resultdata)
            })
        }
        else {
            res.statusCode = 400
            res.send({
                responseCode: "CLIENT_ERROR",
                result: {
                    response: {
                        // message: "schoolId should not be string or no of digits is not equal to 7"
                        message: "schoolId " + externalId + " should be a number"
                    }
                }
            })
        }
    },

    getSchoolFilters: function (req, res) {
        var schoolGender = new Array();
        var schoolAdmin = new Array();
        var schoolDistrict = new Array();
        model.getSchoolFilterByGender(function (err, data) {
            if (err) throw err;
            for (var i = 0; i < data.length; i++) {
                if (data[i] != '') {
                    var schoolObj = { "name": data[i], "value": data[i] }
                    schoolGender.push(schoolObj)
                }
            }
            model.getSchoolFilterByAdmin(function (err, data) {
                if (err) throw err;
                for (var i = 0; i < data.length; i++) {
                    if (data[i] != '') {
                        var schoolObj = { "name": data[i], "value": data[i] }
                        schoolAdmin.push(schoolObj)
                    }
                }
                model.getSchoolFilterByDistrict(function (err, data) {
                    if (err) throw err;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i] != '') {
                            var schoolObj = { "name": data[i], "value": data[i] }
                            schoolDistrict.push(schoolObj)
                        }
                    }
                    res.statusCode = 200;
                    if (res.statusCode == 200) {
                        responseCode = "OK"
                    }
                    resultdata = {
                        responseCode: responseCode,
                        result: {
                            response: {
                                content: {
                                    schoolType: schoolGender,
                                    schoolAdministration: schoolAdmin,
                                    schoolDistrict: schoolDistrict
                                }
                            }
                        }
                    }
                    res.send(resultdata)
                })
            })
        })
    }
}
