const db = require("../../config/database");

async function testService(req,res){
    try {            
        return res.status(200).json({message: "Success"});
    } catch (error) {
        console.log(error)
    }
}
module.exports={
    testService
}