// wait for document to load
$(() => {
    
// Create card images
const cardImages = ['♥', '♥', '☁', '☁', '◈', '◈', '♫', '♫', '☺', '☺', '☀', '☀', '✰', '✰', '✿', '✿'];

// Shuffle the card images randomly
const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
shuffle(cardImages);

// Create card elements
    for (let i = 0; i < cardImages.length; i++) {;
        const card = $('<div>').addClass('card');
        const cardDesign = $('<h1>').text(cardImages[i]);
        const cardBack = $(card).attr('id', cardImages[i])
        card.append(cardDesign);
        $('.gameboard').append(card);
    }

})