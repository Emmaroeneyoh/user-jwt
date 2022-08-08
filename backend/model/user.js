const mongoose  = require('mongoose')
const schema = mongoose.Schema

const bycrpt = require('bcrypt')

const mem_schema = new schema({
    username:{
     type: String,
     required: [true, 'please choose a job title']
    },
  

    email:{
     type:String,
     required:[true, 'please enter an  email address'],
 
    },
    password:{
   type: String,
   required:[true, 'please input a password'],
  
    },
    createdAt : {
        type: Date,
        default:Date.now
    }
});
mem_schema.pre('save', async function(next) {
    const salt = await bycrpt.genSalt()
    this.password = await bycrpt.hash(this.password, salt)
    next()
  });
  
  mem_schema.statics.login = async function(email, password) {
    const user = await this.findOne({email})

    if(user) {

        const pass = await bycrpt.compare(password,user.password)
        if(pass) {
            return user
        } 
        throw Error('incorect password')
        
    }
    throw Error('incorrect email')
}

const mem_mode = mongoose.model('user', mem_schema)
module.exports = mem_mode;