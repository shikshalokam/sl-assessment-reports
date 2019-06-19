var db = require('../../mongo/db');
var ObjectId = require('mongodb').ObjectId;
var logger = require('../../utils/logger');

module.exports = {
    // get all school info
    getAllSchoolInfo: function (callback) {
        db.get().collection('sdiSchools1').find({}).toArray(function (err, getInfo) {
            callback(err, getInfo)
        })
    },

    // get specific(>=1) school info
    getSchoolInfoSpecific: function (querySchool) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchools1').find({ 'externalId': querySchool }).toArray(function (err, getInfo) {
                if (err) {
                    reject(err)
                } else {
                    resolve(getInfo)
                }
            })
        })
    },

    //get single school info by externalId
    getSingleSchoolInfo: function (externalId, callback) {
        db.get().collection('sdiSchools1').find({ 'externalId': externalId }).toArray(function (err, getInfo) {
            callback(err, getInfo)
        })
    },

    //get unique value of gender column from schoolInfo 
    getSchoolFilterByGender: function (callback) {
        db.get().collection('sdiSchools1').distinct('gender', function (err, docs) {
            callback(err, docs)
        })
    },

    //get unique value of administration column from schoolInfo
    getSchoolFilterByAdmin: function (callback) {
        db.get().collection('sdiSchools1').distinct('administration', function (err, docs) {
            callback(err, docs)
        })
    },

    //get unique value of districtName column from schoolInfo
    getSchoolFilterByDistrict: function (callback) {
        db.get().collection('sdiSchools1').distinct('districtName', function (err, docs) {
            callback(err, docs)
        })
    }
}