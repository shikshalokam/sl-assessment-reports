var express = require('express');
var router = express.Router();
var model = require('../models/school')
var logger = require('../../utils/logger');
var deasync = require('deasync');
module.exports = {

    //get All school or >=1 school Info API
    getAllSchoolInfo: async function (reqschoolinfo, resschoolinfo) {
        if (!reqschoolinfo.body.request) {
            resschoolinfo.statusCode = 404
            resschoolinfo.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "request object is a required field in requestBody"
                    }
                }
            })
        }
        if (!reqschoolinfo.body.request.filters) {
            resschoolinfo.statusCode = 404
            resschoolinfo.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "request.filter object is a required field in requestBody"
                    }
                }
            })
        }
        if (!reqschoolinfo.body.request.filters.schoolId) {
            resschoolinfo.statusCode = 404
            resschoolinfo.send({
                responseCode: "NOT FOUND",
                result: {
                    response: {
                        message: "request.filter.schoolId object is a required field in requestBody"
                    }
                }
            })
        }

        // check if schoolId entered is array or not
        if (Array.isArray(reqschoolinfo.body.request.filters.schoolId) == true) {
            //check if schoolId array length is equal to 0
            if ((reqschoolinfo.body.request.filters.schoolId).length == 0) {
                //get all SchoolInfo from mongodb collection
                model.getAllSchoolInfo()
                    .then(function (dataallschool) {
                        var schoolAllArray = new Array();
                        for (var i = 0; i < dataallschool.length; i++) {
                            schoolArrGetallInfo = {
                                externalId: dataallschool[i].schoolInformation.externalId,
                                name: dataallschool[i].schoolInformation.name,
                                sdiLevel: dataallschool[i].schoolLevel,
                                totalBoys: dataallschool[i].schoolInformation.totalBoys,
                                highestGrade: dataallschool[i].schoolInformation.highestGrade,
                                totalGirls: dataallschool[i].schoolInformation.totalGirls,
                                phone: dataallschool[i].schoolInformation.phone,
                                // emailId : emailId,
                                addressLine1: dataallschool[i].schoolInformation.addressLine1,
                                state: dataallschool[i].schoolInformation.state,
                                principalName: dataallschool[i].schoolInformation.principalName,
                                administration: dataallschool[i].schoolInformation.administration,
                                gender: dataallschool[i].schoolInformation.gender,
                                lowestGrade: dataallschool[i].schoolInformation.lowestGrade,
                                pincode: dataallschool[i].schoolInformation.pincode,
                                // emailId2 : emailId2,
                                country: dataallschool[i].schoolInformation.country,
                                districtName: dataallschool[i].schoolInformation.districtName,
                                gpsLocation: dataallschool[i].schoolInformation.gpsLocation,
                                addressLine2: dataallschool[i].schoolInformation.addressLine2,
                                // schoolNo : schoolNo,
                                districtId: dataallschool[i].schoolInformation.districtId,
                                city: dataallschool[i].schoolInformation.city,
                                zoneId: dataallschool[i].schoolInformation.zoneId,
                                shift: dataallschool[i].schoolInformation.shift,
                                totalStudents: dataallschool[i].schoolInformation.totalStudents
                            }
                            schoolAllArray.push(schoolArrGetallInfo)
                        }
                        resschoolinfo.statusCode = 200;
                        if (resschoolinfo.statusCode == 200) {
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
                        resschoolinfo.send(resultdataAllSchoolInfo)
                    })
                    .catch(function (err) {
                        console.log("Error in getting All School Information")
                        throw err;
                    })
            }
            // get schoolInfo for particular schoolId entered in an req.body schoolId array
            else if ((reqschoolinfo.body.request.filters.schoolId).length > 0) {
                querySchool = reqschoolinfo.body.request.filters.schoolId
                var schoolSpecificInfo = new Array()
                for (var i = 0; i < querySchool.length; i++) {
                    //check if schooId is number or not
                    if (isNaN(querySchool[i]) == false) {
                        try {
                            //get Particular School Info for given schoolId
                            let dataSpecificSchool = await model.getSchoolInfoSpecific(querySchool[i]);
                            if (dataSpecificSchool != undefined) {
                                schooldataSpecificInfo = {
                                    externalId: dataSpecificSchool.externalId,
                                    name: dataSpecificSchool.name,
                                    sdiLevel: dataSpecificSchool.sdiLevel,
                                    totalBoys: dataSpecificSchool.totalBoys,
                                    highestGrade: dataSpecificSchool.highestGrade,
                                    totalGirls: dataSpecificSchool.totalGirls,
                                    phone: dataSpecificSchool.phone,
                                    // emailId : emailId,
                                    addressLine1: dataSpecificSchool.addressLine1,
                                    state: dataSpecificSchool.state,
                                    principalName: dataSpecificSchool.principalName,
                                    administration: dataSpecificSchool.administration,
                                    gender: dataSpecificSchool.gender,
                                    lowestGrade: dataSpecificSchool.lowestGrade,
                                    pincode: dataSpecificSchool.pincode,
                                    // emailId2 : emailId2,
                                    country: dataSpecificSchool.country,
                                    districtName: dataSpecificSchool.districtName,
                                    gpsLocation: dataSpecificSchool.gpsLocation,
                                    addressLine2: dataSpecificSchool.addressLine2,
                                    // schoolNo : schoolNo,
                                    districtId: dataSpecificSchool.districtId,
                                    city: dataSpecificSchool.city,
                                    zoneId: dataSpecificSchool.zoneId,
                                    shift: dataSpecificSchool.shift,
                                    totalStudents: dataSpecificSchool.totalStudents
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
                        resschoolinfo.statusCode = 400
                        resschoolinfo.send({
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
                resschoolinfo.statusCode = 200;
                if (resschoolinfo.statusCode == 200) {
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
                resschoolinfo.send(resultdataSpecificSchool)
            }
        }
        else {
            resultdataSpecificSchool.statusCode = 400
            resultdataSpecificSchool.send({
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
        var schoolGender = new Array();
        var schoolAdmin = new Array();
        var schoolDistrict = new Array();
        //get gender info from mongodb collection
        model.getSchoolFilterByGender()
            .then(function (dataSchoolGender) {
                for (var i = 0; i < dataSchoolGender.length; i++) {
                    if (dataSchoolGender[i] != '') {
                        var schoolGenderObj = { "name": dataSchoolGender[i], "value": dataSchoolGender[i] }
                        schoolGender.push(schoolGenderObj)
                    }
                }
                //get administration info from mongodb collection
                model.getSchoolFilterByAdmin()
                    .then(function (dataSchoolAdmin) {
                        for (var i = 0; i < dataSchoolAdmin.length; i++) {
                            if (dataSchoolAdmin[i] != '') {
                                var schoolAdminObj = { "name": dataSchoolAdmin[i], "value": dataSchoolAdmin[i] }
                                schoolAdmin.push(schoolAdminObj)
                            }
                        }
                        //get district info from mongodb collection
                        model.getSchoolFilterByDistrict()
                            .then(function (dataSchoolDistrict) {
                                for (var i = 0; i < dataSchoolDistrict.length; i++) {
                                    if (dataSchoolDistrict[i] != '') {
                                        var schoolDistrictObj = { "name": dataSchoolDistrict[i], "value": dataSchoolDistrict[i] }
                                        schoolDistrict.push(schoolDistrictObj)
                                    }
                                }
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
        if (!reqSearchText.body.request) {
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
            model.getSchoolBySearchText(searchText)
                .then(function (dataSearchText) {
                    var schoolSearchArr = new Array();
                    for (var i = 0; i < dataSearchText.length; i++) {
                        resultSearchTextObj = {
                            externalId: dataSearchText[i].schoolInformation.externalId,
                            name: dataSearchText[i].schoolInformation.name
                        }
                        schoolSearchArr.push(resultSearchTextObj)
                    }
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
                for (var i = 0; i < dataProgramMetrics.length; i++) {
                    //total number of schools for this programId
                    if (dataProgramMetrics[i].schoolInformation.externalId) {
                        totalschoolcount = totalschoolcount + 1;
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

                    //"Community and Participation" theme rating calculation
                    if (isNaN(dataProgramMetrics[i].theme[2].themeLevel) == false && dataProgramMetrics[i].theme[2].name == "Community Participation and EWS/DG Integration ") {
                        //if theme rating is 4 -> count the number of schools which has rating 4
                        if (dataProgramMetrics[i].theme[2].themeLevel == 4) {
                            themeCommunityLevel4 = themeCommunityLevel4 + 1;
                        }
                        //if theme rating is 3 -> count the number of schools which has rating 3
                        else if (dataProgramMetrics[i].theme[2].themeLevel == 3) {
                            themeCommunityLevel3 = themeCommunityLevel3 + 1;
                        }
                        //if theme rating is 2 -> count the number of schools which has rating 2
                        else if (dataProgramMetrics[i].theme[2].themeLevel == 2) {
                            themeCommunityLevel2 = themeCommunityLevel2 + 1;
                        }
                        //if theme rating is 1 -> count the number of schools which has rating 1
                        else if (dataProgramMetrics[i].theme[2].themeLevel == 1) {
                            themeCommunityLevel1 = themeCommunityLevel1 + 1;
                        }
                    }
                }
                sdiLevelCalcArr.push(sdiLevel3)
                sdiLevelCalcArr.push(sdiLevel2)
                sdiLevelCalcArr.push(sdiLevel4)
                sdiLevelCalcArr.push(sdiLevel1)
                //calculation average sdiLevel
                avgSdiScore = (sdiLevel4 + sdiLevel3 + sdiLevel2 + sdiLevel1) / totalschoolcount;

                //first highest sdiLevel
                firsthighestSdiLevel = Math.max.apply(null, sdiLevelCalcArr);
                sdiLevelCalcArr.splice(sdiLevelCalcArr.indexOf(firsthighestSdiLevel), 1);
                //second highest sdiLevel
                secondhighestSdiLevel = Math.max.apply(null, sdiLevelCalcArr);

                //fisrthighest Theme Levels
                firsthighestSafetyLevel = Math.max(themeSafetyLevel4, themeSafetyLevel3, themeSafetyLevel2, themeSafetyLevel1)
                firsthighestTeachingLevel = Math.max(themeTeachingLevel4, themeTeachingLevel3, themeTeachingLevel2, themeTeachingLevel1)
                firsthighestCommunityLevel = Math.max(themeCommunityLevel4, themeCommunityLevel3, themeCommunityLevel2, themeCommunityLevel1)

                //setting level numbers
                if (firsthighestSafetyLevel == themeSafetyLevel4) {
                    firsthighestThemeSafetyLevel = 4;
                }
                else if (firsthighestSafetyLevel == themeSafetyLevel3) {
                    firsthighestThemeSafetyLevel = 3;
                }
                else if (firsthighestSafetyLevel == themeSafetyLevel2) {
                    firsthighestThemeSafetyLevel = 2;
                }
                else if (firsthighestSafetyLevel == themeSafetyLevel1) {
                    firsthighestThemeSafetyLevel = 1;
                }

                if (firsthighestTeachingLevel == themeTeachingLevel4) {
                    firsthighestThemeTeachingLevel = 4;
                }
                else if (firsthighestTeachingLevel == themeTeachingLevel3) {
                    firsthighestThemeTeachingLevel = 3;
                }
                else if (firsthighestTeachingLevel == themeTeachingLevel2) {
                    firsthighestThemeTeachingLevel = 2;
                }
                else if (firsthighestTeachingLevel == themeTeachingLevel1) {
                    firsthighestThemeTeachingLevel = 1;
                }

                if (firsthighestCommunityLevel == themeCommunityLevel4) {
                    firsthighestThemeCommmunityLevel = 4;
                }
                else if (firsthighestCommunityLevel == themeCommunityLevel3) {
                    firsthighestThemeCommunityLevel = 3;
                }
                else if (firsthighestCommunityLevel == themeCommunityLevel2) {
                    firsthighestThemeCommunityLevel = 2;
                }
                else if (firsthighestCommunityLevel == themeCommunityLevel1) {
                    firsthighestThemeCommunityLevel = 1;
                }

                if (firsthighestSdiLevel == sdiLevel4) {
                    firsthighSchoolLevel = 4;
                }
                else if (firsthighestSdiLevel == sdiLevel3) {
                    firsthighSchoolLevel = 3;
                }
                else if (firsthighestSdiLevel == sdiLevel2) {
                    firsthighSchoolLevel = 2;
                }
                else if (firsthighestSdiLevel == sdiLevel1) {
                    firsthighSchoolLevel = 1;
                }

                if (secondhighestSdiLevel == sdiLevel4) {
                    secondhighSchoolLevel = 4;
                }
                else if (secondhighestSdiLevel == sdiLevel3) {
                    secondhighSchoolLevel = 3;
                }
                else if (secondhighestSdiLevel == sdiLevel2) {
                    secondhighSchoolLevel = 2;
                }
                else if (secondhighestSdiLevel == sdiLevel1) {
                    secondhighSchoolLevel = 1;
                }
                //get total number of government schools in mongodb collections
                model.getGovSchools()
                    .then(function (dataGovSchools) {
                        governmentSchools = dataGovSchools.length;
                        //get total number of private schools(All schools which has UnAided keyword) in mongodb collections
                        model.getPrivateSchools()
                            .then(function (dataPrivSchools) {
                                privateSchools = dataPrivSchools.length;
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
                                                totalSchools: totalschoolcount,
                                                governmentSchools: governmentSchools,
                                                privateSchools: privateSchools,
                                                avgSdiScore: avgSdiScore,
                                                highestSdi: firsthighSchoolLevel,
                                                secondHighestSdi: secondhighSchoolLevel,
                                                highestSafetyandSecurity: firsthighestThemeSafetyLevel,
                                                highestTeachingandLearning: firsthighestThemeTeachingLevel,
                                                highestCommunityandParticipation: firsthighestThemeCommunityLevel
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
                            schoolcountDistrict = dataDistrictInfo.length;
                            sumcountDistrictL1 = 0;
                            sumcountDistrictL2 = 0;
                            sumcountDistrictL3 = 0;
                            sumcountDistrictL4 = 0;
                            for (var j = 0; j < schoolcountDistrict; j++) {
                                if (isNaN(dataDistrictInfo[j].schoolLevel) == false) {
                                    if (dataDistrictInfo[j].schoolLevel == 1) {
                                        sumcountDistrictL1 = sumcountDistrictL1 + 1
                                    }
                                    else if (dataDistrictInfo[j].schoolLevel == 2) {
                                        sumcountDistrictL2 = sumcountDistrictL2 + 1
                                    }
                                    else if (dataDistrictInfo[j].schoolLevel == 3) {
                                        sumcountDistrictL3 = sumcountDistrictL3 + 1
                                    }
                                    else if (dataDistrictInfo[j].schoolLevel == 4) {
                                        sumcountDistrictL4 = sumcountDistrictL4 + 1
                                    }
                                }
                            }
                            districtwiseSdiSum = sumcountDistrictL1 + sumcountDistrictL2 + sumcountDistrictL3 + sumcountDistrictL4;
                            //calculate average of sdiLevel for each district
                            districtwiseSdiAvg = districtwiseSdiSum / schoolcountDistrict;
                            //calculate districtLevels Percentage
                            districtL1Perc = (sumcountDistrictL1 / schoolcountDistrict) * 100;
                            districtL2Perc = (sumcountDistrictL2 / schoolcountDistrict) * 100;
                            districtL3Perc = (sumcountDistrictL3 / schoolcountDistrict) * 100;
                            districtL4Perc = (sumcountDistrictL4 / schoolcountDistrict) * 100;
                            // districtL1Perc1 = districtL1Perc.toFixed(2)
                            // districtL4Perc1 = ParseInt(districtL4Perc.toFixed(2) + '%)
                            var districtRes = {
                                districtName: dataDistrictInfo[0].schoolInformation.districtName,
                                totalSchool: schoolcountDistrict,
                                avgSdiOfDistrict: districtwiseSdiAvg,
                                level1Percent: districtL1Perc,
                                level2Percent: districtL2Perc,
                                level3Percent: districtL3Perc,
                                level4Percent: districtL4Perc
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
                        delhischoolL1 = 0;
                        delhischoolL2 = 0;
                        delhischoolL3 = 0;
                        delhischoolL4 = 0;
                        for (var k = 0; k < dataWholeDelhi.length; k++) {
                            if (dataWholeDelhi[k].schoolInformation.districtName && dataWholeDelhi[k].schoolInformation.districtName != "" && isNaN(dataWholeDelhi[k].schoolLevel) == false) {
                                if (dataWholeDelhi[k].schoolLevel == 1) {
                                    delhischoolL1 = delhischoolL1 + 1;
                                }
                                else if (dataWholeDelhi[k].schoolLevel == 2) {
                                    delhischoolL2 = delhischoolL2 + 1;
                                }
                                else if (dataWholeDelhi[k].schoolLevel == 3) {
                                    delhischoolL3 = delhischoolL3 + 1;
                                }
                                else if (dataWholeDelhi[k].schoolLevel == 4) {
                                    delhischoolL4 = delhischoolL4 + 1
                                }
                            }
                        }
                        delhiL1Percent = (delhischoolL1 / dataWholeDelhi.length) * 100;
                        delhiL2Percent = (delhischoolL2 / dataWholeDelhi.length) * 100;
                        delhiL3Percent = (delhischoolL3 / dataWholeDelhi.length) * 100;
                        delhiL4Percent = (delhischoolL4 / dataWholeDelhi.length) * 100;
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
                                            level1Percent: delhiL1Percent,
                                            level2Percent: delhiL2Percent,
                                            level3Percent: delhiL3Percent,
                                            level4Percent: delhiL4Percent
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
    }
}
