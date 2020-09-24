const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal');
const authWrapper = document.querySelector('.auth');
const loginForm = document.querySelector('.login');
const registerForm = document.querySelector('.register');

// toggle auth modals
authSwitchLinks.forEach(link => {
  link.addEventListener('click', () => {
    authModals.forEach(modal => modal.classList.toggle('active'));
  });
});

// login form
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        console.log('logged in', user);

        loginForm.reset();
      })
      .catch(error => {
        loginForm.querySelector('.error').textContent = error.message;
    });
});

// register form
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = registerForm.email.value;
  const password = registerForm.password.value; 

  firebase.auth().createUserWithEmailAndPassword(email, password);

});

var signInButtonElement = document.getElementById('sign-in');

signInButtonElement.addEventListener('click', signIn);

// login google
function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(function (result) {
      var token = result.credential.accessToken;
      var user = result.user;

      //this is what you need
      var isNewUser = result.additionalUserInfo.isNewUser;
      if (isNewUser) {
           //delete the created user
           result.user.delete();
           console.log('user is new');
      } else {
           // your sign in flow
           console.log('user ' + user.email + ' does exist!');
           window.location.replace("main.html"); 
      }
    }).catch(function (error) {
     // Handle Errors here.
    });
}


// auth listener
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        authWrapper.classList.remove('open');
        authModals.forEach(modal => modal.classList.remove('active'));

        window.location.replace("main.html"); 

    } else {
        authWrapper.classList.add('open');
        authModals[0].classList.add('active');
    }
});