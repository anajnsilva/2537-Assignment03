let possibleMatches;
let timer;
let intervalId;
function setDifficulty(button, level) {
  if (button) {
    $(".difficulty").removeClass("active");
    $(button).addClass("active");
  }

  possibleMatches = level;
  $("#pairs").text(level);
  switch (level) {
    case 10:
      $('#game_grid').removeClass();
      $('#game_grid').addClass("poke-10");
      timer = 60;
      break;
    case 5:
      $('#game_grid').removeClass();
      $('#game_grid').addClass("poke-5");
      timer = 30;
      break;
    default:
      $('#game_grid').removeClass();
      timer = 15;
      break;
  }
  let minutes = parseInt(timer / 60);
  let seconds = timer % 60;
  $("#timer").text(`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);

  assignPokemon(level);
}


function setUpDifficultyButtons() {
  $("#easy").on(("click"), function () {
    setDifficulty(this, 3);
  });

  $("#medium").on(("click"), function () {
    setDifficulty(this, 5);
  });

  $("#hard").on(("click"), function () {
    setDifficulty(this, 10);
  });
}

function reset() {
  $("#reset").on(("click"), function () {
    $("#game_grid").html("");

  })
}


async function assignPokemon(modeCards) {
  $("#game_grid").html("");
  let cards = [];

  for (let i = 0; i < modeCards; i++) {
    let randomId = Math.floor(Math.random() * 1024) + 1;
    let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
    let pokeJson = await pokemon.json();
    let src = pokeJson.sprites.other['official-artwork'].front_default;
    cards.push(`<div class="card">
      <img id="img${i}-first" class="front_face" src=${src} alt="">
      <img class="back_face" src="back.webp" alt="">
    </div> `);
    cards.push(`<div class="card">
      <img id="img${i}-second" class="front_face" src=${src} alt="">
      <img class="back_face" src="back.webp" alt="">
    </div> `);
  }
  shuffle(cards).forEach(c => {
    $('#game_grid').append(c);
  });
}

function shuffle(inputArray) {
  const shuffledArray = [];
  let whileIndex = inputArray.length;

  while (whileIndex > 0) {
    randomIndex = Math.floor(Math.random() * inputArray.length);

    shuffledArray.push(inputArray[randomIndex]);
    inputArray.splice(randomIndex, 1)

    whileIndex = whileIndex - 1;
  }

  return shuffledArray;
}

function setup() {
  let firstCard = undefined
  let secondCard = undefined
  let cardsFlipping = 0;
  let matches = 0;
  $('#match-input').text(matches);
  let remaining = possibleMatches;
  $('#remaining-matches').text(remaining);
  intervalId = setInterval(() => {
    timer--;
    let minutes = parseInt(timer / 60);
    let seconds = timer % 60;
    $("#timer").text(`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);
    if (timer < 0) {
      alert("Time's up! You lost!");
      clearInterval(intervalId);
    }
  }, 1000);
  let clicks = 0;
  $('#clicks').text(clicks);
  $(".card > .back_face").on(("click"), function () {
    if (cardsFlipping > 1) {
      return;
    }
    cardsFlipping++;

    clicks++;
    $('#clicks').text(clicks);
    $(this).parent().toggleClass("flip");

    if (!firstCard) {

      firstCard = $(this).siblings(".front_face")[0];
    }
    else {
      secondCard = $(this).siblings(".front_face")[0]
      console.log("FIRST ", firstCard, "SECOND ", secondCard);
      if (
        firstCard.src
        ==
        secondCard.src
      ) {
        console.log("match")
        matches++;
        $('#match-input').text(matches);
        $(`#${firstCard.id}`).parent().off("click")
        $(`#${secondCard.id}`).parent().off("click")
        firstCard = undefined
        secondCard = undefined
        remaining--;
        $('#remaining-matches').text(remaining);
        setTimeout(() => {
          if (matches == possibleMatches) {
            alert("You won!");
            clearInterval(intervalId);
          }
          cardsFlipping = 0
        }, 500);
      } else {
        console.log("no match")
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip")
          $(`#${secondCard.id}`).parent().toggleClass("flip")
          firstCard = undefined
          secondCard = undefined
          cardsFlipping = 0;
        }, 1000)
      }
    }
  });
}

function reset() {
  clearInterval(intervalId);
  setDifficulty(null, possibleMatches);
  $('#remaining-matches').text(possibleMatches);
  $('#match-input').text(0);
  $('#clicks').text(0);
}

function powerUp() {
  $(".card:not(.flip)").addClass("PowerUp flip")
  setTimeout(() => {
    $(".PowerUp").removeClass("PowerUp flip")
  }, 1000);
}

function darkMode() {
  $('body').toggleClass("dark");
  let text = $("#dark").text();
  if (text == "Night Mode") {
    $("#dark").text("Day Mode");
  } else {
    $("#dark").text("Night Mode");
  }
}

$(document).ready(
  function () {
    setUpDifficultyButtons();
    $("#start").on(("click"), setup);
    $("#reset").on(("click"), reset);
    $("#easy").click();
    $("#powerUp").on(("click"), powerUp);
    $("#dark").on(("click"), darkMode);

  }
)