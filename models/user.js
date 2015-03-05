/*  README
    This is the skeleton code for user model. The basic constructors, getters, and setters are in place.
    We need more understanding in MEAN stack to integrate this object to MongoDB as well as develop further function for this object.
 */

//Object
function User(){
    user.pk = undefined;
    user.firstName = undefined;
    user.lastName = undefined;
    user.username = undefined;
    user.email = undefined;
    user.password = undefined;
    user.school = undefined;
    user.zipCode = undefined;
    user.interests = undefined;
}

/****** Constructors ******/
//Empty constructor
User.prototype.initEmpty = function(){
    var user = new User();
}

//USer constructor for login
User.prototype.initLogin = function(username, password){
    var user = new User();
    user.username = username;
    user.password = md5(password);
}

//User constructor for registration
User.prototype.initRegister_Basic = function(firstName, lastName, username, email, password){
    var user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.email = email;
    user.password = md5(password);
    user.school = undefined;
    user.zipCode = undefined;
    user.interests = undefined;
    return user;
}
User.prototype.initRegister_Complete = function(firstName, lastName, username, email, password, school, zipCode, interests){
    var user = new User().initRegister_Basic(firstName, lastName, username, email, password);
    user.school = school;
    user.zipCode = zipCode;
    user.interests = interests;
    return user;
}

/****** Self-Object Handling ******/
//Getters
User.prototype.getPk = function(){
    return this.pk;
}
User.prototype.getFirstName = function(){
    return this.firstName;
}
User.prototype.getLastName = function(){
    return this.lastName;
}
User.prototype.getFullName = function(){
    if(this.hasFullName())  return undefined;
    else                    return this.firstName + ' ' + this.lastName;
}
User.prototype.getUsername = function(){
    return this.username;
}
User.prototype.getEmail = function(){
    return this.email;
}
User.prototype.getSchool = function(){
    return this.school;
}
User.prototype.getZipCode = function(){
    return this.zipCode;
}
User.prototype.getInterests = function(){
    return this.interests;
}

//Setters
User.prototype.setPk = function(n){
    this.pk = n;
}
User.prototype.setFirstName = function(s){
    this.firstName = s;
}
User.prototype.setLastName = function(s){
    this.lastName = s;
}
User.prototype.setUsername = function(s){
    this.username = s;
}
User.prototype.setPassword = function(s){
    this.password = md5(s);
}
User.prototype.setSchool = function(s){
    this.school = s;
}
User.prototype.setZipCode = function(s){
    this.zipCode = s;
}
User.prototype.setInterests = function(s){
    this.interests = s;
}

//Checks
User.prototype.hasPk = function(){
    return this.pk == undefined;
}
User.prototype.hasFirstName = function(){
    return this.firstName == undefined;
}
User.prototype.hasLastName = function(){
    return this.lastName == undefined;
}
User.prototype.hasFullName = function(){
    return this.firstName == undefined && this.lastName == undefined;
}
User.prototype.hasUsername = function(){
    return this.username == undefined;
}
User.prototype.hasPassword = function(){
    return this.password == undefined;
}
User.prototype.hasSchool = function(){
    return this.school == undefined;
}
User.prototype.hasZipCode = function(){
    return this.zipCode == undefined;
}
User.prototype.hasInterest = function(){
    return this.interests == undefined;
}

/****** Database Communication ******/
User.prototype.save = function(){
    //To be filled
}

/****** Authentication ******/
User.prototype.login = function(){
    if(db_authenticate(this)){
        var self = db_fetch_withUsername(this.getUsername());
        this.pk = self.pk;
        this.firstName = self.firstName;
        this.lastName = self.lastName;
        this.school = self.school;
        this.zipCode = self.zipCode;
        this.interests = self.interests;
        this.password = null;
        //Set cookies
    }

}
User.prototype.logout = function(){
    //To be filled
}

/****** Post-Object Handling ******/
//...To be filled