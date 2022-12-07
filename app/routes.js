const multer = require('multer')
const ObjectId = require("mongodb").ObjectId

module.exports = function (app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  app.get('/', (req, res) => {
    db.collection('msg').find({ postedBy: req.user.local.email }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('index.ejs', { fact: result })

    })
  })

  // PROFILE SECTION =========================

  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('profilePhoto').find({ postedBy: req.user.local.email }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs',
        {
          user: req.user,
          profilePhoto: result,
          reception: result
        })
    })
  });

  // source: https://www.npmjs.com/package/multer 

  let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/audio/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
  });
  let upload = multer({ storage: storage });

  app.post('/photo', upload.single('default-photo'), function (req, res, next) {
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    console.log(JSON.stringify(req.file))
    console.log('trying to upload files')
    let img =
    {
      src: req.file.path,
      name: req.file.filename,
      postedBy: req.user.local.email
    }
    console.log(img)
    db.collection('profilePhoto').insertOne(img)
      .then(result => {
        res.redirect('/profile')
      })
      .catch(error => console.error(error))

  });

  //   var response = '<a href="/">Home</a><br>'
  //   response += "Files uploaded successfully.<br>"
  //   response += `<img src="${req.file.path}" /><br>`
  //   return res.send(response)
  // })

  app.delete('/trash', (req, res) => {
    db.collection('profilePhoto').findOneAndDelete({ _id: ObjectId(req.body.id) }, (err, result) => {
      if (err) return res.send(500, err)
      console.log(err)
      res.send('Message deleted!')
    })
  })


  // PLAYLIST SECTION =========================

  app.get('/playlists', isLoggedIn, function (req, res) {
    let songs = [
      { songTitle: 'Beautiful Girls by Sean Kingston', src: 'public/music/Beautiful Girls by Sean King.mp3', cover: 'public/images/Beautiful Girls by Sean Kingston.jpg' },
      { songTitle: 'Build Me Up Buttercup by The Foundations', src: 'public/music/Build Me Up Buttercup by The Foundations.mp3', cover: 'public/images/Build Me Up Buttercup by The Foundations.jpg' },
      { songTitle: 'Candy Rain by Soul 4 Real', src: 'public/music/Candy Rain by Soul 4 Real.mp3', cover: 'public/images/Candy Rain by Soul 4 Real.jpg' },
      { songTitle: 'Come and Get Your Love by Redbone', src: 'public/music/Come and Get Your Love by Redbone.mp3', cover: 'public/images/Come and Get Your Love by Redbone.jpg' },
      { songTitle: 'Coming Home by Leon Bridges', src: 'public/music/Coming Home by Leon Bridges.mp3', cover: 'public/images/Coming Home by Leon Bridges.jpg' },
      { songTitle: 'Electric Slide by by Marcia Griffiths', src: 'public/music/Electric Slide by by Marcia Griffiths.mp3', cover: 'public/images/Electric Slide by by Marcia Griffiths.jpg' },
      { songTitle: 'Good Kisser by Lake Street Drive', src: 'public/music/Good Kisser by Lake Street Drive.mp3', cover: 'public/images/Good Kisser by Lake Street Drive.jpg' },
      { songTitle: 'Here And Now by Luther Vandross', src: 'public/music/Here And Now by Luther Vandross.mp3', cover: 'public/images/Here And Now by Luther Vandross.jpg' },
      { songTitle: 'Hold On, We\'re Going Home by Drake', src: 'public/music/Hold On, We\'re Going Home by Drake.mp3', cover: 'public/images/Hold On, We\'re Going Home by Drake.jpg' },
      { songTitle: 'Juicy by Notorious B.I.G', src: 'public/music/Juicy by Notorious B.I.G.mp3', cover: 'public/images/Juicy by Notorious B.I.G.jpg' },
      { songTitle: 'Like a Prayer by Madonna', src: 'public/music/Like a Prayer by Madonna.mp3', cover: 'public/images/Like a Prayer by Madonna.jpg' },
      { songTitle: 'One Two by Sister Nancy', src: 'public/music/One Two by Sister Nancy.mp3', cover: 'public/images/One Two By Sister Nancy.jpg' },
      // { songTitle: 'Piano Man by Billy Joel', src: 'public/music/Piano Man by Billy Joel.mp3', cover: 'public/images/Piano Man by Billy Joel.jpg' },
      { songTitle: 'Reserved for You by Charles Bradley', src: 'public/music/Strictly Reserved for You by Charles Bradley.mp3', cover: 'public/images/Strictly Reserved for You by Charles Bradley.jpg' },
      { songTitle: 'Tennessee Whiskey by Chris Stapleton', src: 'public/music/Tennessee Whiskey by Chris Stapleton.mp3', cover: 'public/images/Tennessee Whiskey by Chris Stapleton.jpg' },
      { songTitle: 'This Will Be by Natalie Cole', src: 'public/music/This Will Be (An Everlasting Love) by Natalie Cole.mp3', cover: 'public/images/This Will Be (An Everlasting Love) by Natalie Cole.jpg' },
      { songTitle: 'Valerie by Amy Winehouse', src: 'public/music/Valerie by Amy Winehouse ft. Mark Ronson.mp3', cover: 'public/images/Valerie by Amy Winehouse ft. Mark Ronson.jpg' },
      // { songTitle: 'Walking On Sunshine by Katrina And The Waves', src: 'public/music/Walking On Sunshine by Katrina And The Waves.mp3', cover: 'public/images/Walking On Sunshine by by Katrina And The Waves.jpg' },
      { songTitle: 'You And I by Stevie Wonder', src: 'public/music/You And I by Stevie Wonder.mp3', cover: 'public/images/You And I by Stevie Wonder.jpg' },


    ];
    db.collection('savedList').find({ postedBy: req.user.local.email }).toArray((err1, savedsongs) => {
      db.collection('users').find().toArray((err2, result) => {
        if (err2) return console.log(err2)
        console.log(savedsongs, 'saved list')
        res.render('playlists.ejs', {
          user: req.user,
          songs: songs,
          savedsongs: savedsongs
        })
      })
    })
  });
  app.post('/saveMovie', (req, res) => {
    console.log(req.body, 'request sent to post route')
    db.collection('savedList')
      .insertOne({
        songTitle: req.body.songTitle,
        postedBy: req.user.local.email
      },
        (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database', result)
          res.send({})
        })
  })
  app.put('/favorites', (req, res) => {
    db.collection('savedList')
    .findOneAndUpdate({
      songTitle: req.body.songTitle,
    }, {
      $set: {
        favorites: true
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })
  app.delete('/deleteSave', (req, res) => {
    db.collection('savedList').findOneAndDelete({ _id: ObjectId(req.body.id) }, (err, result) => {
      if (err) return res.send(500, err)
      console.log(err)
      res.send('Message deleted!')
    })
  })
  // app.delete('/deleteSave', (req, res) => {
  //   console.log(req.body, 'delete route hit')
  //   db.collection('savedList').findOneAndDelete({ _id: ObjectId(req.body.movieId) },
  //     function (err, result) {
  //       if (err) return res.send(500, err)
  //       res.send(result)
  //     })

  // })




  // RECORD SECTION =========================
  app.get('/recording', function (req, res) {
    db.collection('recordings').find({ postedBy: req.user.local.email }).toArray((err, result) => {
      if (err) return console.log(err)
      console.log('result ', result)
      res.render('record.ejs',
        {
          user: req.user,
          recordings: result
        })
    })
  });

  app.post('/postLibrary', isLoggedIn, upload.single('file-to-upload'), (req, res) => {
    console.log('file ', req.file.filename)
    db.collection('recordings')
      .insertOne(
        {
          name: req.body.name,
          spelling: req.body.spelling,
          role: req.body.role,
          audio: 'audio/uploads/' + req.file.filename,
          postedBy: req.user.local.email
        },
        (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database')
          res.redirect('/recording')
        })
  })
  app.delete('/deleteRecording', (req, res) => {
    db.collection('recordings').findOneAndDelete({ _id: ObjectId(req.body.id) }, (err, result) => {
      if (err) return res.send(500, err)
      console.log(err)
      res.send('Message deleted!')
    })
  })

  // SONG SUBMISSION FORM (old inspo) SECTION =========================
  app.get('/inspo', isLoggedIn, function (req, res) {
    db.collection('songSubmissions').find({ postedBy: req.user.local.email }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('inspo.ejs', {
        user: req.user,
        reception: result
      })
    })
  });

  app.post('/songForm', (req, res) => {
    let option = req.body.progress  // name of radio input
    if (option === 'on') {
      progress = 'final';
    } else {
      progress = 'draft'
    }

    db.collection('songSubmissions').save(
      {
        date: req.body.date,
        parentsIntro: req.body.parentsIntro,
        bridalParty: req.body.bridalParty,
        coupleIntro: req.body.coupleIntro,
        firstDance: req.body.firstDance,
        brideDance: req.body.brideDance,
        groomDance: req.body.groomDance,
        cakeCutting: req.body.cakeCutting,
        lastDance: req.body.lastDance,
        msg: req.body.msg,
        progress: progress,
        postedBy: req.user.local.email
        
      },
      (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/inspo')
      })
  })

  app.post('/inspo', (req, res) => {
    db.collection('songSubmissions').insertOne(
      {
        date: req.body.date,
        parentsIntro: req.body.parentsIntro,
        bridalParty: req.body.bridalParty,
        coupleIntro: req.body.coupleIntro,
        firstDance: req.body.firstDance,
        brideDance: req.body.brideDance,
        groomDance: req.body.groomDance,
        cakeCutting: req.body.cakeCutting,
        lastDance: req.body.lastDance,
        msg: req.body.msg,
        progress: progress,
        postedBy: req.user.local.email
      },
      (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
      })
  })
  app.delete('/deleteSongs', (req, res) => {
    db.collection('songSubmissions').findOneAndDelete({ _id: ObjectId(req.body.id) }, (err, result) => {
      if (err) return res.send(500, err)
      console.log(err)
      res.send('Message deleted!')
    })
  })


  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });



  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) don't touch this and sign up ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
