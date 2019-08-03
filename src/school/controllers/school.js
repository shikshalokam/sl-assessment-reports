var express = require('express');
var router = express.Router();
var model = require('../models/school')
var logger = require('../../utils/logger');
var deasync = require('deasync');
var fs = require('fs');
const { Parser } = require('json2csv');

module.exports = {

    //get All school or >=1 school Info API
    getAllSchoolInfo: async function (reqSchoolInfo, resSchoolInfo) {
        programId = reqSchoolInfo.params.programId;
        if (!reqSchoolInfo.body.request) {
            resSchoolInfo.set('Content-Type', 'application/json')
            resSchoolInfo.statusCode = 404
            resSchoolInfo.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "request object is a required field in requestBody"
                    }
                }
            })
        }
        if (!reqSchoolInfo.body.request.filters) {
            resSchoolInfo.set('Content-Type', 'application/json')
            resSchoolInfo.statusCode = 404
            resSchoolInfo.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "request.filter object is a required field in requestBody"
                    }
                }
            })
        }
        if (!reqSchoolInfo.body.request.filters.schoolId) {
            resSchoolInfo.set('Content-Type', 'application/json')
            resSchoolInfo.statusCode = 404
            resSchoolInfo.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "request.filter.schoolId object is a required field in requestBody"
                    }
                }
            })
        }

        // check if schoolId entered is array or not
        if (Array.isArray(reqSchoolInfo.body.request.filters.schoolId) == true) {
            //check if schoolId array length is equal to 0
            if ((reqSchoolInfo.body.request.filters.schoolId).length == 0) {
                //get all SchoolInfo from mongodb collection
                model.getAllSchoolInfo(programId)
                    .then(function (dataAllSchool) {
                        var schoolAllArray = new Array();
                        for (var i = 0; i < dataAllSchool.length; i++) {
                            if (!dataAllSchool[i].entityInformation.awardsWon) {
                                awardsWon = []
                            } else {
                                awardsWon = dataAllSchool[i].entityInformation.awardsWon
                            }
                            if (!dataAllSchool[i].entityInformation.innovativePractices) {
                                innovativePractices = []
                            } else {
                                innovativePractices = dataAllSchool[i].entityInformation.innovativePractices
                            }
                            if (!dataAllSchool[i].entityInformation.website) {
                                website = ""
                            } else {
                                website = dataAllSchool[i].entityInformation.website
                            }
                            schoolArrGetAllInfo = {
                                externalId: dataAllSchool[i].entityInformation.externalId,
                                name: dataAllSchool[i].entityInformation.name,
                                sdiLevel: dataAllSchool[i].schoolLevel,
                                totalBoys: dataAllSchool[i].entityInformation.totalBoys,
                                highestGrade: dataAllSchool[i].entityInformation.highestGrade,
                                totalGirls: dataAllSchool[i].entityInformation.totalGirls,
                                phone: dataAllSchool[i].entityInformation.phone,
                                emailId: dataAllSchool[i].entityInformation.emailId,
                                addressLine1: dataAllSchool[i].entityInformation.addressLine1,
                                state: dataAllSchool[i].entityInformation.state,
                                principalName: dataAllSchool[i].entityInformation.principalName,
                                administration: dataAllSchool[i].entityInformation.administration,
                                gender: dataAllSchool[i].entityInformation.gender,
                                lowestGrade: dataAllSchool[i].entityInformation.lowestGrade,
                                pincode: dataAllSchool[i].entityInformation.pincode,
                                emailId2: dataAllSchool[i].entityInformation.emailId2,
                                country: dataAllSchool[i].entityInformation.country,
                                districtName: dataAllSchool[i].entityInformation.districtName,
                                gpsLocation: dataAllSchool[i].entityInformation.gpsLocation,
                                addressLine2: dataAllSchool[i].entityInformation.addressLine2,
                                schoolNo: dataAllSchool[i].entityInformation.schooolNo,
                                districtId: dataAllSchool[i].entityInformation.districtId,
                                city: dataAllSchool[i].entityInformation.city,
                                zoneId: dataAllSchool[i].entityInformation.zoneId,
                                shift: dataAllSchool[i].entityInformation.shift,
                                totalStudents: dataAllSchool[i].entityInformation.totalStudents,
                                streamOffered: dataAllSchool[i].entityInformation.streamOffered,
                                awardsWon: awardsWon,
                                innovativePractices: innovativePractices,
                                website: website,
                                themes: dataAllSchool[i].theme
                            }
                            schoolAllArray.push(schoolArrGetAllInfo)
                        }
                        resSchoolInfo.set('Content-Type', 'application/json')
                        resSchoolInfo.statusCode = 200;
                        if (resSchoolInfo.statusCode == 200) {
                            responseCode = "OK"
                        }
                        resultdataAllSchoolInfo = {
                            responseCode: responseCode,
                            result: {
                                response: {
                                    count: schoolAllArray.length,
                                    data: schoolAllArray
                                }
                            }
                        }
                        resSchoolInfo.send(resultdataAllSchoolInfo)
                    })
                    .catch(function (err) {
                        console.log("Error in getting All School Information")
                        throw err;
                    })
            }
            // get schoolInfo for particular schoolId entered in an req.body schoolId array
            else if ((reqSchoolInfo.body.request.filters.schoolId).length > 0) {
                querySchool = reqSchoolInfo.body.request.filters.schoolId
                var schoolSpecificInfo = new Array()
                for (var i = 0; i < querySchool.length; i++) {
                    //check if schooId is number or not
                    if (isNaN(querySchool[i]) == false) {
                        try {
                            //get Particular School Info for given schoolId
                            let dataSpecificSchool = await model.getSchoolInfoSpecific(querySchool[i], programId);
                            if (dataSpecificSchool != undefined) {
                                if (!dataSpecificSchool.entityInformation.awardsWon) {
                                    awardsWon = []
                                } else {
                                    awardsWon = dataSpecificSchool.entityInformation.awardsWon
                                }
                                if (!dataSpecificSchool.entityInformation.innovativePractices) {
                                    innovativePractices = []
                                } else {
                                    innovativePractices = dataSpecificSchool.entityInformation.innovativePractices
                                }
                                if (!dataSpecificSchool.entityInformation.website) {
                                    website = ""
                                } else {
                                    website = dataSpecificSchool.entityInformation.website
                                }
                                schooldataSpecificInfo = {
                                    externalId: dataSpecificSchool.entityInformation.externalId,
                                    name: dataSpecificSchool.entityInformation.name,
                                    sdiLevel: dataSpecificSchool.entityInformation.sdiLevel,
                                    totalBoys: dataSpecificSchool.entityInformation.totalBoys,
                                    highestGrade: dataSpecificSchool.entityInformation.highestGrade,
                                    totalGirls: dataSpecificSchool.entityInformation.totalGirls,
                                    phone: dataSpecificSchool.entityInformation.phone,
                                    emailId: dataSpecificSchool.entityInformation.emailId,
                                    addressLine1: dataSpecificSchool.entityInformation.addressLine1,
                                    state: dataSpecificSchool.entityInformation.state,
                                    principalName: dataSpecificSchool.entityInformation.principalName,
                                    administration: dataSpecificSchool.entityInformation.administration,
                                    gender: dataSpecificSchool.entityInformation.gender,
                                    lowestGrade: dataSpecificSchool.entityInformation.lowestGrade,
                                    pincode: dataSpecificSchool.entityInformation.pincode,
                                    emailId2: dataSpecificSchool.entityInformation.emailId2,
                                    country: dataSpecificSchool.entityInformation.country,
                                    districtName: dataSpecificSchool.entityInformation.districtName,
                                    gpsLocation: dataSpecificSchool.entityInformation.gpsLocation,
                                    addressLine2: dataSpecificSchool.entityInformation.addressLine2,
                                    schoolNo: dataSpecificSchool.entityInformation.schooolNo,
                                    districtId: dataSpecificSchool.entityInformation.districtId,
                                    city: dataSpecificSchool.entityInformation.city,
                                    zoneId: dataSpecificSchool.entityInformation.zoneId,
                                    shift: dataSpecificSchool.entityInformation.shift,
                                    totalStudents: dataSpecificSchool.entityInformation.totalStudents,
                                    streamOffered: dataSpecificSchool.entityInformation.streamOffered,
                                    themes: dataSpecificSchool.theme,
                                    awardsWon: awardsWon,
                                    innovativePractices: innovativePractices,
                                    website: website
                                }
                                schoolSpecificInfo.push(schooldataSpecificInfo)
                            }
                        }
                        catch (error) {
                            console.log("Error in getting Particular School Info")
                            throw error;
                        }
                    }
                    else {
                        resSchoolInfo.set('Content-Type', 'application/json')
                        resSchoolInfo.statusCode = 400
                        resSchoolInfo.send({
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
                resSchoolInfo.set('Content-Type', 'application/json')
                resSchoolInfo.statusCode = 200;
                if (resSchoolInfo.statusCode == 200) {
                    responseCode = "OK"
                }
                resultdataSpecificSchool = {
                    responseCode: responseCode,
                    result: {
                        response: {
                            count: schoolSpecificInfo.length,
                            data: schoolSpecificInfo
                        }
                    }
                }
                resSchoolInfo.send(resultdataSpecificSchool)
            }
        }
        else {
            resSchoolInfo.set('Content-Type', 'application/json')
            resSchoolInfo.statusCode = 400
            resSchoolInfo.send({
                responseCode: "CLIENT_ERROR",
                result: {
                    response: {
                        message: "schoolId should be an array in requestBody"
                    }
                }
            })
        }
    },

    // getSchool Filters like schoolTypes , schoolAdministration , schoolDistrict Info API
    getSchoolFilters: function (reqGetFilters, resGetFilters) {
        programId = reqGetFilters.params.programId
        var schoolGender = new Array();
        var schoolAdmin = new Array();
        var schoolDistrict = new Array();
        //get gender info from mongodb collection
        model.getSchoolFilterByGender(programId)
            .then(function (dataSchoolGender) {
                for (var i = 0; i < dataSchoolGender.length; i++) {
                    if (dataSchoolGender[i] != '') {
                        var schoolGenderObj = { "name": dataSchoolGender[i], "value": dataSchoolGender[i] }
                        schoolGender.push(schoolGenderObj)
                    }
                }
                //get administration info from mongodb collection
                model.getSchoolFilterByAdmin(programId)
                    .then(function (dataSchoolAdmin) {
                        for (var i = 0; i < dataSchoolAdmin.length; i++) {
                            if (dataSchoolAdmin[i] != '') {
                                var schoolAdminObj = { "name": dataSchoolAdmin[i], "value": dataSchoolAdmin[i] }
                                schoolAdmin.push(schoolAdminObj)
                            }
                        }
                        //get district info from mongodb collection
                        model.getSchoolFilterByDistrict(programId)
                            .then(function (dataSchoolDistrict) {
                                for (var i = 0; i < dataSchoolDistrict.length; i++) {
                                    if (dataSchoolDistrict[i] != '') {
                                        var schoolDistrictObj = { "name": dataSchoolDistrict[i], "value": dataSchoolDistrict[i] }
                                        schoolDistrict.push(schoolDistrictObj)
                                    }
                                }
                                resGetFilters.set('Content-Type', 'application/json')
                                resGetFilters.statusCode = 200;
                                if (resGetFilters.statusCode == 200) {
                                    responseCode = "OK"
                                }
                                resultFilterdata = {
                                    responseCode: responseCode,
                                    result: {
                                        response: {
                                            data: {
                                                schoolType: schoolGender,
                                                schoolAdministration: schoolAdmin,
                                                schoolDistrict: schoolDistrict
                                            }
                                        }
                                    }
                                }
                                resGetFilters.send(resultFilterdata)
                            })
                            .catch(function (err) {
                                console.log("Error in getting Distict Info of getSchoolFilter API");
                                throw err;
                            })
                    })
                    .catch(function (err) {
                        console.log("Error in getting Administration Info of getSchoolFilter API");
                        throw err;
                    })
            })
            .catch(function (err) {
                console.log("Error in getting Gender (SchoolTypes) Info of getSchoolFilter API");
                throw err;
            })
    },

    //getSchool Information based on search text match - API
    getSchoolBySearchText: function (reqSearchText, resSearchText) {
        programId = reqSearchText.params.programId
        if (!reqSearchText.body.request) {
            resSearchText.set('Content-Type', 'application/json')
            resSearchText.statusCode = 404
            resSearchText.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "request object is a required field in requestBody"
                    }
                }
            })
        }
        if (!reqSearchText.body.request.filters) {
            resSearchText.set('Content-Type', 'application/json')
            resSearchText.statusCode = 404
            resSearchText.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "request.filter object is a required field in requestBody"
                    }
                }
            })
        }
        if (!reqSearchText.body.request.filters['searchText']) {
            resSearchText.set('Content-Type', 'application/json')
            resSearchText.statusCode = 404
            resSearchText.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "request.filter.searchText  is a required field  or searchText is null in requestBody"
                    }
                }
            })
        }
        if ((reqSearchText.body.request.filters.searchText) != "") {
            searchText = reqSearchText.body.request.filters.searchText;
            // search school by searchText on matching indexes in mongodb collection
            model.getSchoolBySearchText(searchText, programId)
                .then(function (dataSearchText) {
                    var schoolSearchArr = new Array();
                    for (var i = 0; i < dataSearchText.length; i++) {
                        resultSearchTextObj = {
                            externalId: dataSearchText[i].entityInformation.externalId,
                            name: dataSearchText[i].entityInformation.name
                        }
                        schoolSearchArr.push(resultSearchTextObj)
                    }
                    resSearchText.set('Content-Type', 'application/json')
                    resSearchText.statusCode = 200;
                    if (resSearchText.statusCode == 200) {
                        responseCode = "OK"
                    }
                    resultdataSearcchText = {
                        responseCode: responseCode,
                        result: {
                            response: {
                                count: schoolSearchArr.length,
                                data: {
                                    school: schoolSearchArr
                                }
                            }
                        }
                    }
                    resSearchText.send(resultdataSearcchText)
                })
                .catch(function (err) {
                    console.log("Error in getting SchoolInfo by Text based Search API")
                    throw err;
                })
        }
    },

    // get DCPCR program metrics info
    getProgramMetricsInfo: function (reqProgramMetrics, resProgramMetrics) {
        programId = reqProgramMetrics.params.programId
        //get no of schools belongs this programId from mongodb collection
        model.getProgramMetricsSchoolCount(programId)
            .then(function (dataProgramMetrics) {
                totalSchoolCount = 0;
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
                themeSocialLevel4 = 0;
                themeSocialLevel3 = 0;
                themeSocialLevel2 = 0;
                themeSocialLevel1 = 0;
                themeParentLevel4 = 0;
                themeParentLevel3 = 0;
                themeParentLevel2 = 0;
                themeParentLevel1 = 0;
                var sdiLevelCalcArr = new Array();
                for (var i = 0; i < dataProgramMetrics.length; i++) {
                    //total number of schools for this programId
                    if (dataProgramMetrics[i].entityInformation.externalId) {
                        totalSchoolCount = totalSchoolCount + 1;
                    }
                    //check for schoolRating is string or number
                    if (isNaN(dataProgramMetrics[i].schoolLevel) == false) {
                        //if school rating is 4 -> count the number of schools which has rating 4
                        if (dataProgramMetrics[i].schoolLevel == 4) {
                            sdiLevel4 = sdiLevel4 + 1;
                        }
                        //if school rating is 3 -> count the number of schools which has rating 3
                        else if (dataProgramMetrics[i].schoolLevel == 3) {
                            sdiLevel3 = sdiLevel3 + 1;
                        }
                        //if school rating is 2 -> count the number of schools which has rating 2
                        else if (dataProgramMetrics[i].schoolLevel == 2) {
                            sdiLevel2 = sdiLevel2 + 1;
                        }
                        //if school rating is 1 -> count the number of schools which has rating 1
                        else if (dataProgramMetrics[i].schoolLevel == 1) {
                            sdiLevel1 = sdiLevel1 + 1;
                        }
                    }

                    // "Safety and Security" theme Rating calculation
                    if (isNaN(dataProgramMetrics[i].theme[0].themeLevel) == false && dataProgramMetrics[i].theme[0].name == "Safety and Security") {
                        //if theme rating is 4 -> count the number of schools which has rating 4
                        if (dataProgramMetrics[i].theme[0].themeLevel == 4) {
                            themeSafetyLevel4 = themeSafetyLevel4 + 1;
                        }
                        //if theme rating is 3 -> count the number of schools which has rating 3
                        else if (dataProgramMetrics[i].theme[0].themeLevel == 3) {
                            themeSafetyLevel3 = themeSafetyLevel3 + 1;
                        }
                        //if theme rating is 2 -> count the number of schools which has rating 2
                        else if (dataProgramMetrics[i].theme[0].themeLevel == 2) {
                            themeSafetyLevel2 = themeSafetyLevel2 + 1;
                        }
                        //if theme rating is 1 -> count the number of schools which has rating 1
                        else if (dataProgramMetrics[i].theme[0].themeLevel == 1) {
                            themeSafetyLevel1 = themeSafetyLevel1 + 1;
                        }
                    }

                    //"Teaching and Learning" theme rating calculation
                    if (isNaN(dataProgramMetrics[i].theme[1].themeLevel) == false && dataProgramMetrics[i].theme[1].name == "Teaching and Learning") {
                        //if theme rating is 4 -> count the number of schools which has rating 4
                        if (dataProgramMetrics[i].theme[1].themeLevel == 4) {
                            themeTeachingLevel4 = themeTeachingLevel4 + 1;
                        }
                        //if theme rating is 3 -> count the number of schools which has rating 3
                        else if (dataProgramMetrics[i].theme[1].themeLevel == 3) {
                            themeTeachingLevel3 = themeTeachingLevel3 + 1;
                        }
                        //if theme rating is 2 -> count the number of schools which has rating 2
                        else if (dataProgramMetrics[i].theme[1].themeLevel == 2) {
                            themeTeachingLevel2 = themeTeachingLevel2 + 1;
                        }
                        //if theme rating is 1 -> count the number of schools which has rating 1
                        else if (dataProgramMetrics[i].theme[1].themeLevel == 1) {
                            themeTeachingLevel1 = themeTeachingLevel1 + 1;
                        }
                    }

                    //"Social Inclusion Index" theme rating calculation
                    if (isNaN(dataProgramMetrics[i].theme[2].themeLevel) == false && dataProgramMetrics[i].theme[2].name == "Social Inclusion Index") {
                        //if theme rating is 4 -> count the number of schools which has rating 4
                        if (dataProgramMetrics[i].theme[2].themeLevel == 4) {
                            themeSocialLevel4 = themeSocialLevel4 + 1;
                        }
                        //if theme rating is 3 -> count the number of schools which has rating 3
                        else if (dataProgramMetrics[i].theme[2].themeLevel == 3) {
                            themeSocialLevel3 = themeSocialLevel3 + 1;
                        }
                        //if theme rating is 2 -> count the number of schools which has rating 2
                        else if (dataProgramMetrics[i].theme[2].themeLevel == 2) {
                            themeSocialLevel2 = themeSocialLevel2 + 1;
                        }
                        //if theme rating is 1 -> count the number of schools which has rating 1
                        else if (dataProgramMetrics[i].theme[2].themeLevel == 1) {
                            themeSocialLevel1 = themeSocialLevel1 + 1;
                        }
                    }

                    //"Parent Participation Index" theme rating calculation
                    if (isNaN(dataProgramMetrics[i].theme[3].themeLevel) == false && dataProgramMetrics[i].theme[3].name == "Parent Participation Index") {
                        //if theme rating is 4 -> count the number of schools which has rating 4
                        if (dataProgramMetrics[i].theme[3].themeLevel == 4) {
                            themeParentLevel4 = themeParentLevel4 + 1;
                        }
                        //if theme rating is 3 -> count the number of schools which has rating 3
                        else if (dataProgramMetrics[i].theme[3].themeLevel == 3) {
                            themeParentLevel3 = themeParentLevel3 + 1;
                        }
                        //if theme rating is 2 -> count the number of schools which has rating 2
                        else if (dataProgramMetrics[i].theme[3].themeLevel == 2) {
                            themeParentLevel2 = themeParentLevel2 + 1;
                        }
                        //if theme rating is 1 -> count the number of schools which has rating 1
                        else if (dataProgramMetrics[i].theme[3].themeLevel == 1) {
                            themeParentLevel1 = themeParentLevel1 + 1;
                        }
                    }
                }
                sdiLevelCalcArr.push(sdiLevel3)
                sdiLevelCalcArr.push(sdiLevel2)
                sdiLevelCalcArr.push(sdiLevel4)
                sdiLevelCalcArr.push(sdiLevel1)
                //calculation average sdiLevel
                avgSdiScore = (sdiLevel4 + sdiLevel3 + sdiLevel2 + sdiLevel1) / totalSchoolCount;

                //first highest sdiLevel
                firstHighestSdiLevel = Math.max.apply(null, sdiLevelCalcArr);
                sdiLevelCalcArr.splice(sdiLevelCalcArr.indexOf(firstHighestSdiLevel), 1);
                //second highest sdiLevel
                secondHighestSdiLevel = Math.max.apply(null, sdiLevelCalcArr);

                //fisrthighest Theme Levels
                firstHighestSafetyLevel = Math.max(themeSafetyLevel4, themeSafetyLevel3, themeSafetyLevel2, themeSafetyLevel1)
                firstHighestTeachingLevel = Math.max(themeTeachingLevel4, themeTeachingLevel3, themeTeachingLevel2, themeTeachingLevel1)
                firstHighestSocialLevel = Math.max(themeSocialLevel4, themeSocialLevel3, themeSocialLevel2, themeSocialLevel1)
                firstHighestParentLevel = Math.max(themeParentLevel4, themeParentLevel3, themeParentLevel2, themeParentLevel1)

                //setting level numbers
                if (firstHighestSafetyLevel == themeSafetyLevel4) {
                    firstHighestThemeSafetyLevel = 4;
                }
                else if (firstHighestSafetyLevel == themeSafetyLevel3) {
                    firstHighestThemeSafetyLevel = 3;
                }
                else if (firstHighestSafetyLevel == themeSafetyLevel2) {
                    firstHighestThemeSafetyLevel = 2;
                }
                else if (firstHighestSafetyLevel == themeSafetyLevel1) {
                    firstHighestThemeSafetyLevel = 1;
                }

                if (firstHighestTeachingLevel == themeTeachingLevel4) {
                    firstHighestThemeTeachingLevel = 4;
                }
                else if (firstHighestTeachingLevel == themeTeachingLevel3) {
                    firstHighestThemeTeachingLevel = 3;
                }
                else if (firstHighestTeachingLevel == themeTeachingLevel2) {
                    firstHighestThemeTeachingLevel = 2;
                }
                else if (firstHighestTeachingLevel == themeTeachingLevel1) {
                    firstHighestThemeTeachingLevel = 1;
                }

                if (firstHighestSocialLevel == themeSocialLevel4) {
                    firstHighestThemeSocialLevel = 4;
                }
                else if (firstHighestSocialLevel == themeSocialLevel2) {
                    firstHighestThemeSocialLevel = 3;
                }
                else if (firstHighestSocialLevel == themeSocialLevel3) {
                    firstHighestThemeSocialLevel = 2;
                }
                else if (firstHighestSocialLevel == themeSocialLevel1) {
                    firstHighestThemeSocialLevel = 1;
                }

                if (firstHighestParentLevel == themeParentLevel4) {
                    firstHighestThemeParentLevel = 4;
                }
                else if (firstHighestParentLevel == themeParentLevel3) {
                    firstHighestThemeParentLevel = 3;
                }
                else if (firstHighestParentLevel == themeParentLevel2) {
                    firstHighestThemeParentLevel = 2;
                }
                else if (firstHighestParentLevel == themeParentLevel1) {
                    firstHighestThemeParentLevel = 1;
                }

                if (firstHighestSdiLevel == sdiLevel4) {
                    firstHighSchoolLevel = 4;
                }
                else if (firstHighestSdiLevel == sdiLevel3) {
                    firstHighSchoolLevel = 3;
                }
                else if (firstHighestSdiLevel == sdiLevel2) {
                    firstHighSchoolLevel = 2;
                }
                else if (firstHighestSdiLevel == sdiLevel1) {
                    firstHighSchoolLevel = 1;
                }

                if (secondHighestSdiLevel == sdiLevel4) {
                    secondHighSchoolLevel = 4;
                }
                else if (secondHighestSdiLevel == sdiLevel3) {
                    secondHighSchoolLevel = 3;
                }
                else if (secondHighestSdiLevel == sdiLevel2) {
                    secondHighSchoolLevel = 2;
                }
                else if (secondHighestSdiLevel == sdiLevel1) {
                    secondHighSchoolLevel = 1;
                }

                //get total number of government schools in mongodb collections
                model.getGovSchools(programId)
                    .then(function (dataGovSchools) {
                        governmentSchools = dataGovSchools.length;
                        //get total number of private schools(All schools which has UnAided keyword) in mongodb collections
                        model.getPrivateSchools(programId)
                            .then(function (dataPrivSchools) {
                                privateSchools = dataPrivSchools.length;
                                resProgramMetrics.set('Content-Type', 'application/json')
                                resProgramMetrics.statusCode = 200;
                                if (resProgramMetrics.statusCode == 200) {
                                    responseCode = "OK"
                                }
                                resultdataProgramMetrics = {
                                    responseCode: responseCode,
                                    result: {
                                        response: {
                                            data: {
                                                programName: dataProgramMetrics[0].program.name,
                                                totalSchools: totalSchoolCount,
                                                governmentSchools: governmentSchools,
                                                privateSchools: privateSchools,
                                                avgSdiScore: avgSdiScore,
                                                highestSdi: firstHighSchoolLevel,
                                                secondHighestSdi: secondHighSchoolLevel,
                                                highestSafetyandSecurity: firstHighestThemeSafetyLevel,
                                                highestTeachingandLearning: firstHighestThemeTeachingLevel,
                                                highestSocialIclusionIndex: firstHighestThemeSocialLevel,
                                                highestParentParticipationIndex: firstHighestThemeParentLevel
                                            }
                                        }
                                    }
                                }
                                resProgramMetrics.send(resultdataProgramMetrics)
                            })
                            .catch(function (err) {
                                console.log("Error in getting Private Schools in getSchoolProgramMetrics API")
                                throw err;
                            })
                    })
                    .catch(function (err) {
                        console.log("Error in getting Government Schools in getSchoolProgramMetrics API")
                        throw err;
                    })
            })
            .catch(function (err) {
                console.log("Error in getting SchoolInfo for the ProgramId")
                throw err;
            })
    },

    //get District Metrics Info API
    getDistrictMetricsInfo: function (reqDistrictMetrics, resDistrictMetrics) {
        programId = reqDistrictMetrics.params.programId;
        //get the unique district names for the matching programId
        model.getDistinctDistrictName(programId)
            .then(function (dataDiscDistrict) {
                var districtArr = new Array();
                for (var i = 0; i < dataDiscDistrict.length; i++) {
                    districtName = dataDiscDistrict[i];
                    //get districtInfo for matching districtName and programId
                    model.getSingleDistrictInfo(programId, districtName)
                        .then(function (dataDistrictInfo) {
                            schoolCountDistrict = dataDistrictInfo.length;
                            sumCountDistrictL1 = 0;
                            sumCountDistrictL2 = 0;
                            sumCountDistrictL3 = 0;
                            sumCountDistrictL4 = 0;
                            for (var j = 0; j < schoolCountDistrict; j++) {
                                if (isNaN(dataDistrictInfo[j].schoolLevel) == false) {
                                    if (dataDistrictInfo[j].schoolLevel == 1) {
                                        sumCountDistrictL1 = sumCountDistrictL1 + 1
                                    }
                                    else if (dataDistrictInfo[j].schoolLevel == 2) {
                                        sumCountDistrictL2 = sumCountDistrictL2 + 1
                                    }
                                    else if (dataDistrictInfo[j].schoolLevel == 3) {
                                        sumCountDistrictL3 = sumCountDistrictL3 + 1
                                    }
                                    else if (dataDistrictInfo[j].schoolLevel == 4) {
                                        sumCountDistrictL4 = sumCountDistrictL4 + 1
                                    }
                                }
                            }
                            districtwiseSdiSum = sumCountDistrictL1 + sumCountDistrictL2 + sumCountDistrictL3 + sumCountDistrictL4;
                            //calculate average of sdiLevel for each district
                            districtwiseSdiAvg = districtwiseSdiSum / schoolCountDistrict;
                            //calculate districtLevels Percentage
                            districtwiseSdiAvg1 = districtwiseSdiAvg.toFixed(2)
                            districtL1Perc = (sumCountDistrictL1 / schoolCountDistrict) * 100;
                            districtL1Perc1 = districtL1Perc.toFixed(1)
                            districtL2Perc = (sumCountDistrictL2 / schoolCountDistrict) * 100;
                            districtL2Perc1 = districtL2Perc.toFixed(1)
                            districtL3Perc = (sumCountDistrictL3 / schoolCountDistrict) * 100;
                            districtL3Perc1 = districtL3Perc.toFixed(1)
                            districtL4Perc = (sumCountDistrictL4 / schoolCountDistrict) * 100;
                            districtL4Perc1 = districtL4Perc.toFixed(1)
                            // districtL4Perc1 = ParseInt(districtL4Perc.toFixed(2) + '%)
                            var districtRes = {
                                districtName: dataDistrictInfo[0].entityInformation.districtName,
                                totalSchool: schoolCountDistrict,
                                avgSdiOfDistrict: districtwiseSdiAvg1,
                                level1Percent: districtL1Perc1,
                                level2Percent: districtL2Perc1,
                                level3Percent: districtL3Perc1,
                                level4Percent: districtL4Perc1
                            }
                            districtArr.push(districtRes);
                        })
                        .catch(function (err) {
                            console.log("Error in getting SchoolInfo for the given districtName in getDistrictMetricsInfo API")
                            throw err;
                        })
                }

                while (districtArr.length != dataDiscDistrict.length) {
                    deasync.runLoopOnce()
                }
                //get metrics info for whole of delhi
                model.getSchoolInfoDelhi(programId)
                    .then(function (dataWholeDelhi) {
                        delhiSchoolL1 = 0;
                        delhiSchoolL2 = 0;
                        delhiSchoolL3 = 0;
                        delhiSchoolL4 = 0;
                        for (var k = 0; k < dataWholeDelhi.length; k++) {
                            if (dataWholeDelhi[k].entityInformation.districtName && dataWholeDelhi[k].entityInformation.districtName != "" && isNaN(dataWholeDelhi[k].schoolLevel) == false) {
                                if (dataWholeDelhi[k].schoolLevel == 1) {
                                    delhiSchoolL1 = delhiSchoolL1 + 1;
                                }
                                else if (dataWholeDelhi[k].schoolLevel == 2) {
                                    delhiSchoolL2 = delhiSchoolL2 + 1;
                                }
                                else if (dataWholeDelhi[k].schoolLevel == 3) {
                                    delhiSchoolL3 = delhiSchoolL3 + 1;
                                }
                                else if (dataWholeDelhi[k].schoolLevel == 4) {
                                    delhiSchoolL4 = delhiSchoolL4 + 1
                                }
                            }
                        }
                        delhiL1Percent = (delhiSchoolL1 / dataWholeDelhi.length) * 100;
                        delhiL1Percent1 = delhiL1Percent.toFixed(1)
                        delhiL2Percent = (delhiSchoolL2 / dataWholeDelhi.length) * 100;
                        delhiL2Percent1 = delhiL2Percent.toFixed(1)
                        delhiL3Percent = (delhiSchoolL3 / dataWholeDelhi.length) * 100;
                        delhiL3Percent1 = delhiL3Percent.toFixed(1)
                        delhiL4Percent = (delhiSchoolL4 / dataWholeDelhi.length) * 100;
                        delhiL4Percent1 = delhiL4Percent.toFixed(1)
                        resDistrictMetrics.set('Content-Type', 'appli')
                        resDistrictMetrics.statusCode = 200;
                        if (resDistrictMetrics.statusCode == 200) {
                            responseCode = "OK"
                        }
                        resultdataDistrict = {
                            responseCode: responseCode,
                            result: {
                                response: {
                                    data: {
                                        district: districtArr,
                                        wholeOfDelhi: {
                                            level1Percent: delhiL1Percent1,
                                            level2Percent: delhiL2Percent1,
                                            level3Percent: delhiL3Percent1,
                                            level4Percent: delhiL4Percent1
                                        }
                                    }
                                }
                            }
                        }
                        resDistrictMetrics.send(resultdataDistrict)
                    })
                    .catch(function (err) {
                        console.log("Error in getting whole of delhi Info in getDistrictMetricsInfo API")
                        throw err;
                    })
            })
            .catch(function (err) {
                console.log("Error in getting Unique District for the ProgramId in getDistrictMetricsInfo API")
                throw err;
            })
    },

    getFrameworkInfo: function (reqFramework, resFramework) {
        if (!reqFramework.query.frameworkId && !reqFramework.query.reportType) {
            resFramework.statusCode = 404
            resFramework.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "query string frameworkId and reportType is required field"
                    }
                }
            })
        }
        frameworkId = reqFramework.query.frameworkId;
        reportType = reqFramework.query.reportType;
        model.getFrameworkInfo(frameworkId)
            .then(async function (dataFrameworkInfo) {
                themelen = dataFrameworkInfo[0].themes.length
                var resTheme = new Array()
                for (var i = 0; i < themelen; i++) {
                    resultTheme = {}
                    resultTheme['Theme'] = dataFrameworkInfo[0].themes[i].name
                    resultTheme['ThemeId'] = dataFrameworkInfo[0].themes[i].externalId
                    if (Array.isArray(dataFrameworkInfo[0].themes[i].children) == true) {
                        var subthemeArr = new Array()
                        for (var j = 0; j < dataFrameworkInfo[0].themes[i].children.length; j++) {
                            subtheme = dataFrameworkInfo[0].themes[i].children[j].label;
                            themepushObj = {
                                name: dataFrameworkInfo[0].themes[i].children[j].name,
                                externalId: dataFrameworkInfo[0].themes[i].children[j].externalId
                            }

                            if (Array.isArray(dataFrameworkInfo[0].themes[i].children[j].children) == true) {
                                subsubthemeLen = dataFrameworkInfo[0].themes[i].children[j].children.length;
                                var subsubthemeArr = new Array()
                                for (var l = 0; l < subsubthemeLen; l++) {
                                    var criteriaArr = new Array()
                                    subsubtheme = dataFrameworkInfo[0].themes[i].children[j].children[l].label;
                                    themesubpushObj = {
                                        name: dataFrameworkInfo[0].themes[i].children[j].children[l].name,
                                        externalId: dataFrameworkInfo[0].themes[i].children[j].children[l].externalId
                                    }

                                    if (Array.isArray(dataFrameworkInfo[0].themes[i].children[j].children[l].criteria) == true) {

                                        criteriaLen = dataFrameworkInfo[0].themes[i].children[j].children[l].criteria.length;
                                        for (var k = 0; k < criteriaLen; k++) {
                                            criteriaId = dataFrameworkInfo[0].themes[i].children[j].children[l].criteria[k];
                                            let datacriteriaInfo = await model.getCriteriaInfo(criteriaId)
                                            rubricLevel1 = datacriteriaInfo[0].rubric.levels
                                            var rubricArr = new Array()
                                            var rubricObj = {}
                                            for (var rub in rubricLevel1) {
                                                rubricLevel = 'rubric' + rubricLevel1[rub]['level'];
                                                rubricDescp = rubricLevel1[rub]['description'];
                                                rubricAlg = rubricLevel1[rub]['level'] + 'Algorithm';
                                                rubricExp = rubricLevel1[rub]['expression']
                                                // rubricObj = {
                                                //     rubricLevel : rubricDescp,
                                                //     rubricAlg : rubricExp
                                                // }
                                                rubricObj[rubricLevel] = rubricDescp;
                                                rubricObj[rubricAlg] = rubricExp
                                                // rubricArr.push(rubricObj)
                                            }
                                            criteriaObj = {
                                                name: datacriteriaInfo[0].name,
                                                externalId: datacriteriaInfo[0].externalId,
                                                rubric: rubricObj
                                            }
                                            criteriaArr.push(criteriaObj)
                                        }
                                        themesubpushObj['criteria'] = criteriaArr
                                        subsubthemeArr.push(themesubpushObj)
                                        // resultTheme['Criteria'] = criteriaArr
                                    }
                                }
                                themepushObj[subsubtheme] = subsubthemeArr
                                subthemeArr.push(themepushObj)
                            } else if (Array.isArray(dataFrameworkInfo[0].themes[i].children[j].criteria) == true) {
                                criteriaLen = dataFrameworkInfo[0].themes[i].children[j].criteria.length;
                                var criteriaArr = new Array()
                                for (var k = 0; k < criteriaLen; k++) {
                                    criteriaId = dataFrameworkInfo[0].themes[i].children[j].criteria[k];
                                    let datacriteriaInfo = await model.getCriteriaInfo(criteriaId)
                                    rubricLevel1 = datacriteriaInfo[0].rubric.levels
                                    var rubricArr = new Array()
                                    var rubricObj = {}
                                    for (var rub in rubricLevel1) {
                                        rubricLevel = 'rubric' + rubricLevel1[rub]['level'];
                                        rubricDescp = rubricLevel1[rub]['description'];
                                        rubricAlg = rubricLevel1[rub]['level'] + 'Algorithm';
                                        rubricExp = rubricLevel1[rub]['expression']
                                        rubricObj[rubricLevel] = rubricDescp;
                                        rubricObj[rubricAlg] = rubricExp
                                        // rubricArr.push(rubricObj)
                                    }
                                    criteriaObj = {
                                        name: datacriteriaInfo[0].name,
                                        externalId: datacriteriaInfo[0].externalId,
                                        rubric: rubricObj
                                    }
                                    criteriaArr.push(criteriaObj)
                                }
                                themepushObj['criteria'] = criteriaArr
                                subthemeArr.push(themepushObj)
                            }

                        }
                        subThemeLabel = dataFrameworkInfo[0].themes[i].children[0].label
                        resultTheme[subThemeLabel] = subthemeArr;
                    } else if (Array.isArray(dataFrameworkInfo[0].themes[i].criteria) == true) {
                        criteriaLen = dataFrameworkInfo[0].themes[i].criteria.length;
                        for (var k = 0; k < criteriaLen; k++) {
                            criteriaId = dataFrameworkInfo[0].themes[i].criteria[k];
                            let datacriteriaInfo = await model.getCriteriaInfo(criteriaId)
                            rubricLevel1 = datacriteriaInfo[0].rubric.levels
                            var rubricArr = new Array()
                            var rubricObj = {}
                            for (var rub in rubricLevel1) {
                                rubricLevel = 'rubric' + rubricLevel1[rub]['level'];
                                rubricDescp = rubricLevel1[rub]['description'];
                                rubricAlg = rubricLevel1[rub]['level'] + 'Algorithm';
                                rubricExp = rubricLevel1[rub]['expression']
                                rubricObj[rubricLevel] = rubricDescp;
                                rubricObj[rubricAlg] = rubricExp
                                // rubricArr.push(rubricObj)
                            }
                            criteriaObj = {
                                name: datacriteriaInfo[0].name,
                                externalId: datacriteriaInfo[0].externalId,
                                rubric: rubricObj
                            }
                            criteriaArr.push(criteriaObj)
                        }
                        resultTheme['criteria'] = criteriaArr
                    }
                    resTheme.push(resultTheme)
                }
                if (reportType == "json") {
                    resFramework.statusCode = 200
                    resFramework.send(resTheme)
                } else if (reportType == "csv") {
                    resFramework.statusCode = 200
                    if (Array.isArray(dataFrameworkInfo[0].themes[0].children[0].children) == true) {
                        if (Array.isArray(dataFrameworkInfo[0].themes[0].children[0].children[0].criteria) == true) {
                            var keys = Object.keys(resTheme[0])
                            if (typeof (resTheme[0][keys[2]]) == "object") {
                                var keys1 = Object.keys(resTheme[0][keys[2]][0])
                                if (typeof (resTheme[0][keys[2]][0][keys1[2]]) == "object") {
                                    var keys2 = Object.keys(resTheme[0][keys[2]][0][keys1[2]][0])
                                    if (typeof (resTheme[0][keys[2]][0][keys1[2]][0][keys2[2]]) == "object") {
                                        var keys3 = Object.keys(resTheme[0][keys[2]][0][keys1[2]][0][keys2[2]][0])
                                        if (typeof (resTheme[0][keys[2]][0][keys1[2]][0][keys2[2]][0][keys3[2]]) == "object") {
                                            var keys4 = Object.keys(resTheme[0][keys[2]][0][keys1[2]][0][keys2[2]][0][keys3[2]])
                                        }
                                    }
                                }
                            }
                            const fields = [keys[0], keys[1], { label: keys[2] + keys1[0], value: keys[2] + '.' + keys1[0] }, { label: keys[2] + keys1[1], value: keys[2] + '.' + keys1[1] }, { label: keys1[2] + keys2[0], value: keys[2] + '.' + keys1[2] + '.' + keys2[0] }, { label: keys1[2] + keys2[1], value: keys[2] + '.' + keys1[2] + '.' + keys2[1] }, { label: keys2[2] + keys3[0], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[0] }, { label: keys2[2] + keys3[1], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[1] }, { label: keys4[0], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[2] + '.' + keys4[0] }, { label: keys4[1], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[2] + '.' + keys4[1] }, { label: keys4[2], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[2] + '.' + keys4[2] }, { label: keys4[3], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[2] + '.' + keys4[3] }, { label: keys4[4], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[2] + '.' + keys4[4] }, { label: keys4[5], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[2] + '.' + keys4[5] }, { label: keys4[6], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[2] + '.' + keys4[6] }, { label: keys4[7], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[2] + '.' + keys4[7] }];
                            const json2csvParser = new Parser({ fields, unwind: [keys[2], keys[2] + '.' + keys1[2], keys[2] + '.' + keys1[2] + '.' + keys2[2], keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[2]] });
                            const csv = json2csvParser.parse(resTheme);
                            resFramework.send(csv)
                        }
                    }
                    else if (Array.isArray(dataFrameworkInfo[0].themes[0].children) == true) {
                        if (Array.isArray(dataFrameworkInfo[0].themes[0].children[0].criteria) == true) {
                            var keys = Object.keys(resTheme[0])
                            if (typeof (resTheme[0][keys[2]]) == "object") {
                                var keys1 = Object.keys(resTheme[0][keys[2]][0])
                                if (typeof (resTheme[0][keys[2]][0][keys1[2]]) == "object") {
                                    var keys2 = Object.keys(resTheme[0][keys[2]][0][keys1[2]][0])
                                    if (typeof (resTheme[0][keys[2]][0][keys1[2]][0][keys2[2]]) == "object") {
                                        var keys3 = Object.keys(resTheme[0][keys[2]][0][keys1[2]][0][keys2[2]])
                                    }
                                }
                            }
                            const fields = [keys[0], keys[1], { label: keys[2] + keys1[0], value: keys[2] + '.' + keys1[0] }, { label: keys[2] + keys1[1], value: keys[2] + '.' + keys1[1] }, { label: keys1[2] + keys2[0], value: keys[2] + '.' + keys1[2] + '.' + keys2[0] }, { label: keys1[2] + keys2[1], value: keys[2] + '.' + keys1[2] + '.' + keys2[1] }, { label: keys3[0], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[0] }, { label: keys3[1], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[1] }, { label: keys3[2], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[2] }, { label: keys3[3], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[3] }, { label: keys3[4], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[4] }, { label: keys3[5], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[5] }, { label: keys3[6], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[6] }, { label: keys3[7], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] + '.' + keys3[7] }];
                            const json2csvParser = new Parser({ fields, unwind: [keys[2], keys[2] + '.' + keys1[2], keys[2] + '.' + keys1[2] + '.' + keys2[2]] });
                            const csv = json2csvParser.parse(resTheme);
                            resFramework.send(csv)
                        }
                    } else if (Array.isArray(dataFrameworkInfo[0].themes) == true) {
                        if (Array.isArray(dataFrameworkInfo[0].themes[0].criteria) == true) {
                            var keys = Object.keys(resTheme[0])
                            if (typeof (resTheme[0][keys[2]]) == "object") {
                                var keys1 = Object.keys(resTheme[0][keys[2]][0])
                                if (typeof (resTheme[0][keys[2]][0][keys1[2]]) == "object") {
                                    var keys2 = Object.keys(resTheme[0][keys[2]][0][keys1[2]])
                                }
                            }
                            const fields = [keys[0], keys[1], { label: keys[2] + keys1[0], value: keys[2] + '.' + keys1[0] }, { label: keys[2] + keys1[1], value: keys[2] + '.' + keys1[1] }, { label: keys2[0], value: keys[2] + '.' + keys1[2] + '.' + keys2[0] }, { label: keys2[1], value: keys[2] + '.' + keys1[2] + '.' + keys2[1] }, { label: keys2[2], value: keys[2] + '.' + keys1[2] + '.' + keys2[2] }, { label: keys2[3], value: keys[2] + '.' + keys1[2] + '.' + keys2[3] }, { label: keys2[4], value: keys[2] + '.' + keys1[2] + '.' + keys2[4] }, { label: keys2[5], value: keys[2] + '.' + keys1[2] + '.' + keys2[5] }, { label: keys2[6], value: keys[2] + '.' + keys1[2] + '.' + keys2[6] }, { label: keys2[7], value: keys[2] + '.' + keys1[2] + '.' + keys2[7] }];
                            const json2csvParser = new Parser({ fields, unwind: [keys[2], keys[2] + '.' + keys1[2]] });
                            const csv = json2csvParser.parse(resTheme);
                            resFramework.send(csv)
                        }
                    }
                }
            })
            .catch(function (errFrameworkInfo) {
                console.log("Error in getting Framework Info");
                throw errFrameworkInfo;
            })
    },

    //get dcpcr report card Info
    getReportInfo: async function (reqReportInfo, resReportInfo) {
        if (!reqReportInfo.query.programId && !reqReportInfo.query.reportType) {
            resReportInfo.statusCode = 404
            resReportInfo.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "query string programId and reportType is required field"
                    }
                }
            })
        }
        programId = reqReportInfo.query.programId
        reportType = reqReportInfo.query.reportType

        if (reqReportInfo.files) {
            schoolIdsFileData = reqReportInfo.files.schoolIds.data.toString('utf8')
            schoolIdsFileData1 = schoolIdsFileData.split('\n').slice(1)
            let dataSdiSubmissions = await model.getDcpcrSchoolInfoArr(programId, schoolIdsFileData1)
            // .then(function (dataSdiSubmissions) {
            var sudmissionsLen = dataSdiSubmissions.length
            var resSchoolArr = new Array()
            for (var i = 0; i < sudmissionsLen; i++) {
                var resSchoolObj = {}
                schoolId = dataSdiSubmissions[i].entityInformation.externalId
                schoolName = dataSdiSubmissions[i].entityInformation.name
                schoolAdministration = dataSdiSubmissions[i].entityInformation.administration
                schoolScore = dataSdiSubmissions[i].schoolScore
                if (typeof (schoolScore) == 'number') {
                    schoolScore1 = schoolScore.toFixed(2)
                } else if (typeof (schoolScore) == 'string') {
                    schoolScore1 = schoolScore
                }
                resSchoolObj['entityId'] = schoolId
                resSchoolObj['entityName'] = schoolName
                resSchoolObj['administrationType'] = schoolAdministration
                resSchoolObj['sdiIndex'] = dataSdiSubmissions[i].schoolLevel
                resSchoolObj['sdiScore'] = schoolScore1
                themeLen = dataSdiSubmissions[i].theme.length
                var resThemeArr = new Array()
                for (var j = 0; j < themeLen; j++) {
                    var themeObj = {}
                    themeScore = dataSdiSubmissions[i].theme[j].themeScore
                    if (typeof (themeScore) == 'number') {
                        themeScore1 = themeScore.toFixed(2)
                    } else if (typeof (themeScore) == 'string') {
                        themeScore1 = themeScore
                    }
                    themeObj['name'] = dataSdiSubmissions[i].theme[j].name
                    themeObj['index'] = dataSdiSubmissions[i].theme[j].themeLevel
                    themeObj['score'] = themeScore1
                    childrenLen = dataSdiSubmissions[i].theme[j].children.length;
                    var criteriaArr = new Array()
                    for (var k = 0; k < childrenLen; k++) {
                        subChildrenLen = dataSdiSubmissions[i].theme[j].children[k].children.length
                        for (var l = 0; l < subChildrenLen; l++) {
                            criteriaLen = dataSdiSubmissions[i].theme[j].children[k].children[l].criteria.length
                            if (criteriaLen != 0) {
                                for (var m = 0; m < criteriaLen; m++) {
                                    if (Object.keys(dataSdiSubmissions[i].theme[j].children[k].children[l].criteria[m]).length != 0) {
                                        var criteriaObj = {}
                                        criteriaObj['name'] = dataSdiSubmissions[i].theme[j].children[k].children[l].criteria[m].name
                                        criteriaObj['level'] = dataSdiSubmissions[i].theme[j].children[k].children[l].criteria[m].score
                                        criteriaObj['score'] = dataSdiSubmissions[i].theme[j].children[k].children[l].criteria[m].weight
                                        criteriaArr.push(criteriaObj)
                                    }
                                }
                            }
                        }
                    }
                    themeObj['criteria'] = criteriaArr
                    resThemeArr.push(themeObj)
                }
                resSchoolObj['theme'] = resThemeArr
                resSchoolArr.push(resSchoolObj)
            }
            // console.log(resSchoolArr)
            if (reportType == 'json') {
                resReportInfo.statusCode = 200
                resReportInfo.send(resSchoolArr)
            } else if (reportType == 'csv') {
                resReportInfo.statusCode = 200
                const fields = ['entityId', 'entityName', 'administrationType', 'sdiIndex', 'sdiScore', { label: 'themeName', value: 'theme.name' }, { label: 'themeIndex', value: 'theme.index' }, { label: 'themeScore', value: 'theme.score' }, { label: 'criteriaName', value: 'theme.criteria.name' }, { label: 'criteriaLevel', value: 'theme.criteria.level' }, { label: 'criteriaWeight', value: 'theme.criteria.score' }];
                const json2csvParser = new Parser({ fields, unwind: ['theme', 'theme.criteria'] });
                const csv = json2csvParser.parse(resSchoolArr);
                resReportInfo.send(csv)
            }
            // })
            // .catch(function (errSdiSubmissions) {
            //     console.log("Error in getting sdiSubmissions Information")
            //     throw errSdiSubmissions
            // })
        } else {
            let dataSdiSubmissions = await model.getDcpcrAllSchoolInfo(programId)
            // .then(function (dataSdiSubmissions) {
            var sudmissionsLen = dataSdiSubmissions.length
            var resSchoolArr = new Array()
            for (var i = 0; i < sudmissionsLen; i++) {
                var resSchoolObj = {}
                schoolId = dataSdiSubmissions[i].entityInformation.externalId
                schoolName = dataSdiSubmissions[i].entityInformation.name
                schoolAdministration = dataSdiSubmissions[i].entityInformation.administration
                schoolScore = dataSdiSubmissions[i].schoolScore
                if (typeof (schoolScore) == 'number') {
                    schoolScore1 = schoolScore.toFixed(2)
                } else if (typeof (schoolScore) == 'string') {
                    schoolScore1 = schoolScore
                }
                resSchoolObj['entityId'] = schoolId
                resSchoolObj['entityName'] = schoolName
                resSchoolObj['administrationType'] = schoolAdministration
                resSchoolObj['sdiIndex'] = dataSdiSubmissions[i].schoolLevel
                resSchoolObj['sdiScore'] = schoolScore1
                themeLen = dataSdiSubmissions[i].theme.length
                var resThemeArr = new Array()
                for (var j = 0; j < themeLen; j++) {
                    var themeObj = {}
                    themeScore = dataSdiSubmissions[i].theme[j].themeScore
                    if (typeof (themeScore) == 'number') {
                        themeScore1 = themeScore.toFixed(2)
                    } else if (typeof (themeScore) == 'string') {
                        themeScore1 = themeScore
                    }
                    themeObj['name'] = dataSdiSubmissions[i].theme[j].name
                    themeObj['index'] = dataSdiSubmissions[i].theme[j].themeLevel
                    themeObj['score'] = themeScore1
                    childrenLen = dataSdiSubmissions[i].theme[j].children.length;
                    var criteriaArr = new Array()
                    for (var k = 0; k < childrenLen; k++) {
                        subChildrenLen = dataSdiSubmissions[i].theme[j].children[k].children.length
                        for (var l = 0; l < subChildrenLen; l++) {
                            criteriaLen = dataSdiSubmissions[i].theme[j].children[k].children[l].criteria.length
                            if (criteriaLen != 0) {
                                for (var m = 0; m < criteriaLen; m++) {
                                    if (Object.keys(dataSdiSubmissions[i].theme[j].children[k].children[l].criteria[m]).length != 0) {
                                        var criteriaObj = {}
                                        criteriaObj['name'] = dataSdiSubmissions[i].theme[j].children[k].children[l].criteria[m].name
                                        criteriaObj['level'] = dataSdiSubmissions[i].theme[j].children[k].children[l].criteria[m].score
                                        criteriaObj['score'] = dataSdiSubmissions[i].theme[j].children[k].children[l].criteria[m].weight
                                        criteriaArr.push(criteriaObj)
                                    }
                                }
                            }
                        }
                    }
                    themeObj['criteria'] = criteriaArr
                    resThemeArr.push(themeObj)
                }
                resSchoolObj['theme'] = resThemeArr
                resSchoolArr.push(resSchoolObj)
            }
            // console.log(resSchoolArr)
            if (reportType == 'json') {
                console.log(resSchoolArr.length)
                resReportInfo.statusCode = 200
                resReportInfo.send(resSchoolArr)
            } else if (reportType == 'csv') {
                resReportInfo.statusCode = 200
                const fields = ['entityId', 'entityName', 'administrationType', 'sdiIndex', 'sdiScore', { label: 'themeName', value: 'theme.name' }, { label: 'themeIndex', value: 'theme.index' }, { label: 'themeScore', value: 'theme.score' }, { label: 'criteriaName', value: 'theme.criteria.name' }, { label: 'criteriaLevel', value: 'theme.criteria.level' }, { label: 'criteriaWeight', value: 'theme.criteria.score' }];
                const json2csvParser = new Parser({ fields, unwind: ['theme', 'theme.criteria'] });
                const csv = json2csvParser.parse(resSchoolArr);
                resReportInfo.send(csv)
            }
            // })
            // .catch(function (errSdiSubmissions) {
            //     console.log("Error in getting sdiSubmissions Information")
            //     throw errSdiSubmissions
            // })
        }
    },

    getCriteriaQuestions: async function (reqCriteria, resCriteria) {
        try {
            programId = reqCriteria.query.programId
            reportType = reqCriteria.query.reportType
            dataSubmissions = await model.getSubmissionInfo(programId)
            submissionLen = dataSubmissions.length
            for (var i = 0; i < submissionLen; i++) {
                criteriaLen = dataSubmissions[i].criterias.length
                var resCriteriaArr = new Array()
                for (var j = 0; j < criteriaLen; j++) {
                    var resCriteriaObj = {}
                    criteriaId = dataSubmissions[i].criterias[j].externalId
                    criteriaInfo = await model.getCriteriaInfo(criteriaId)
                    evidencesLen = criteriaInfo[0].evidences.length
                    for (var k = 0; k < evidencesLen; k++) {
                        console.log(criteriaInfo[0].evidences[k].sections)
                    }
                }
                console.log(i)
            }
        } catch (errSubmissions) {
            console.log("Error in getting SubmissionInfo")
            throw errSubmissions;
        }
    }
}
