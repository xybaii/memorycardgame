// wait for document to load
$(() => {

  // Create card images
  const cardImages = [
    "♥", "♥",
    "☁", "☁",
    "◈", "◈",
    "♫", "♫",
    "☺", "☺",
    "☀", "☀",
    "✰", "✰",
    "✿", "✿",
  ];

  // Shuffle the card images randomly
  const shuffle = (array) => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };
  shuffle(cardImages);

  // Create card elements
  for (let i = 0; i < cardImages.length; i++) {
    const card = $("<div>")
      .addClass("card")
      .addClass("card-back")
      .attr("id", cardImages[i]);
    const cardDesign = $("<h1>").text(cardImages[i]);
    card.append(cardDesign);
    $(".gameboard").append(card);
  }

  let openedCards = [];

  // Add event handler and toggle class
  const eventHandler = (event) => {
    const clickedCard = $(event.currentTarget);
    clickedCard.toggleClass("card-back");

    // Add the opened card to the array
    openedCards.push(clickedCard);

    // Check if there are two opened cards
    if (openedCards.length === 2) {
      const firstCard = openedCards[0];
      const secondCard = openedCards[1];

      const firstLetter = firstCard.find("h1").text();
      const secondLetter = secondCard.find("h1").text();

      // Check if the two cards match
      if (firstLetter === secondLetter) {
        openedCards = [];

        // Check if all cards are matched and opened
        if ($(".card.card-back").length === 0) {
          alert("You won!");
        }
      } else {
        setTimeout(() => {
          firstCard.toggleClass("card-back");
          secondCard.toggleClass("card-back");
          openedCards = [];
        }, 300);
      }
    }
  };
  $(".card").on("click", eventHandler);

  let timeLeft = 40;
  const countdown = $("<div>")
    .addClass("countdown")
    .text(`Time left: ${timeLeft} seconds`);
  $(".gameboard").before(countdown);

  const countdownInterval = setInterval(() => {
    timeLeft--;
    countdown.text(`Time left: ${timeLeft} seconds`);

    if (timeLeft === 0) {
      clearInterval(countdownInterval);
      $(".card.card-back").toggleClass("card-back");
      setTimeout(() => {
        alert("Game over!");
      }, 300);
    }
  }, 1000);
});