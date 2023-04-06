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

    // Create banner for You won! and Game over! message
    const showBanner = (text, color) => {
      const $bannerDiv = $('<div>').attr('id', 'banner');
      $('.container').append($bannerDiv);
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

    // Add event handler and toggle class
    const eventHandler = (event) => {
      const clickedCard = $(event.currentTarget);
      
      // Check if the card is already open and comparison is not in progress
      if (clickedCard.hasClass("card-back") && !isComparing) {
        clickedCard.toggleClass("card-back");
    
        // Add the opened card to the array
        openedCards.push(clickedCard);
    
        // Check if there are two opened cards
        if (openedCards.length === 2) {
          isComparing = true;
          const firstCard = openedCards[0];
          const secondCard = openedCards[1];
    
          const firstLetter = firstCard.find("h1").text();
          const secondLetter = secondCard.find("h1").text();
    
          // Check if the two cards match
          if (firstLetter === secondLetter) {
            openedCards = [];
            
            // Check if all cards are matched and opened
            if ($(".card.card-back").length === 0) {
              showBanner("You won!", "green");
              hasWon = true;
            }
            isComparing = false;
          } else {
            setTimeout(() => {
              firstCard.toggleClass("card-back");
              secondCard.toggleClass("card-back");
              openedCards = [];
              isComparing = false;
            }, 300);
          }
        }
      }
    };    
    $(".card").on("click", eventHandler);
  
    let timeLeft = 30;
    const countdown = $("<div>")
      .addClass("countdown")
      .text(`Time left: ${timeLeft} seconds`);
    $(".gameboard").before(countdown);
  
    const countdownInterval = setInterval(() => {
      timeLeft--;
      countdown.text(`Time left: ${timeLeft} seconds`);
  
      if (!hasWon && timeLeft === 0) {
        clearInterval(countdownInterval);
        $(".card.card-back").toggleClass("card-back");
        setTimeout(() => {
          showBanner("Game over!", "red");
        }, 300);
      }
      if (hasWon) {
        clearInterval(countdownInterval);
      }
    }, 1000);
  });
  