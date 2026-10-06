/* async function typeSentence(sentence, eleRef, delay = 100) {
    const letters = sentence.split("");
    let i = 0;
    while(i < letters.length) {
      await waitForMs(delay);
      $(eleRef).append(letters[i]);
      i++
    }
    return;
  }
  function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }  
  */
var abtDone = localStorage.getItem('abtDone') === 'true';
var workDone = localStorage.getItem('workDone') === 'true';
var contactDone = localStorage.getItem('contactDone') === 'true';

$(document).ready(function() {
  if (abtDone || workDone || contactDone) {
    $("#intro-dialogue").addClass("instant");
    $("#dialogue-options-intro").remove();
  }

  if (abtDone) aboutSelect(true);
  if (workDone) workSelect(true);
  if (contactDone) contactSelect(true);

  if (!abtDone && !workDone && !contactDone) {
    setTimeout(showOptions, 2500);
  }

  $(document).on('animationend', '.dialogue-lines', function(){
    $(this).addClass('typed');
  });

  $(document).on('click', '#about-option', function(){
    aboutSelect();
    $(".dialogue-options > p").hide();
  });
  $(document).on('click', '#work-option', function(){
    workSelect();
    $(".dialogue-options > p").hide();
  });
  $(document).on('click', '#contact-option', function(){
    contactSelect();
    $(".dialogue-options > p").hide();
  });
});


function showOptions() {
  $("#about-option").fadeIn();
  $("#work-option").fadeIn();
  $("#contact-option").fadeIn();
}
// when user selects about option
function aboutSelect(instant) {
  $("#dialogue-options-about-ysmn").hide();
  abtDone = true;
  localStorage.setItem('abtDone', 'true');

  var cls = instant ? ' instant' : '';
  var txt = '<div class="dialogue-lines' + cls + '" id="dialogue-lines-about-user"></div>';
  var txt1 = '<p id="user-dialogue">YOU</p>';
  var txt2 = '<p id="about-select">— What is up with you? What is your story?</p>';
  $(".middle-container").append(txt);
  $("#dialogue-lines-about-user").append(txt1, txt2);

  function aboutResponse() {
    var txt = '<div class="dialogue-lines' + cls + '" id="dialogue-lines-about-ysmn"></div>';
    var txt1 = '<p id="ysmn-dialogue">YASMIN</p>';
    var txt2 = '<p id="about-response">— What great questions! So great, in fact, that I created a page all about myself, just for you! Look at the top left corner.</p>';
    $(".middle-container").append(txt);
    $("#dialogue-lines-about-ysmn").append(txt1, txt2);
    $("#about").animate({opacity: 1.0}, instant ? 0 : 2000);

    setTimeout(function() {
      var txt3 = '<div class="dialogue-options" id="dialogue-options-about-ysmn"></div>';
      var txt4 = '<p id="work-option">Any interesting projects I should know about?</p>';
      var txt5 = '<p id="contact-option">I wanna take you out to dinner. You down?</p>';
      $("#dialogue-lines-about-ysmn").after(txt3);
      if (workDone && contactDone) { $("#dialogue-options-about-ysmn").remove(); }
      else if (workDone) { $("#dialogue-options-about-ysmn").append(txt5); }
      else if (contactDone) { $("#dialogue-options-about-ysmn").append(txt4); }
      else { $("#dialogue-options-about-ysmn").append(txt4, txt5); }
      $("#dialogue-options-about-ysmn > p").fadeIn();
    }, instant ? 0 : 2000);
  }

  if (instant) { aboutResponse(); } else { setTimeout(aboutResponse, 2000); }
}

// when user selects work option
function workSelect(instant) {
  $("#dialogue-options-work-ysmn").hide();
  workDone = true;
  localStorage.setItem('workDone', 'true');

  var cls = instant ? ' instant' : '';
  var txt = '<div class="dialogue-lines' + cls + '" id="dialogue-lines-work-user"></div>';
  var txt1 = '<p id = "user-dialogue">YOU</p>';
  var txt2 = '<p id="work-select">— You been working on anything lately?</p>';
  $(".middle-container").append(txt);
  $("#dialogue-lines-work-user").append(txt1, txt2);

function workResponse() {
    var txt = '<div class="dialogue-lines' + cls + '" id="dialogue-lines-work-ysmn"></div>';
    var txt1 = '<p id = "ysmn-dialogue">YASMIN</p>';
    var txt2 = '<p id="work-response">— Always. Give me a second, I will create a whole page of my projects since you asked so nicely. There! Check out the top middle.</p>'
    $(".middle-container").append(txt);
    $("#dialogue-lines-work-ysmn").append(txt1, txt2);
    $("#work").animate({opacity: 1.0}, instant ? 0 : 3000);
    setTimeout(function() {
      var txt3 = '<div class = "dialogue-options" id = "dialogue-options-work-ysmn"></div>'
      var txt4 = '<p id = "about-option">I would love to know more about you!</p>'
      var txt5 = '<p id="contact-option">I wanna take you out to dinner. You down?</p>'
      $("#dialogue-lines-work-ysmn").after(txt3);
      if (abtDone == true && contactDone == true) {
        $("#dialogue-options-work-ysmn").remove();
      }
      else if (abtDone == true) {
        $("#dialogue-options-work-ysmn").append(txt5);

      }
      
      else if (contactDone == true) {
        $("#dialogue-options-work-ysmn").append(txt4);

      }
      else {
        $("#dialogue-options-work-ysmn").append(txt4, txt5);
      } 
      $("#dialogue-options-work-ysmn > p").fadeIn()}, instant ? 0 : 2000);

  }
  if (instant) { workResponse(); } else { setTimeout(workResponse, 1500); }

}
// when user selects contact option
function contactSelect(instant) {
  $("#dialogue-options-contact-ysmn").hide();
  contactDone = true;
  localStorage.setItem('contactDone', 'true');

  var cls = instant ? ' instant' : '';
  var txt = '<div class="dialogue-lines' + cls + '" id="dialogue-lines-contact-user"></div>';
  var txt1 = '<p id = "user-dialogue">YOU</p>';
  var txt2 = '<p id="contact-select">— Alright. Let me get straight to the point. I wanna take you out for dinner. You down?</p>';
  $(".middle-container").append(txt);
  $("#dialogue-lines-contact-user").append(txt1, txt2);

function contactResponse() {
    var txt = '<div class="dialogue-lines' + cls + '" id="dialogue-lines-contact-ysmn"></div>';
    var txt1 = '<p id = "ysmn-dialogue">YASMIN</p>';
    var txt2 = '<p id="contact-response">— Um.</p>';
    var txt3 = '<p>Sure.</p>';
    var txt4 = '<p> I mean.</p>';
    var txt5 = ' <p> Yeah. Contact tab. Top right.</p>'
    $(".middle-container").append(txt);
    $("#dialogue-lines-contact-ysmn").append(txt1, txt2);
    setTimeout(function() {
      $("#dialogue-lines-contact-ysmn").append(txt3);
    }, instant ? 0 : 2000);
    setTimeout(function() {
      $("#dialogue-lines-contact-ysmn").append(txt4);
    }, instant ? 0 : 3000);
    setTimeout(function() {
      $("#dialogue-lines-contact-ysmn").append(txt5);
    }, instant ? 0 : 4000);
    $("#contact").animate({opacity: 1.0}, instant ? 0 : 7000);

    setTimeout(function() {
      var txt6 = '<div class = "dialogue-options" id = "dialogue-options-contact-ysmn"></div>'
      var txt7 = '<p id = "about-option">I would love to know more about you!</p>'
      var txt8 = '<p id="work-option">Any interesting projects I should know about?</p>'
      $("#dialogue-lines-contact-ysmn").after(txt6);
      
      if (abtDone == true && workDone == true) {
        $("#dialogue-options-contact-ysmn").remove();
      }
      else if (abtDone == true) {
        $("#dialogue-options-contact-ysmn").append(txt8);

      }
      else if (workDone == true) {
        $("#dialogue-options-contact-ysmn").append(txt7);

      }
      
      else {
        $("#dialogue-options-contact-ysmn").append(txt7, txt8);
      }
      $("#dialogue-options-contact-ysmn > p").fadeIn()}, instant ? 0 : 5000);
  }
  if (instant) { contactResponse(); } else { setTimeout(contactResponse, 2000); }

}