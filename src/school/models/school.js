var db = require('../../mongo/db');
var ObjectId = require('mongodb').ObjectId;
var logger = require('../../utils/logger');

module.exports = {
    // get all school info
    getAllSchoolInfo: function (programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').find({'program.externalId':programId}).toArray(function (errGetAllSchool, getAllSchoolInfoDocs) {
                if (errGetAllSchool) {
                    reject(errGetAllSchool)
                } else {
                    resolve(getAllSchoolInfoDocs)
                }
            })
        })
    },

    // get specific(>=1) school info
    getSchoolInfoSpecific: function (querySchool,programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').find({ $and: [ {'schoolInformation.externalId':querySchool},{'program.externalId':programId}] }).toArray(function (errSpecificSchool, getSpecificSchoolDocs) {
                if (errSpecificSchool) {
                    reject(errSpecificSchool)
                } else {
                    getSpecificSchoolDocs[0].schoolInformation.sdiLevel = getSpecificSchoolDocs[0].schoolLevel
                    resolve(getSpecificSchoolDocs[0])
                }
            })
        })
    },

    //get unique value of gender column from schoolInfo 
    getSchoolFilterByGender: function (programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').distinct('schoolInformation.gender',{'program.externalId':programId}, function (errSchoolGender, getSchoolGenderDocs) {
                if (errSchoolGender) {
                    reject(errSchoolGender)
                } else {
                    resolve(getSchoolGenderDocs)
                }
            })
        })
    },

    //get unique value of administration column from schoolInfo
    getSchoolFilterByAdmin: function (programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').distinct('schoolInformation.administration',{'program.externalId':programId}, function (errSchoolAdmin, getSchoolAdminDocs) {
                if (errSchoolAdmin) {
                    reject(errSchoolAdmin)
                } else {
                    resolve(getSchoolAdminDocs)
                }
            })
        })
    },

    //get unique value of districtName column from schoolInfo
    getSchoolFilterByDistrict: function (programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').distinct('schoolInformation.districtName',{'program.externalId':programId}, function (errSchoolDistrict, getSchoolDistrictDocs) {
                if (errSchoolDistrict) {
                    reject(errSchoolDistrict)
                } else {
                    resolve(getSchoolDistrictDocs)
                }
            })
        })
    },

    //search school by Text 
    getSchoolBySearchText: function (searchText,programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').find({ $and: [ {$text: { $search: searchText}},{'program.externalId':programId}]}, { "schoolInformation.name": 1, "schoolInformation.externalId": 1, _id: 0 }).toArray(function (errSearchText, getSearchTextDocs) {
                if (errSearchText) {
                    reject(errSearchText)
                } else {
                    resolve(getSearchTextDocs)
                }
            })
        })
    },

    //calculation of no of schools to the DCPCR program
    getProgramMetricsSchoolCount: function (programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').find({ 'program.externalId': programId }).toArray(function (errDcpcrProgram, getDcpcrProgramDocs) {
                if (errDcpcrProgram) {
                    reject(errDcpcrProgram)
                } else {
                    resolve(getDcpcrProgramDocs)
                }
            })
        })
    },

    //calculation of no of government schools
    getGovSchools: function (programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').find({ $and: [ {'schoolInformation.administration': { '$regex': '^government$', '$options': 'i' }},{'program.externalId':programId}] }).toArray(function (errGovSchool, getGovSchoolsDocs) {
                if (errGovSchool) {
                    reject(errGovSchool)
                } else {
                    resolve(getGovSchoolsDocs)
                }
            })
        })
    },

    //calculation of no of private schools
    getPrivateSchools: function (programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').find({ $and: [{ 'schoolInformation.administration': { '$regex': 'unaided', '$options': 'i' } },{'program.externalId':programId}] }).toArray(function (errPrivSchools, getPrivSchoolsDocs) {
                if (errPrivSchools) {
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
    getSchoolInfoDelhi: function (programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened').find({ "$and": [{ "program.externalId": programId }, { 'schoolInformation.state': { '$regex': 'delhi', '$options': 'i' } }] }).toArray(function (errSchoolDelhi, getSchoolDelhiDocs) {
                if (errSchoolDelhi) {
                    reject(errSchoolDelhi)
                } else {
                    resolve(getSchoolDelhiDocs)
                }
            })
        })
    },

    //get Framework Info
    getFrameworkInfo: function (frameworkId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('evaluationFrameworks').find({ "externalId": frameworkId }).toArray(function (errFrameworkInfo, getFrameworkInfo) {
                if (errFrameworkInfo) {
                    reject(errFrameworkInfo)
                } else {
                    resolve(getFrameworkInfo)
                }
            })
        })
    },

    //get Criteria Info
    getCriteriaInfo: function (criteriaId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('criteria').find({ "_id": ObjectId(criteriaId) }).toArray(function (errcriteriaInfo, getcriteriaInfo) {
                if (errcriteriaInfo) {
                    reject(errcriteriaInfo)
                } else {
                    resolve(getcriteriaInfo)
                }
            })
        })
    }
}