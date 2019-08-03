var db = require('../../mongo/db');
var dbProd = require('../../mongo/dbProd');
var ObjectId = require('mongodb').ObjectId;
var logger = require('../../utils/logger');

module.exports = {
    // get all school info
    getAllSchoolInfo: function (programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').find({'program.externalId': programId }).toArray(function (errGetAllSchool, getAllSchoolInfoDocs) {
                if (errGetAllSchool) {
                    reject(errGetAllSchool)
                } else {
                    resolve(getAllSchoolInfoDocs)
                }
            })
        })
    },

    // get dcpcr all school info
    getDcpcrAllSchoolInfo: function (programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').find({'program.externalId': programId }).toArray(function (errDcpcrGetAllSchool, getDcpcrAllSchoolInfoDocs) {
                if (errDcpcrGetAllSchool) {
                    reject(errDcpcrGetAllSchool)
                } else {
                    resolve(getDcpcrAllSchoolInfoDocs)
                }
            })
        })
    },

    //get dcpcr multiple schools Arr
    getDcpcrSchoolInfoArr : function(programId,schoolIds){
        return new Promise(function(resolve,reject){
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').find({'$and':[{'program.externalId': programId},{'entityInformation.externalId':{'$in':schoolIds}}]}).toArray(function (errDcpcrGetSchoolArr, getDcpcrSchoolInfoDocsArr) {
                if(errDcpcrGetSchoolArr){
                    reject(errDcpcrGetSchoolArr)
                } else {
                    resolve(getDcpcrSchoolInfoDocsArr)  
                }
            })
        })
    },

    // get specific(>=1) school info
    getSchoolInfoSpecific: function (querySchool, programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').find({ $and: [{ 'entityInformation.externalId': querySchool }, { 'program.externalId': programId }] }).toArray(function (errSpecificSchool, getSpecificSchoolDocs) {
                if (errSpecificSchool) {
                    reject(errSpecificSchool)
                } else {
                    getSpecificSchoolDocs[0].entityInformation.sdiLevel = getSpecificSchoolDocs[0].schoolLevel
                    resolve(getSpecificSchoolDocs[0])
                }
            })
        })
    },

    //get unique value of gender column from schoolInfo 
    getSchoolFilterByGender: function (programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').distinct('entityInformation.gender', { 'program.externalId': programId }, function (errSchoolGender, getSchoolGenderDocs) {
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
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').distinct('entityInformation.administration', { 'program.externalId': programId }, function (errSchoolAdmin, getSchoolAdminDocs) {
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
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').distinct('entityInformation.districtName', { 'program.externalId': programId }, function (errSchoolDistrict, getSchoolDistrictDocs) {
                if (errSchoolDistrict) {
                    reject(errSchoolDistrict)
                } else {
                    resolve(getSchoolDistrictDocs)
                }
            })
        })
    },

    //search school by Text 
    getSchoolBySearchText: function (searchText, programId) {
        return new Promise(function (resolve, reject) {
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').find({ $and: [{ $text: { $search: searchText } }, { 'program.externalId': programId }] }, { "entityInformation.name": 1, "entityInformation.externalId": 1, _id: 0 }).toArray(function (errSearchText, getSearchTextDocs) {
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
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').find({ 'program.externalId': programId }).toArray(function (errDcpcrProgram, getDcpcrProgramDocs) {
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
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').find({ $and: [{ 'entityInformation.administration': { '$regex': '^government$', '$options': 'i' } }, { 'program.externalId': programId }] }).toArray(function (errGovSchool, getGovSchoolsDocs) {
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
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').find({ $and: [{ 'entityInformation.administration': { '$regex': 'unaided', '$options': 'i' } }, { 'program.externalId': programId }] }).toArray(function (errPrivSchools, getPrivSchoolsDocs) {
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
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').distinct('entityInformation.districtName', { 'program.externalId': programId }, function (errUniqDistrict, getUniqDistrictDocs) {
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
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').find({ "$and": [{ "program.externalId": programId }, { "entityInformation.districtName": districtName }] }).toArray(function (errSingleDistrict, getSingleDistrictDocs) {
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
            db.get().collection('sdiSchoolSubmissionsFlattened_Dcpcr433Schools').find({ "$and": [{ "program.externalId": programId }, { 'entityInformation.state': { '$regex': 'delhi', '$options': 'i' } }] }).toArray(function (errSchoolDelhi, getSchoolDelhiDocs) {
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
            dbProd.get().collection('solutions').find({ "externalId": frameworkId }).toArray(function (errFrameworkInfo, getFrameworkInfo) {
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
            dbProd.get().collection('criteria').find({ "_id": ObjectId(criteriaId) }).toArray(function (errcriteriaInfo, getcriteriaInfo) {
                if (errcriteriaInfo) {
                    reject(errcriteriaInfo)
                } else {
                    resolve(getcriteriaInfo)
                }
            })
        })
    },

    //get Submissions Info
    getSubmissionInfo: function (programId) {
        return new Promise(function (resolve, reject) {
            dbProd.get().collection('submissions').find({ "$and": [{ "status": "completed" }, { "programExternalId": programId }] }, { 'criterias': 1, 'answers': 1 }).toArray(function (errSubmissionsInfo, dataSubmissionsInfo) {
                if (errSubmissionsInfo) {
                    reject(errSubmissionsInfo)
                } else {
                    resolve(dataSubmissionsInfo)
                }
            })
        })
    },

    //get criteria info
    getCriteriaInfo: function (criteriaId) {
        return new Promise(function (resolve, reject) {
            dbProd.get().collection('criteria').find({ 'externalId': criteriaId }, { 'evidences': 1 }).toArray(function (errCriteria, dataCriteria) {
                if (errCriteria) {
                    reject(errCriteria)
                } else {
                    resolve(dataCriteria)
                }
            })
        })
    }
}