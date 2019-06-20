var db = require('../../mongo/db');
var ObjectId = require('mongodb').ObjectId;
var logger = require('../../utils/logger');

module.exports = {
    // get all school info
    getAllSchoolInfo: function (callback) {
        db.get().collection('sdiSchoolSubmissionsFlattened').find({}).toArray(function (err, getInfo) {
            callback(err, getInfo)
        })
    },

    // get specific(>=1) school info
    getSchoolInfoSpecific: function (querySchool) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').find({ 'schoolInformation.externalId': querySchool }).toArray(function (err, getInfo) {
                if (err) {
                    reject(err)
                } else {
                    getInfo[0].schoolInformation.sdiLevel = getInfo[0].schoolLevel
                    resolve(getInfo[0].schoolInformation)
                }
            })
        })
    },

    //get single school info by externalId
    getSingleSchoolInfo: function (externalId, callback) {
        db.get().collection('sdiSchoolSubmissionsFlattened').find({ 'schoolInformation.externalId': externalId }).toArray(function (err, getInfo) {
            callback(err, getInfo)
        })
    },

    //get unique value of gender column from schoolInfo 
    getSchoolFilterByGender: function (callback) {
        db.get().collection('sdiSchoolSubmissionsFlattened').distinct('schoolInformation.gender', function (err, docs) {
            callback(err, docs)
        })
    },

    //get unique value of administration column from schoolInfo
    getSchoolFilterByAdmin: function (callback) {
        db.get().collection('sdiSchoolSubmissionsFlattened').distinct('schoolInformation.administration', function (err, docs) {
            callback(err, docs)
        })
    },

    //get unique value of districtName column from schoolInfo
    getSchoolFilterByDistrict: function (callback) {
        db.get().collection('sdiSchoolSubmissionsFlattened').distinct('schoolInformation.districtName', function (err, docs) {
            callback(err, docs)
        })
    },

    //search school by Text 
    getSchoolBySearchText: function (searchText, callback) {
        db.get().collection('sdiSchoolSubmissionsFlattened').find({ $text: { $search: searchText } }, { "schoolInformation.name": 1, "schoolInformation.externalId": 1, _id: 0 }).toArray(function (err, getInfo) {
            callback(err, getInfo)
        })
    },

    //calculation of no of schools to the DCPCR program
    getProgramMetricsSchoolCount :function(programId , callback){
        db.get().collection('sdiSchoolSubmissionsFlattened').find({'program.externalId':programId}).toArray(function (err, getInfo) {
            callback(err,getInfo)
        })
    },

    //calculation of no of government schools
    getGovSchools : function(callback){
        db.get().collection('sdiSchoolSubmissionsFlattened').find({'schoolInformation.administration':{'$regex' : '^government$', '$options' : 'i'}}).toArray(function (err, getInfo) {
            callback(err,getInfo)
        })
    },

    //calculation of no of private schools
    getPrivateSchools : function(callback){
        db.get().collection('sdiSchoolSubmissionsFlattened').find({'schoolInformation.administration':{'$regex' : 'unaided', '$options' : 'i'}}).toArray(function(err,getInfo){
            callback(err,getInfo)
        })
    }
}