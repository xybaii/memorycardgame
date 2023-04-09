$(() => {
  // ========== Game home page ========== //
    const nameInput = $('#name-input');
    const easyModeButton = $('#easyMode');
    const easyModeInstructionDiv = $('.easyModeInstruction');
    const startGameButton = $('<button>').text('Start Game');
    const hardModeButton = $('#hardMode');
    const hardModeInstructionDiv = $('.hardModeInstruction');
    const startChallengeButton = $('<button>').text('Start Challenge');

    $('.gameboard').hide();
  
    // ========== If chose easy mode button ========== //
    easyModeButton.on('click', () => {
      const playerName = nameInput.val();
  
      $('.gamehomepage').hide();
      easyModeInstructionDiv.show();
  

      easyModeInstructionDiv.html(`
        <h2>Hello ${playerName}!</h2>
        <p>Here are the game play instructions:</p>
        <ul>
          <li>Memorize the positions of the cards when you flip them over.</li>
          <li>If the cards match, they will stay flipped over.</li>
          <li>If the cards do not match, they will flip back over.</li>
          <li>The game will be over if you are unable to flip all matching cards within 30s.</li>
          <li>Break your best record with the longest time left </li>
          <li>and least moves taken to finish the game.</li>
        </ul>
      `);
  
      easyModeInstructionDiv.append(startGameButton);
    });
  
    startGameButton.on('click', () => {
      easyModeInstructionDiv.hide();
      $('.gameboard').show();
      startEasyGame();
    });
  
    // ========== If chose hard mode button ========== //
    $('.gameboard2').hide();

    hardModeButton.on('click', () => {
      const playerName = nameInput.val();
  
      $('.gamehomepage').hide();
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
        </ul>
      `);
  
      hardModeInstructionDiv.append(startChallengeButton);
    });
  
    startChallengeButton.on('click', () => {
      hardModeInstructionDiv.hide();
      $('.gameboard2').show()
      startHardGame();
    });
  
  // ========== Easy mode gameboard ========== //
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

    // Create cards in a container
    const cardsContainer = $('<div>').addClass('cards-container');
    $('.gameboard').append(cardsContainer);

    for (let i = 0; i < cardImages.length; i++) {
      const card = $("<div>")
        .addClass("card")
        .addClass("card-back")
        .attr("id", cardImages[i]);
      const cardDesign = $("<h1>").text(cardImages[i]);
      card.append(cardDesign);
      $(".cards-container").append(card);
    }

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
        timeLeft = 31;
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
    let timeLeft = 30;
    const countdown = $("<div>")
      .addClass("timeCounter")
      .html(`Easy mode: ${timeLeft} s`);
    $(".gameConsole").append(countdown);

    const updateCountdown = () => {
      $(".timeCounter").html(`Easy mode: ${timeLeft} s`);
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

    const goHardGame = () => {
      // Fade out the gameboard2
      $(".gameboard").fadeOut(300, () => {
        // remove banner immediately if reset
        $("#banner").remove();
        // Clear gameboard2
        $(".gameboard").empty();
        $(".gameboard").hide();
        // Reset variables
        openedCards = [];
        isComparing = false;
        hasWon = false;
        moves = 0;
        timeLeft = 40;
        // Call startGame function to restart the game
        startHardGame();
        // Fade in the gameboard2
        $(".gameboard2").fadeIn(300);
      });
    };
    

    // Add event listener to restart button
    $('.hard').click(() => {
      clearInterval(countdownInterval);
      goHardGame();
    });
  };

  // ========== Hard mode gameboard ========== //
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

    // Create cards in container
    const cardsContainer2 = $('<div>').addClass('cards-container2');
    $('.gameboard2').append(cardsContainer2);

    for (let i = 0; i < cardImages.length; i++) {
      const card = $("<div>")
        .addClass("card")
        .addClass("card-back")
        .attr("id", cardImages[i]);
      const cardDesign = $("<h1>").text(cardImages[i]);
      card.append(cardDesign);
      $(".cards-container2").append(card);
    }

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

    // If cards don't match, flip them back over
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

    // Create game buttons and counter container
    const buttonCounterContainer = $("<div>").addClass("gameConsole");
    $(".gameboard2").prepend(buttonCounterContainer);

    // Create restart button
    const restartButton = $("<div>").addClass("restart").text("↻");
    $(".gameConsole").append(restartButton);

    // Reset game function
    const resetGame = () => {
      // Fade out the gameboard2
      $(".gameboard2").fadeOut(300, () => {
        // remove banner immediately if reset
        $("#banner").remove();
        // Clear gameboard2
        $(".gameboard2").empty();
        // Reset variables
        openedCards = [];
        isComparing = false;
        hasWon = false;
        moves = 0;
        timeLeft = 41;
        // Call startGame function to restart the game
        startHardGame();
        // Fade in the gameboard2
        $(".gameboard2").fadeIn(300);
      });
    };
    

    // Add event listener to restart button
    $('.restart').click(() => {
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

    const goEasyGame = () => {
      // Fade out the gameboard2
      $(".gameboard2").fadeOut(300, () => {
        // remove banner immediately if reset
        $("#banner").remove();
        // Clear gameboard2
        $(".gameboard2").empty();
        $(".gameboard2").hide();
        // Reset variables
        openedCards = [];
        isComparing = false;
        hasWon = false;
        moves = 0;
        timeLeft = 31;
        // Call startGame function to restart the game
        startEasyGame();
        // Fade in the gameboard2
        $(".gameboard").fadeIn(300);
      });
    };
    

    // Add event listener to restart button
    $('.easy').click(() => {
      clearInterval(countdownInterval);
      goEasyGame();
    });
  };

});
