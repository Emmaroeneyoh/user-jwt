const router = require('express').Router()
const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId
const people = require('../model/user')
const text = require('../model/chat')
const Room = require('../model/room')

//create token using jwt
const age = 3* 24*60*60
const create_token = (id) => {
 return jwt.sign( {id}, 'userjwt', {
     expiresIn: age
 })
}
//end

router.get('/home', async (req, res) => {
    try {
        res.render('home')
        console.log('this is the req.user :', req.user)
    } catch (error) {
        console.log(error)
    }
})
//end
//for admin signup
router.get('/signup', async (req, res) => {
    try {
        res.render('signup')
    } catch (error) {
        console.log(error)
    }
})

//post request
router.post('/signup', async (req, res) => {
    try {
        const form = await new people(req.body)
        const blog = await form.save()
        const token = create_token(blog._id)
        res.cookie('usercookie', token, {httpOnly:true, maxAge: age*1000})
     res.json(blog)
        
        console.log(blog)
    } catch (error) {
        console.log(error)
        res.json({error: 'error occured'})
    }
})

//login
//getting the login page
router.get('/login', async (req,res) => {
    try {
      res.render('login')
    } catch (error) {
        console.log(error)
    }
})

router.post('/login', async (req, res) => {
    const { email, password} = req.body;

    try {
       const old_user = await  people.login(email, password)
       const token = create_token(old_user._id)
       res.cookie('usercookie', token, {httpOnly:true, maxAge: age*1000})
       console.log(old_user)
       res.json(old_user)
    } catch (err) {
       const error = handle_error(err)
       res.json({error: 'error occured'})
    }
})
//end

//logout
router.get('/logout', (req, res) => {
    res.cookie('usercookie', '', {maxAge:1})
    res.send('log out')
})


router.get("/users", async (req, res) => {
  try {
const users = await people.find()
console.log(users)
res.json(users)
  } catch (error) {
    console.log(error);
  }
});


router.post("/message", async (req, res) => {
    const userid = req.body.userId
    const friendid = req.body.friendId
    const roomid = req.body.roomid
    console.log('from react :', userid,friendid,roomid)

    
  try {
   const userRoom = await Room.findOne({
     member: { $all: [userid, friendid] },
   });
   
   if (userRoom) {
    const refRoom = userRoom._id;
     const message = await text.find({ roomQ: refRoom });
     const takeover = {userRoom, message}
     res.json(takeover)
     console.log(userRoom)
     console.log(message);
     console.log('this is take over', takeover)
   } else {
     const newroom = await new Room({
       room: roomid,
       member: [userid, friendid],
     });
     const saveroom = await newroom.save();
      const userRoom = await Room.findOne({ member: [userid, friendid] });
      const chatroom = userRoom._id
     const message = await text.find({ roomQ: chatroom });
   const takeover = { userRoom, message };
   res.json(takeover);
     console.log(saveroom, message);
   }
  } catch (error) {
    console.log(error);
  }
});

router.post("/chat", async (req, res) => {
  try {
   const {room, word, userID} = req.body
       const userRoom = await Room.findOne({ room: room });
       const refRoom = userRoom._id
       const newchat = await new text({
        roomQ : refRoom,
        chat:word,
        senderid:userID
       })
       const newmessage = await newchat.save()
       console.log('this the the ref room :', refRoom)
         const message = await text.find({ roomQ: refRoom });
       
       res.json(message)
  } catch (error) {
    console.log(error);
  }
});


// /


module.exports = router

