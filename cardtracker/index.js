document.addEventListener('DOMContentLoaded', () => {
  const takeButton = document.getElementById('take');
  const loginForm = document.getElementById("login-screen");
  const submitButton = document.getElementById('submit-account-access');
  const cardDisplay = document.getElementById('card-display');
  const signupButton = document.getElementById('signup');
  const name = document.getElementById("name");
  const passcode = document.getElementById("passcode");
  const card = document.getElementById("card");
  const cardTitle = document.getElementById("cardTitle");
  const done = document.getElementById("doneButton");
  const cards = ["Twos!", "Threes!", "Fours!", "Fives!", "Sixes!", "Sevens!", "Eights!", "Jacks!", "Kings!", "Aces!"];
  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  let mode = 'login'; // track current mode: 'login' or 'signup'

  takeButton.addEventListener('click', () => {
    mode = 'login';
    submitButton.innerHTML = "Submit";
    takeButton.style.display = 'none';
    loginForm.style.display = 'block';
  });

  signupButton.addEventListener('click', () => {
    mode = 'signup';
    submitButton.innerHTML = "Sign Up";
    takeButton.style.display = 'none';
    loginForm.style.display = 'block';
  });

  submitButton.addEventListener('click', () => {
    if (mode === 'signup') {
      if (name.value && passcode.value) {
        localStorage.setItem(name.value, passcode.value);
        alert('Signup successful! Please log in.');
        mode = 'login';
        submitButton.innerHTML = "Submit";
        name.value = '';
        passcode.value = '';
        loginForm.style.display = 'none';
        takeButton.style.display = 'block';
      } else {
        alert('Please enter a name and passcode');
      }
    } else { // Login
      if (localStorage.getItem(name.value) !== null && passcode.value === localStorage.getItem(name.value)) {
        // Show card
        name.value = '';
        passcode.value = '';
        let cardName = getRandomElement(cards);
        cardTitle.innerHTML = cardName;
        card.src = "cards/"+cardName.toLowerCase().slice(0,-2)+".png";

        document.querySelectorAll('body > *:not(#card-display)').forEach(el => {
          el.style.display = 'none';
        });
        cardDisplay.style.display = 'flex';
        done.addEventListener("click", function () {
          // Hide the card display
          document.getElementById('card-display').style.display = 'none';

          // Show the main screen and Take button
          document.getElementById('take').style.display = 'block';
          document.getElementById('main-head').style.display = 'block';

          // Reset login form if needed (optional)
          document.getElementById('login-screen').style.display = 'none';
        });
      } else {
        // Flash login box red for 0.25 seconds to indicate wrong password
        document.getElementById("login-screen").style.borderColor = "red";
        submitButton.style.backgroundColor = "red";
        setTimeout(function () {
          document.getElementById("login-screen").style.borderColor = "#28a745";
          submitButton.style.backgroundColor = "#28a745";
        }, 250);
      }
    }
  });
});
