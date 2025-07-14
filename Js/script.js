
var form = document.getElementById('feedbackForm');
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var messageInput = document.getElementById('message');
var charCount = document.getElementById('charCount');
var output = document.getElementById('output');

var feedbacks = [];

if (localStorage.getItem('feedbacks')) {
  feedbacks = JSON.parse(localStorage.getItem('feedbacks'));
}

messageInput.addEventListener('input', function () {
  charCount.textContent = messageInput.value.length;
});

// Submit form
form.addEventListener('submit', function (event) {
  event.preventDefault(); // stop page reload

  var name = nameInput.value.trim();
  var email = emailInput.value.trim();
  var message = messageInput.value.trim();

  if (name === '' || email === '' || message === '') {
    alert('Please fill in all the fields.');
    return;
  }


  var newFeedback = {
    name: name,
    email: email,
    message: message
  };

  
  feedbacks.push(newFeedback);

  
  localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

  
  form.reset();
  charCount.textContent = '0';

 
  output.textContent = 'Feedback submitted successfully!';
});
