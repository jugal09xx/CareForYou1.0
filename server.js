var express = require('express');;
var app = express();
var mongoose = require('mongoose');
var passport 			  = require('passport');
var bodyParser 			  = require('body-parser');
var LocalStrategy 		  = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User                  = require('./models/user');


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(require('express-session')({
	secret: "My name is Jugal",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

//MONGOOSE CONFIG
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/careforyou', { useNewUrlParser: true });

	var doctors = [{
		name: "Doctor 1",
		type: "General Physician",
		city: "Mumbai"
	},
				  {
		name: "Doctor 2",
		type: "Neurologist",
		city: "Jaipur"
	},
				  {
		name: "Doctor 3",
		type: "Psychologist",
		city: "Chennai"
	},
				  {
		name: "Doctor 4",
		type: "Dentist",
		city: "Bangalore"
	},
				  {
		name: "Doctor 5",
		type: "General Physician",
		city: "Ahmedabad"
	}];

//ROUTES
app.get("/", function(req, res){
	res.render("index");
});
//Doctor route
app.get("/doctors", function(req, res){
	res.render("doctors", {doctors: doctors});
});
//prescriptions route
app.get("/prescriptions", function(req, res){
	res.render("prescription");
});
//med history
app.get("/medhistory", function(req, res){
	res.render("medhistory");
});
//consultation route
app.get("/consultations", function(req, res){
	res.render("consultation", {doctors: doctors});
});
//apppointment route
app.get("/appointments", function(req, res){
	res.render("appointment", {doctors: doctors});
});

//AUTH ROUTES
app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/");
		});;
	});
});

//LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
	res.render("login");
});
//login post route
app.post("/login",passport.authenticate("local",{
	successRedirect: "/",
	failureRedirect: "/login"
}),  function(req, res){});

//LOGOUT ROUTES
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server running...");
});

