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
                    var schoolArray = new Array();
                    for (var i = 0; i < data.length; i++) {
                        // console.log(data[i].schoolInformation)
                        resultdata = {
                            externalId: data[i].schoolInformation.externalId,
                            name: data[i].schoolInformation.name,
                            sdiLevel: data[i].schoolLevel,
                            totalBoys: data[i].schoolInformation.totalBoys,
                            highestGrade: data[i].schoolInformation.highestGrade,
                            totalGirls: data[i].schoolInformation.totalGirls,
                            phone: data[i].schoolInformation.phone,
                            // emailId : emailId,
                            addressLine1: data[i].schoolInformation.addressLine1,
                            state: data[i].schoolInformation.state,
                            principalName: data[i].schoolInformation.principalName,
                            administration: data[i].schoolInformation.administration,
                            gender: data[i].schoolInformation.gender,
                            lowestGrade: data[i].schoolInformation.lowestGrade,
                            pincode: data[i].schoolInformation.pincode,
                            // emailId2 : emailId2,
                            country: data[i].schoolInformation.country,
                            districtName: data[i].schoolInformation.districtName,
                            gpsLocation: data[i].schoolInformation.gpsLocation,
                            addressLine2: data[i].schoolInformation.addressLine2,
                            // schoolNo : schoolNo,
                            districtId: data[i].schoolInformation.districtId,
                            city: data[i].schoolInformation.city,
                            zoneId: data[i].schoolInformation.zoneId,
                            shift: data[i].schoolInformation.shift,
                            totalStudents: data[i].schoolInformation.totalStudents
                        }
                        schoolArray.push(resultdata)
                    }
                    res.statusCode = 200;
                    if (res.statusCode == 200) {
                        responseCode = "OK"
                    }
                    resultdata = {
                        responseCode: responseCode,
                        result: {
                            response: {
                                count: schoolArray.length,
                                content: schoolArray
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
                            if (data != undefined) {
                                resultdata = {
                                    externalId: data.externalId,
                                    name: data.name,
                                    sdiLevel: data.sdiLevel,
                                    totalBoys: data.totalBoys,
                                    highestGrade: data.highestGrade,
                                    totalGirls: data.totalGirls,
                                    phone: data.phone,
                                    // emailId : emailId,
                                    addressLine1: data.addressLine1,
                                    state: data.state,
                                    principalName: data.principalName,
                                    administration: data.administration,
                                    gender: data.gender,
                                    lowestGrade: data.lowestGrade,
                                    pincode: data.pincode,
                                    // emailId2 : emailId2,
                                    country: data.country,
                                    districtName: data.districtName,
                                    gpsLocation: data.gpsLocation,
                                    addressLine2: data.addressLine2,
                                    // schoolNo : schoolNo,
                                    districtId: data.districtId,
                                    city: data.city,
                                    zoneId: data.zoneId,
                                    shift: data.shift,
                                    totalStudents: data.totalStudents
                                }
                                schoolInfo.push(resultdata)
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
                resultdata = {
                    externalId: data[0].schoolInformation.externalId,
                    name: data[0].schoolInformation.name,
                    sdiLevel: data[0].schoolLevel,
                    totalBoys: data[0].schoolInformation.totalBoys,
                    highestGrade: data[0].schoolInformation.highestGrade,
                    totalGirls: data[0].schoolInformation.totalGirls,
                    phone: data[0].schoolInformation.phone,
                    // emailId : emailId,
                    addressLine1: data[0].schoolInformation.addressLine1,
                    state: data[0].schoolInformation.state,
                    principalName: data[0].schoolInformation.principalName,
                    administration: data[0].schoolInformation.administration,
                    gender: data[0].schoolInformation.gender,
                    lowestGrade: data[0].schoolInformation.lowestGrade,
                    pincode: data[0].schoolInformation.pincode,
                    // emailId2 : emailId2,
                    country: data[0].schoolInformation.country,
                    districtName: data[0].schoolInformation.districtName,
                    gpsLocation: data[0].schoolInformation.gpsLocation,
                    addressLine2: data[0].schoolInformation.addressLine2,
                    // schoolNo : schoolNo,
                    districtId: data[0].schoolInformation.districtId,
                    city: data[0].schoolInformation.city,
                    zoneId: data[0].schoolInformation.zoneId,
                    shift: data[0].schoolInformation.shift,
                    totalStudents: data[0].schoolInformation.totalStudents
                }
                res.statusCode = 200;
                if (res.statusCode == 200) {
                    responseCode = "OK"
                }
                resultdata = {
                    responseCode: responseCode,
                    result: {
                        response: {
                            content: resultdata
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
    },

    getSchoolBySearchText: function (req, res) {
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
        if (!req.body.request.filters['searchText']) {
            res.statusCode = 404
            res.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "request.filter.searchText  is a required field  or searchText is null in requestBody"
                    }
                }
            })
        }
        if ((req.body.request.filters.searchText) != "") {
            searchText = req.body.request.filters.searchText;
            model.getSchoolBySearchText(searchText, function (err, data) {
                if (err) throw err;
                var schoolArr = new Array();
                for (var i = 0; i < data.length; i++) {
                    resObj = {
                        externalId: data[i].schoolInformation.externalId,
                        name: data[i].schoolInformation.name
                    }
                    schoolArr.push(resObj)
                }
                res.statusCode = 200;
                if (res.statusCode == 200) {
                    responseCode = "OK"
                }
                resultdata = {
                    responseCode: responseCode,
                    result: {
                        response: {
                            count: schoolArr.length,
                            content: {
                                school: schoolArr
                            }
                        }
                    }
                }
                res.send(resultdata)
            })
        }
    },

    getProgramMetricsInfo: function (req, res) {
        programId = req.params.programId
        model.getProgramMetricsSchoolCount(programId, function (err, data) {
            if (err) throw err;
            totalschoolcount = 0;
            sdiLevel4 = 0;
            sdiLevel3 = 0;
            sdiLevel2 = 0;
            sdiLevel1 = 0;
            themeSafetyLevel4 = 0;
            themeSafetyLevel3 = 0;
            themeSafetyLevel2 = 0;
            themeSafetyLevel1 = 0;
            themeTeachingLevel4 = 0;
            themeTeachingLevel3 = 0;
            themeTeachingLevel2 = 0;
            themeTeachingLevel1 = 0;
            themeCommunityLevel4 = 0;
            themeCommunityLevel3 = 0;
            themeCommunityLevel2 = 0;
            themeCommunityLevel1 = 0;
            var sdiLevelCalcArr = new Array();
            for (var i = 0; i < data.length; i++) {
                if (data[i].schoolInformation.externalId) {
                    totalschoolcount = totalschoolcount + 1;
                }
                if (isNaN(data[i].schoolLevel) == false) {
                    if (data[i].schoolLevel == 4) {
                        sdiLevel4 = sdiLevel4 + 1;
                    }
                    else if (data[i].schoolLevel == 3) {
                        sdiLevel3 = sdiLevel3 + 1;
                    }
                    else if (data[i].schoolLevel == 2) {
                        sdiLevel2 = sdiLevel2 + 1;
                    }
                    else if (data[i].schoolLevel == 1) {
                        sdiLevel1 = sdiLevel1 + 1;
                    }
                }
                if(isNaN(data[i].theme[0].themeLevel) == false && data[i].theme[0].name == "Safety and Security"){
                    if (data[i].theme[0].themeLevel == 4) {
                        themeSafetyLevel4 = themeSafetyLevel4 + 1;
                    }
                    else if (data[i].theme[0].themeLevel == 3) {
                        themeSafetyLevel3 = themeSafetyLevel3 + 1;
                    }
                    else if (data[i].theme[0].themeLevel == 2) {
                        themeSafetyLevel2 = themeSafetyLevel2 + 1;
                    }
                    else if (data[i].theme[0].themeLevel == 1) {
                        themeSafetyLevel1 = themeSafetyLevel1 + 1;
                    }
                }

                if(isNaN(data[i].theme[1].themeLevel) == false && data[i].theme[1].name == "Teaching and Learning"){
                    if (data[i].theme[1].themeLevel == 4) {
                        themeTeachingLevel4 = themeTeachingLevel4 + 1;
                    }
                    else if (data[i].theme[1].themeLevel == 3) {
                        themeTeachingLevel3 = themeTeachingLevel3 + 1;
                    }
                    else if (data[i].theme[1].themeLevel == 2) {
                        themeTeachingLevel2 = themeTeachingLevel2 + 1;
                    }
                    else if (data[i].theme[1].themeLevel == 1) {
                        themeTeachingLevel1 = themeTeachingLevel1 + 1;
                    }
                }
        
                if(isNaN(data[i].theme[2].themeLevel) == false && data[i].theme[2].name == "Community Participation and EWS/DG Integration "){
                    if (data[i].theme[2].themeLevel == 4) {
                        themeCommunityLevel4 = themeCommunityLevel4 + 1;
                    }
                    else if (data[i].theme[2].themeLevel == 3) {
                        themeCommunityLevel3 = themeCommunityLevel3 + 1;
                    }
                    else if (data[i].theme[2].themeLevel == 2) {
                        themeCommunityLevel2 = themeCommunityLevel2 + 1;
                    }
                    else if (data[i].theme[2].themeLevel == 1) {
                        themeCommunityLevel1 = themeCommunityLevel1 + 1;
                    }
                }
            }
            sdiLevelCalcArr.push(sdiLevel3)
            sdiLevelCalcArr.push(sdiLevel2)
            sdiLevelCalcArr.push(sdiLevel4)
            sdiLevelCalcArr.push(sdiLevel1)
            avgSdiScore = (sdiLevel4 + sdiLevel3 + sdiLevel2 + sdiLevel1) / totalschoolcount;

            firsthighestLevel = Math.max.apply(null, sdiLevelCalcArr);
            sdiLevelCalcArr.splice(sdiLevelCalcArr.indexOf(firsthighestLevel), 1);
            secondhighestLevel = Math.max.apply(null, sdiLevelCalcArr);

            firsthighestSafetyLevel = Math.max(themeSafetyLevel4,themeSafetyLevel3,themeSafetyLevel2,themeSafetyLevel1)
            firsthighestTeachingLevel = Math.max(themeTeachingLevel4,themeTeachingLevel3,themeTeachingLevel2,themeTeachingLevel1)
            firsthighestCommunityLevel = Math.max(themeCommunityLevel4,themeCommunityLevel3,themeCommunityLevel2,themeCommunityLevel1)
          
            if(firsthighestSafetyLevel == themeSafetyLevel4){
                firsthighestThemeSafetyLevel = 4;
            }
            else if(firsthighestSafetyLevel == themeSafetyLevel3){
                firsthighestThemeSafetyLevel = 3;
            }
            else if(firsthighestSafetyLevel == themeSafetyLevel2){
                firsthighestThemeSafetyLevel = 2;
            }
            else if(firsthighestSafetyLevel == themeSafetyLevel1){
                firsthighestThemeSafetyLevel = 1;
            }

            if(firsthighestTeachingLevel == themeTeachingLevel4){
                firsthighestThemeTeachingLevel = 4;
            }
            else if(firsthighestTeachingLevel == themeTeachingLevel3){
                firsthighestThemeTeachingLevel = 3;
            }
            else if(firsthighestTeachingLevel == themeTeachingLevel2){
                firsthighestThemeTeachingLevel = 2;
            }
            else if(firsthighestTeachingLevel == themeTeachingLevel1){
                firsthighestThemeTeachingLevel = 1;
            }

            if(firsthighestCommunityLevel == themeCommunityLevel4){
                firsthighestThemeCommmunityLevel = 4;
            }
            else if(firsthighestCommunityLevel == themeCommunityLevel3){
                firsthighestThemeCommunityLevel = 3;
            }
            else if(firsthighestCommunityLevel == themeCommunityLevel2){
                firsthighestThemeCommunityLevel = 2;
            }
            else if(firsthighestCommunityLevel == themeCommunityLevel1){
                firsthighestThemeCommunityLevel = 1;
            }
            
            if(firsthighestLevel == sdiLevel4){
                firsthighSchoolLevel = 4;
            }
            else if(firsthighestLevel == sdiLevel3){
                firsthighSchoolLevel = 3;
            }
            else if(firsthighestLevel == sdiLevel2){
                firsthighSchoolLevel = 2;
            }
            else if(firsthighestLevel == sdiLevel1){
                firsthighSchoolLevel = 1;
            }

            if(secondhighestLevel == sdiLevel4){
                secondhighSchoolLevel = 4;
            }
            else if(secondhighestLevel == sdiLevel3){
                secondhighSchoolLevel = 3;
            }
            else if(secondhighestLevel == sdiLevel2){
                secondhighSchoolLevel = 2;
            }
            else if(secondhighestLevel == sdiLevel1){
                secondhighSchoolLevel = 1;
            }
            model.getGovSchools(function (err, data) {
                if (err) throw err;
                governmentSchools = data.length;
                model.getPrivateSchools(function (err, data) {
                    if (err) throw err;
                    privateSchools = data.length;
                    res.statusCode = 200;
                    if (res.statusCode == 200) {
                        responseCode = "OK"
                    }
                    resultdata = {
                        responseCode: responseCode,
                        result: {
                            response: {
                                content: {
                                    programName: data[0].program.name,
                                    totalSchools: totalschoolcount,
                                    governmentSchools: governmentSchools,
                                    privateSchools: privateSchools,
                                    avgSdiScore: avgSdiScore,
                                    highestSdi : firsthighSchoolLevel,
                                    secondHighestSdi : secondhighSchoolLevel,
                                    highestSafetyandSecurity : firsthighestThemeSafetyLevel,
                                    highestTeachingandLearning : firsthighestThemeTeachingLevel,
                                    highestCommunityandParticipation : firsthighestThemeCommunityLevel
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
