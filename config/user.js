module.exports = function map_user_request(user, userdetails) {
  if (userdetails.name) {
    user.name = userdetails.name;
  }
  if (userdetails.username) {
    user.username = userdetails.username;
  }
  if (userdetails.email) {
    user.email = userdetails.email;
  }
  if (userdetails.password) {
    user.password = bcrypt.hashSync(userdetails.password, saltRounds);
  }
  if (userdetails.bloodgroup) {
    user.bloodgroup = userdetails.bloodgroup;
  }
  if (userdetails.phoneNo) {
    user.phoneNo = userdetails.phoneNo;
  }
  if (userdetails.address) {
    user.address = userdetails.address;
  }
  if (userdetails.dateOfBirth) {
    user.dateOfBirth = userdetails.dateOfBirth;
  }
  if (userdetails.role) {
    user.role = userdetails.role;
  }
  return user;
}