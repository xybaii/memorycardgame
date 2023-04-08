$(() => {
  const startEasyGame = () => {
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
      banner.css({ backgroundColor: color, display: "none" });
      banner.fadeIn();
      setTimeout(() => {
        banner.fadeOut(() => banner.remove());
      }, 5000);
    };

    let openedCards = [];
    let isComparing = false;
    let hasWon = false;
    let moves = 0;

    // add event handler to cards
    const handleCardClick = (event) => {
      if (hasWon || timeLeft <= 0) {
        return;
      }
      const clickedCard = $(event.currentTarget);
      incrementMoves();
      updateMoves();

      if (canOpenCard(clickedCard)) {
        openCard(clickedCard);

        if (twoCardsAreOpen()) {
          compareCards();
        }
      }
    };

    // Open cards
    const canOpenCard = (card) => card.hasClass("card-back") && !isComparing;

    const openCard = (card) => {
      openedCards.push(card);
      card.toggleClass("card-back");
    };

    const twoCardsAreOpen = () => openedCards.length === 2;

    // Compare cards
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

    // Check cards match
    const cardsMatch = (firstLetter, secondLetter) =>
      firstLetter === secondLetter;

    const handleMatchingCards = () => {
      openedCards = [];

      if (!$(".card.card-back").length) {
        showBanner("You won!", "green");
        hasWon = true;
      }

      isComparing = false;
    };

    // If cards don't match, flip them back over
    const handleNonMatchingCards = (firstCard, secondCard) => {
      setTimeout(() => {
        firstCard.toggleClass("card-back");
        secondCard.toggleClass("card-back");
        openedCards = [];
        isComparing = false;
      }, 300);
    };

    $(".card").on("click", handleCardClick);

    // Create game buttons and counter container
    const buttonCounterContainer = $("<div>").addClass("gameConsole");
    $(".gameboard").prepend(buttonCounterContainer);

    // Create restart button
    const restartButton = $("<div>").addClass("restart").text("↻");
    $(".gameConsole").append(restartButton);

    // Reset game function
    const resetGame = () => {
      // Fade out the gameboard
      $(".gameboard").fadeOut(300, () => {
        // remove banner immediately if reset
        $("#banner").remove();
        // Clear gameboard
        $(".gameboard").empty();
        // Reset variables
        openedCards = [];
        isComparing = false;
        hasWon = false;
        moves = 0;
        timeLeft = 310;
        // Call startGame function to restart the game
        startEasyGame();
        // Fade in the gameboard
        $(".gameboard").fadeIn(300);
      });
    };
    

    // Add event listener to restart button
    $('.restart').click(() => {
      clearInterval(countdownInterval);
      resetGame();
    });

    // Create countdown timer
    let timeLeft = 300;
    const countdown = $("<div>")
      .addClass("timeCounter")
      .html(`You left: ${timeLeft} s`);
    $(".gameConsole").append(countdown);

    const updateCountdown = () => {
      $(".timeCounter").html(`You left: ${timeLeft} s`);
    };

    const movesCounter = $("<div>")
      .addClass("movesCounter")
      .html(`Moves: ${moves}`);
    $(".gameConsole").append(movesCounter);

    // Count number of moves
    const incrementMoves = () => moves++;

    const updateMoves = () => {
      $(".movesCounter").html(`Moves: ${moves}`);
    };

    // End the game if time runs out
    const endGame = () => {
      clearInterval(countdownInterval);
      $(".card.card-back").toggleClass("card-back");
      setTimeout(() => showBanner("Time's up!", "red"), 300);
    };

    const winGame = () => {
      clearInterval(countdownInterval);
    };



    // Run the countdown timer
    const countdownInterval = setInterval(() => {
      timeLeft--;
      updateCountdown();

      if (hasWon) {
        winGame();
      } else if (timeLeft === 0) {
        endGame();
      }
    }, 1000);

    // Create a hard mode button
    const hardButton = $("<div>").addClass("hard").text("➠");
    $(".gameConsole").append(hardButton);
  };
  startEasyGame();
});
