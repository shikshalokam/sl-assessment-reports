var db = require('../../mongo/db');
var ObjectId = require('mongodb').ObjectId;
var logger = require('../../utils/logger');

module.exports = {
    // get all school info
    getAllSchoolInfo: function () {
        return new Promise(function(resolve,reject){
            db.get().collection('sdiSchoolSubmissionsFlattened').find({}).toArray(function (errGetAllSchool, getAllSchoolInfoDocs) {
                if(errGetAllSchool){
                    reject(errGetAllSchool)
                } else {
                    resolve(getAllSchoolInfoDocs)
                }
            })
        })
    },

    // get specific(>=1) school info
    getSchoolInfoSpecific: function (querySchool) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').find({ 'schoolInformation.externalId': querySchool }).toArray(function (errSpecificSchool, getSpecificSchoolDocs) {
                if (errSpecificSchool) {
                    reject(errSpecificSchool)
                } else {
                    getSpecificSchoolDocs[0].schoolInformation.sdiLevel = getSpecificSchoolDocs[0].schoolLevel
                    resolve(getSpecificSchoolDocs[0].schoolInformation)
                }
            })
        })
    },

    //get unique value of gender column from schoolInfo 
    getSchoolFilterByGender: function () {
        return new Promise(function(resolve,reject){
            db.get().collection('sdiSchoolSubmissionsFlattened').distinct('schoolInformation.gender', function (errSchoolGender, getSchoolGenderDocs) {
                if(errSchoolGender){
                    reject(errSchoolGender)
                } else {
                    resolve(getSchoolGenderDocs)
                }
            })
        })
    },

    //get unique value of administration column from schoolInfo
    getSchoolFilterByAdmin: function () {
        return new Promise(function(resolve,reject){
            db.get().collection('sdiSchoolSubmissionsFlattened').distinct('schoolInformation.administration', function (errSchoolAdmin, getSchoolAdminDocs) {
                if(errSchoolAdmin){
                    reject(errSchoolAdmin)
                } else {
                    resolve(getSchoolAdminDocs)
                }
            })
        })
    },

    //get unique value of districtName column from schoolInfo
    getSchoolFilterByDistrict: function () {
        return new Promise(function(resolve,reject){
            db.get().collection('sdiSchoolSubmissionsFlattened').distinct('schoolInformation.districtName', function (errSchoolDistrict, getSchoolDistrictDocs) {
                if(errSchoolDistrict){
                    reject(errSchoolDistrict)
                } else {
                    resolve(getSchoolDistrictDocs)
                }
            })
        })
    },

    //search school by Text 
    getSchoolBySearchText: function (searchText) {
        return new Promise(function(resolve,reject){
            db.get().collection('sdiSchoolSubmissionsFlattened').find({ $text: { $search: searchText } }, { "schoolInformation.name": 1, "schoolInformation.externalId": 1, _id: 0 }).toArray(function (errSearchText, getSearchTextDocs) {
                if(errSearchText){
                    reject(errSearchText)
                } else {
                    resolve(getSearchTextDocs)
                }
            })
        })
    },

    //calculation of no of schools to the DCPCR program
    getProgramMetricsSchoolCount: function (programId) {
        return new Promise(function(resolve,reject){
            db.get().collection('sdiSchoolSubmissionsFlattened').find({ 'program.externalId': programId }).toArray(function (errDcpcrProgram, getDcpcrProgramDocs) {
                if(errDcpcrProgram){
                    reject(errDcpcrProgram)
                } else {
                    resolve(getDcpcrProgramDocs)
                }
            })
        })
    },

    //calculation of no of government schools
    getGovSchools: function () {
        return new Promise(function(resolve,reject){
            db.get().collection('sdiSchoolSubmissionsFlattened').find({ 'schoolInformation.administration': { '$regex': '^government$', '$options': 'i' } }).toArray(function (errGovSchool, getGovSchoolsDocs) {
                if(errGovSchool){
                    reject(errGovSchool)
                } else {
                    resolve(getGovSchoolsDocs)
                }
            })
        })
    },

    //calculation of no of private schools
    getPrivateSchools: function () {
        return new Promise(function(resolve,reject){
            db.get().collection('sdiSchoolSubmissionsFlattened').find({ 'schoolInformation.administration': { '$regex': 'unaided', '$options': 'i' } }).toArray(function (errPrivSchools, getPrivSchoolsDocs) {
                if(errPrivSchools){
                    reject(errPrivSchools)
                } else {
                    resolve(getPrivSchoolsDocs)
                }
            })
        })
    },

    //get distinct district name
    getDistinctDistrictName: function (programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').distinct('schoolInformation.districtName', { 'program.externalId': programId }, function (errUniqDistrict, getUniqDistrictDocs) {
                if (errUniqDistrict) {
                    reject(errUniqDistrict)
                } else {
                    resolve(getUniqDistrictDocs)
                }
            })
        })
    },

    //get single district info
    getSingleDistrictInfo: function (programId, districtName) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').find({ "$and": [{ "program.externalId": programId }, { "schoolInformation.districtName": districtName }] }).toArray(function (errSingleDistrict, getSingleDistrictDocs) {
                if (errSingleDistrict) {
                    reject(errSingleDistrict)
                } else {
                    resolve(getSingleDistrictDocs)
                }
            })
        })
    },

    //get school state = delhi
    getSchoolInfoDelhi : function(programId){
        return new Promise(function(resolve,reject){
            db.get().collection('sdiSchoolSubmissionsFlattened').find({"$and":[{"program.externalId":programId},{'schoolInformation.state': { '$regex': 'delhi', '$options': 'i' }}]}).toArray(function(errSchoolDelhi,getSchoolDelhiDocs){
                if(errSchoolDelhi){
                    reject(errSchoolDelhi)
                } else {
                    resolve(getSchoolDelhiDocs)
                }
            })
        })
    }
}