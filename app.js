$(() => {
  //  Create background music
  const bgm = $("#bgm")[0];
  bgm.currentTime = 0;
  bgm.loop = true;

  //  Create home page & instruction pages
  const nameInput = $("#name-input");
  const easyModeButton = $("#easyMode");
  const hardModeButton = $("#hardMode");
  const easyModeInstructionDiv = $(".easyModeInstruction");
  const startGameButton = $("<button>").text("Start Game");
  const hardModeInstructionDiv = $(".hardModeInstruction");
  const startChallengeButton = $("<button>").text("Start Challenge");

  $(".gameboard").hide();
  $(".gameboard2").hide();

  //  If chose Easy mode, go Easy mode instruction page
  easyModeButton.on("click", () => {
    const playerName = nameInput.val();
    bgm.play();

    $(".gamehomepage").hide();
    easyModeInstructionDiv.show();

    easyModeInstructionDiv.html(`
        <h2>Hello ${playerName}!</h2>
        <p><b>Here are the game play instructions:</b></p>
        <ul>
          <li>Memorize the positions of the cards when you flip them over.</li>
          <li>If the cards match, they will stay flipped over.</li>
          <li>If the cards do not match, they will flip back over.</li>
          <li>The game will be over if you are unable to flip all matching cards within 30s.</li>
          <li>Break your best record with the longest time left </li>
          <li>and least moves taken to finish the game.</li>
          <br>
          <li>You may click on the <span>↻</span> button to restart your game or</li>
          <li>click on the <span>➠</span> button to go to hard mode.</li>
          <li>You will given 40s instead to complete the hard mode game</li>
          <li>but your cards will be locked for 3s if you do not match them correctly.</li>
        </ul>
      `);

    easyModeInstructionDiv.append(startGameButton);
  });

  startGameButton.on("click", () => {
    easyModeInstructionDiv.hide();
    $(".gameboard").show();
    startEasyGame();
  });

  // If chose hard mode, go Hard mode instruction page
  hardModeButton.on("click", () => {
    const playerName = nameInput.val();
    bgm.play();

    $(".gamehomepage").hide();
    hardModeInstructionDiv.show();

    hardModeInstructionDiv.html(`
        <h2>Hello ${playerName}!</h2>
        <p>Here are the game play instructions:</p>
        <ul>
          <li>Memorize the positions of the cards when you flip them over.</li>
          <li>If the cards match, they will stay flipped over.</li>
          <li>If the cards do not match, they will flip back over for 3s before it's clickable again.</li>
          <li>The game will be over if you are unable to flip all matching cards within 40s.</li>
          <li>Break your best record with the longest time left </li>
          <li>and least moves taken to finish the game.</li>
          <br>
          <li>You may click on the <span>↻</span> button to restart your game or</li>
          <li>click on the <span>➠</span> button to go to easy mode.</li>
          <li>You will given 30s instead to complete the easy  mode game</li>
          <li>and your cards will not be locked for 3s if you do not match them correctly.</li>
        </ul>
      `);

    hardModeInstructionDiv.append(startChallengeButton);
  });

  startChallengeButton.on("click", () => {
    hardModeInstructionDiv.hide();
    $(".gameboard2").show();
    startHardGame();
  });

  // Easy mode gameboard
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

    // Shuffle the card images randomly using Fisher yates algorithm
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

    // const shuffle = (array) => {
    //   for(let i = 0;i < array.length; i++) {
    //     const randomIndex = Math.floor(Math.random() * array.length);
    //     const temporaryValue = array[i];
    //     array[i] = array[randomIndex];
    //     array[randomIndex] = temporaryValue;
    //   }
    //   return array;
    // };
    // shuffle(cardImages);

    // Create cards in a container
    const cardsContainer = $("<div>").addClass("cards-container");
    $(".gameboard").append(cardsContainer);

    for (let i = 0; i < cardImages.length; i++) {
      const card = $("<div>")
        .addClass("card")
        .addClass("card-back")
        .attr("id", cardImages[i]);
      const cardDesign = $("<h1>").text(cardImages[i]);
      card.append(cardDesign);
      $(".cards-container").append(card);
    }

    let openedCards = [];
    let isComparing = false;
    let hasWon = false;
    let moves = 0;

    // Handle card clicks
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

    // Openable cards (not already open, not comparing)
    const canOpenCard = (card) => card.hasClass("card-back") && !isComparing;

    // Opening card
    const openCard = (card) => {
      openedCards.push(card);
      card.toggleClass("card-back");
    };

    // When two cards are open
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

    // Matching cards
    const cardsMatch = (firstLetter, secondLetter) =>
      firstLetter === secondLetter;

    // when all matching cards are opened, player win, stop compare
    const handleMatchingCards = () => {
      openedCards = [];

      if (!$(".card.card-back").length) {
        showBanner("You won!", "green");
        hasWon = true;
      }

      isComparing = false;
    };

    // If cards opened don't match, flip them back over, stop compare
    const handleNonMatchingCards = (firstCard, secondCard) => {
      setTimeout(() => {
        firstCard.toggleClass("card-back");
        secondCard.toggleClass("card-back");
        openedCards = [];
        isComparing = false;
      }, 300);
    };

    $(".card").on("click", handleCardClick);

    // Create banner for You won! and Game over! message
    const showBanner = (text, color) => {
      const $bannerDiv = $("<div>").attr("id", "banner");
      $(".gameboard").append($bannerDiv);
      const banner = $("#banner");
      banner.text(text);
      banner.css({ backgroundColor: color, display: "none" });
      banner.fadeIn();
      setTimeout(() => {
        banner.fadeOut(() => banner.remove());
      }, 5000);
    };

    // Create game console buttons
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
        timeLeft = 31;
        // Call startGame function to restart the game
        startEasyGame();
        // Fade in the gameboard
        $(".gameboard").fadeIn(300);
      });
    };

    // Click estart button to clear coutndown and reset game
    $(".restart").click(() => {
      clearInterval(countdownInterval);
      resetGame();
    });

    // Create countdown timer
    let timeLeft = 30;
    const countdown = $("<div>")
      .addClass("timeCounter")
      .html(`Easy mode: ${timeLeft} s`);
    $(".gameConsole").append(countdown);

    const updateCountdown = () => {
      $(".timeCounter").html(`Easy mode: ${timeLeft} s`);
    };

    // Create moves counter
    const movesCounter = $("<div>")
      .addClass("movesCounter")
      .html(`Moves: ${moves}`);
    $(".gameConsole").append(movesCounter);

    // Count number of moves
    const incrementMoves = () => moves++;

    // Update moves counter
    const updateMoves = () => {
      $(".movesCounter").html(`Moves: ${moves}`);
    };

    // End the game if time runs out
    const endGame = () => {
      clearInterval(countdownInterval);
      $(".card.card-back").toggleClass("card-back");
      setTimeout(() => showBanner("Time's up!", "red"), 300);
    };

    // End the game if player wins
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

    // go to hard mode game function
    const goHardGame = () => {
      $(".gameboard").fadeOut(300, () => {
        $("#banner").remove();
        $(".gameboard").empty();
        $(".gameboard").hide();

        // Reset variables
        openedCards = [];
        isComparing = false;
        hasWon = false;
        moves = 0;
        timeLeft = 40;

        // Call startHardGame function to restart the game in hard mode
        startHardGame();
        // Fade in the gameboard2
        $(".gameboard2").fadeIn(300);
      });
    };

    // Click to go hard game
    $(".hard").click(() => {
      clearInterval(countdownInterval);
      goHardGame();
    });
  };

  // Hard mode gameboard
  const startHardGame = () => {
    const cardImages = [
      "♞",
      "♞",
      "♬",
      "♬",
      "✪",
      "✪",
      "☻",
      "☻",
      "❤",
      "❤",
      "❒",
      "❒",
      "ꕤ",
      "ꕤ",
      "❆",
      "❆",
    ];

    // Shuffle the card images
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

    // Create cards in container2
    const cardsContainer2 = $("<div>").addClass("cards-container2");
    $(".gameboard2").append(cardsContainer2);

    for (let i = 0; i < cardImages.length; i++) {
      const card = $("<div>")
        .addClass("card")
        .addClass("card-back")
        .attr("id", cardImages[i]);
      const cardDesign = $("<h1>").text(cardImages[i]);
      card.append(cardDesign);
      $(".cards-container2").append(card);
    }

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
    const canOpenCard = (card) =>
      card.hasClass("card-back") && !isComparing && !card.hasClass("disabled");

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

    // If cards don't match, flip them back over for 3 seconds
    const handleNonMatchingCards = (firstCard, secondCard) => {
      // Add class to the mismatched cards
      firstCard.add(secondCard).addClass("disabled");

      setTimeout(() => {
        // Remove class after 3 seconds
        firstCard.add(secondCard).removeClass("disabled");
      }, 3000);

      setTimeout(() => {
        firstCard.toggleClass("card-back");
        secondCard.toggleClass("card-back");
        openedCards = [];
        isComparing = false;
      }, 300);
    };

    $(".card").on("click", handleCardClick);

    // Create banner for You won! and Game over! message
    const showBanner = (text, color) => {
      const $bannerDiv = $("<div>").attr("id", "banner");
      $(".gameboard2").append($bannerDiv);
      const banner = $("#banner");
      banner.text(text);
      banner.css({ backgroundColor: color, display: "none" });
      banner.fadeIn();
      setTimeout(() => {
        banner.fadeOut(() => banner.remove());
      }, 5000);
    };

    // Create game console buttons
    const buttonCounterContainer = $("<div>").addClass("gameConsole");
    $(".gameboard2").prepend(buttonCounterContainer);

    // Create restart button
    const restartButton = $("<div>").addClass("restart").text("↻");
    $(".gameConsole").append(restartButton);

    // Reset game function
    const resetGame = () => {
      $(".gameboard2").fadeOut(300, () => {
        $("#banner").remove();
        $(".gameboard2").empty();

        // Reset variables
        openedCards = [];
        isComparing = false;
        hasWon = false;
        moves = 0;
        timeLeft = 41;

        // Call startHardGame function to restart the game
        startHardGame();
        // Fade in the gameboard2
        $(".gameboard2").fadeIn(300);
      });
    };

    // Clcik restart button to reset hard game
    $(".restart").click(() => {
      clearInterval(countdownInterval);
      resetGame();
    });

    // Create countdown timer
    let timeLeft = 40;
    const countdown = $("<div>")
      .addClass("timeCounter")
      .html(`Hard mode: ${timeLeft} s`);
    $(".gameConsole").append(countdown);

    const updateCountdown = () => {
      $(".timeCounter").html(`Hard mode: ${timeLeft} s`);
    };

    // Create moves counter
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

    // Create a easy mode button
    const easyButton = $("<div>").addClass("easy").text("➠");
    $(".gameConsole").append(easyButton);

    // Go to easy mode
    const goEasyGame = () => {
      $(".gameboard2").fadeOut(300, () => {
        $("#banner").remove();
        $(".gameboard2").empty();
        $(".gameboard2").hide();

        // Reset variables
        openedCards = [];
        isComparing = false;
        hasWon = false;
        moves = 0;
        timeLeft = 31;

        // Call startEasyGame function
        startEasyGame();
        // Fade in the gameboard2
        $(".gameboard").fadeIn(300);
      });
    };

    // Click to go easy game
    $(".easy").click(() => {
      clearInterval(countdownInterval);
      goEasyGame();
    });
  };
});
