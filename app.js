$(() => {
  // Create card images
  const cardImages = [
    "♥",
    "♥",
    "☁",
    "☁",
    "◈",
    "◈",
    "♫",
    "♫",
    "☺",
    "☺",
    "☀",
    "☀",
    "✰",
    "✰",
    "✿",
    "✿",
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

  // Create banner for You won! and Game over! message
  const showBanner = (text, color) => {
    const $bannerDiv = $("<div>").attr("id", "banner");
    $(".container").append($bannerDiv);
    const banner = $("#banner");
    banner.text(text);
    banner.css({ backgroundColor: color });
    banner.animate({ top: "50%" }, 500, () => {
      setTimeout(() => {
        banner.animate({ top: "-100px" }, 500);
      }, 5000);
    });
  };

  let openedCards = [];
  let isComparing = false;
  let hasWon = false;
  let moves = 0;
  
  const handleCardClick = (event) => {
    const clickedCard = $(event.currentTarget);
    incrementMoves();
    updateCountdownAndMoves();
  
    if (canOpenCard(clickedCard)) {
      openCard(clickedCard);
  
      if (twoCardsAreOpen()) {
        compareCards();
      }
    }
  };
  
  const incrementMoves = () => moves++;
  
  const updateCountdownAndMoves = () => {
    const countdown = $(".countdown");
    countdown.html(`Time left: ${timeLeft} seconds&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Moves: ${moves}`);
  };
  
  const canOpenCard = (card) => card.hasClass("card-back") && !isComparing;
  
  const openCard = (card) => {
    openedCards.push(card);
    card.toggleClass("card-back");
  };
  
  const twoCardsAreOpen = () => openedCards.length === 2;
  
  const compareCards = () => {
    isComparing = true;
    const [firstCard, secondCard] = openedCards;
    const firstLetter = firstCard.find("h1").text();
    const secondLetter = secondCard.find("h1").text();
  
    if (cardsMatch(firstLetter, secondLetter)) {
      handleMatchingCards();
    } else {
      handleNonMatchingCards(firstCard, secondCard);
    }
  };
  
  const cardsMatch = (firstLetter, secondLetter) => firstLetter === secondLetter;
  
  const handleMatchingCards = () => {
    openedCards = [];
  
    if (!$(".card.card-back").length) {
      showBanner("You won!", "green");
      hasWon = true;
    }
  
    isComparing = false;
  };
  
  const handleNonMatchingCards = (firstCard, secondCard) => {
    setTimeout(() => {
      firstCard.toggleClass("card-back");
      secondCard.toggleClass("card-back");
      openedCards = [];
      isComparing = false;
    }, 300);
  };
  
  $(".card").on("click", handleCardClick);
  
  let timeLeft = 30;
  const countdown = $("<div>")
    .addClass("countdown")
    .html(`Time left: ${timeLeft} seconds&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Moves: ${moves}`);
  $(".gameboard").before(countdown);
  
  const updateCountdown = () => {
    const countdown = $(".countdown");
    countdown.html(`Time left: ${timeLeft} seconds&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Moves: ${moves}`);
  };
  
  const endGame = () => {
    clearInterval(countdownInterval);
    $(".card.card-back").toggleClass("card-back");
    setTimeout(() => showBanner("Game over!", "red"), 300);
  };
  
  const winGame = () => {
    clearInterval(countdownInterval);
  };
  
  const countdownInterval = setInterval(() => {
    timeLeft--;
    updateCountdown();
  
    if (hasWon) {
      winGame();
    } else if (timeLeft === 0) {
      endGame();
    }
  }, 1000);
  
});
