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
  const classPeriod = document.getElementById('class');
  const teacherButton = document.getElementById('teacher');
  const attendance = document.getElementById('teacherList');
  const classField = document.getElementById('teacherClassPeriod');
  const signInCount = document.getElementById('teacherTotalSignIns');
  const teacherDone = document.getElementById('teacherDone');
  const cards = ["Twos!", "Fives!", "Sixes!", "Sevens!", "Jacks!", "Kings!", "Aces!"];
  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const hour = 3600000; // Miliseconds in an hour
  // Template for storing user data
  const userData = {
    passcode: null,
    lastTaken: null,
    class: null
  }
  let seating = {
    'Twos!': 4,
    'Fives!': 4,
    'Sixes!': 4,
    'Sevens!': 4,
    'Jacks!': 4,
    'Kings!': 4,
    'Aces!': 4
  }
  let currentPasscode = null;

  // Hash passcodes to prevent leaking PINs just by reading LocalStorage, salted to add friction against brute-force
  async function hashPIN(pin) {
    const salt = 'classcards-Xm43E'; // Static, but blocks rainbow tables and requires knowledge of source code
    const enc = new TextEncoder();
    const data = enc.encode(salt + pin);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getSignIns() {
    return JSON.parse(localStorage.getItem('currentClassSignIns'));
  }
  function setSignIns(action, element) {
    if (action === 'push') {
      localStorage.setItem('currentClassSignIns', JSON.stringify(getSignIns().concat(element)));
    } else {
      let arrTemplate = [];
      localStorage.setItem('currentClassSignIns', JSON.stringify(arrTemplate));
    }
  }
  localStorage.setItem('currentClassSignIns', JSON.stringify([]));
  function sit(seat) {
    if (seat === 'clear') {
      seating['Twos!'] = 4;
      seating['Fives!'] = 4;
      seating['Sixes!'] = 4;
      seating['Sevens!'] = 4;
      seating['Jacks!'] = 4;
      seating['Kings'] = 4;
      seating['Aces!'] = 4;
      localStorage.setItem('seating', JSON.stringify(seating));
    } else {
      if (localStorage.getItem('seating')[seat] <= 0) {
        return false; // Table full
      }
      seating[seat] -= 1;
      localStorage.setItem('seating', JSON.stringify(seating));
    }
  }

  let mode = 'login'; // track current mode: 'login' or 'signup'
  let currentClass = 1;
  let teacherListItem = document.createElement('li');

  teacherButton.addEventListener('click', () => {
    document.querySelectorAll('body > *').forEach(el => {
      el.style.display = 'none';
    });
    teacherView.style.display = 'block';

    classField.innerHTML = currentClass;
    signInCount.innerHTML = getSignIns().length;

    attendance.innerHTML = '';
    for (const element of getSignIns()) {
      teacherListItem.textContent = element;
      attendance.appendChild(teacherListItem);
      teacherListItem = document.createElement('li');
    }

    teacherDone.addEventListener('click', () => {
      // Show the main screen and Take button
      document.getElementById('take').style.display = 'block';
      document.getElementById('main-head').style.display = 'block';
      signupButton.style.display = 'block';
      teacherButton.style.display = 'block';

      // Reset login form if needed (optional)
      document.getElementById('login-screen').style.display = 'none';
      teacherView.style.display = 'none';
    });
  });

  takeButton.addEventListener('click', () => {
    mode = 'login';
    submitButton.innerHTML = "Submit";
    takeButton.style.display = 'none';
    loginForm.style.display = 'block';
    classPeriod.style.display = "none";
  });

  signupButton.addEventListener('click', () => {
    if (mode === 'login') {
      mode = 'signup';
      submitButton.innerHTML = "Sign Up";
      takeButton.style.display = 'none';
      loginForm.style.display = 'block';
      classPeriod.style.display = "block";
    } else {
      // Show the main screen and Take button
      document.getElementById('take').style.display = 'block';
      document.getElementById('main-head').style.display = 'block';

      // Reset login form if needed (optional)
      document.getElementById('login-screen').style.display = 'none';
    }
  });

  submitButton.addEventListener('click', async () => {
    if (mode === 'signup') {
      if (name.value && passcode.value) {
        if (localStorage.getItem(name.value) === null || name.value === 'seating' || name.value === 'currentClassSignIns') {
          if (prompt("Please retype your passcode to confirm") === passcode.value) {
            userData.passcode = await hashPIN(passcode.value);
            userData.lastTaken = null;
            userData.class = classPeriod.value;
            localStorage.setItem(name.value, JSON.stringify(userData));

            userData.passcode = null;
            userData.lastTaken = null;
            userData.class = null;
            alert('Signup successful! You can now take cards as ' + name.value + '.');
            mode = 'login';
            submitButton.innerHTML = "Submit";
            name.value = '';
            passcode.value = '';
            loginForm.style.display = 'none';
            takeButton.style.display = 'block';
            classPeriod.style.display = "none";
          } else {
            alert("Your passcodes don't match. Make sure to type carefully!");
          }
        } else {
          alert("This user already exists in the system. Try including your last name if somebody shares your first name.");
        }
      } else {
        alert('Please enter your name and passcode!');
      }
    } else { // Login
      if (localStorage.getItem(name.value) !== null && (await hashPIN(passcode.value)) === JSON.parse(localStorage.getItem(name.value)).passcode) {
        let loadedData = JSON.parse(localStorage.getItem(name.value), (key, value) => {
          if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
            return new Date(value);
          }
          return value;
        });
        let now = new Date();
        if (loadedData.lastTaken === null) {
          if (currentClass !== loadedData.class) {
            currentClass = loadedData.class; // If someone from class period 8 signs in, for example, we know class period 8 has started
            setSignIns('empty', null); // Reset sign-in list
            sit('clear'); // Reset seating
          }
          // Show card
          let cardName = getRandomElement(cards);
          while (sit(cardName) === false) {
            cardName = getRandomElement(cards);
          }
          setSignIns('push', name.value + " - " + now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          }) + ' - ' + cardName.slice(0,-1));
          cardTitle.innerHTML = cardName;
          card.src = "cards/"+cardName.toLowerCase().slice(0,-2)+".png";
          card.alt = cardName;

          document.querySelectorAll('body > *:not(#card-display)').forEach(el => {
            el.style.display = 'none';
          });
          loadedData.lastTaken = new Date();
          cardDisplay.style.display = 'flex';
          done.addEventListener("click", function () {
            if (name.value !== '') {localStorage.setItem(name.value, JSON.stringify(loadedData));}

            name.value = '';
            passcode.value = '';
            // Hide the card display
            document.getElementById('card-display').style.display = 'none';

            // Show the main screen and Take button
            document.getElementById('take').style.display = 'block';
            document.getElementById('main-head').style.display = 'block';
            signupButton.style.display = "block";
            teacherButton.style.display = "block";

            // Reset login form if needed (optional)
            document.getElementById('login-screen').style.display = 'none';
          });
        } else {
          if ((now.getTime() - loadedData.lastTaken.getTime()) <= 15*hour) { // Too recent (aka Dennis prevention)
            alert("You've already taken a card today!")
            if (name.value !== '') {localStorage.setItem(name.value, JSON.stringify(loadedData));}

            // Hide the card display
            document.getElementById('card-display').style.display = 'none';

            // Show the main screen and Take button
            document.getElementById('take').style.display = 'block';
            document.getElementById('main-head').style.display = 'block';

            // Reset login form if needed (optional)
            document.getElementById('login-screen').style.display = 'none';
          } else {
            if (currentClass !== loadedData.class) {
              currentClass = loadedData.class; // If someone from class period 8 signs in, for example, we know class period 8 has started
              setSignIns('empty', null); // Reset sign-in list
              sit('clear'); // Reset seating
            }
            // Show card
            let cardName = getRandomElement(cards);
            while (sit(cardName) === false) {
              cardName = getRandomElement(cards);
            }
            setSignIns('push', name.value + " - " + now.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            }) + ' - ' + cardName.slice(0,-1));
            cardTitle.innerHTML = cardName;
            card.src = "cards/"+cardName.toLowerCase().slice(0,-2)+".png";
            card.alt = cardName;

            document.querySelectorAll('body > *:not(#card-display)').forEach(el => {
              el.style.display = 'none';
            });
            loadedData.lastTaken = new Date();
            cardDisplay.style.display = 'flex';
            done.addEventListener("click", function () {
              if (name.value !== '') {localStorage.setItem(name.value, JSON.stringify(loadedData));}

              name.value = '';
              passcode.value = '';
              // Hide the card display
              document.getElementById('card-display').style.display = 'none';

              // Show the main screen and Take button
              document.getElementById('take').style.display = 'block';
              document.getElementById('main-head').style.display = 'block';
              signupButton.style.display = "block";
              teacherButton.style.display = "block";

              // Reset login form if needed (optional)
              document.getElementById('login-screen').style.display = 'none';
            });
          }
        }
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
