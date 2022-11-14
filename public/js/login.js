const loginFormHandler = async function(event) {
  event.preventDefault();
  // Collect values from the login form
  const email = document.getElementById('email-login').value.trim();
  const password = document.getElementById('password-login').value.trim();

  if (email && password) {
    // Send a POST request to the API endpoint
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If successful, redirect the browser to the home page
      console.log('It worked');
      document.location.replace('/home');
    } else {
      alert(response.statusText);
      console.log('not working');
    }
  }
};

const signupFormHandler = async (event) => {
  event.preventDefault();

  // Collect the values from signup form
  const name = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  // Add to database and login the user
  if (name && email && password) {
    const response = await fetch('/api/users/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Once logged in --> take to home page
    if (response.ok) {
      document.location.replace('/home');
    } else {
      alert(response.statusText);
    }
  }
};

document
  .getElementById('login-btn')
  .addEventListener('click', loginFormHandler);

document
  .getElementById('signup-btn')
  .addEventListener('click', signupFormHandler);
