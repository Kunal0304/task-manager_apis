var Sequelize =  require('sequelize')
require('dotenv').config();



const sequelize  =  new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,
    {
        host:process.env.DB_HOST,
        dialect:'postgres',
        
    }
)

const connection  = () =>{
    sequelize.authenticate().then(
        console.log("Autenticated successfully")
    ).catch((e)=>{
        console.log("Error", e)
    })
}

module.exports = connection