var Sequelize =  require('sequelize')
require('dotenv').config();



const sequelize  =  new Sequelize(process.env.DB, process.env.DB_USER, process.env.PASSWORD,
    {
        host:process.env.HOST,
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