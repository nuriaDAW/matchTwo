/* 
    Nuria Barrios Santos <nuria.barsan@educa.jcyl.es>
    Práctica 01 - Juego de parejas
*/

// Game starts when the page is fully loaded
window.addEventListener('load', start);

// Class for cards. Objects of this class will store image attributes of the html "cards" 
class Card {
    // Constructor
    constructor(nom, src) {
        this.nom = nom;
        this.src = src;
    }
}

// Function to start/restart the game
function start() {
    const cards = document.querySelectorAll(".flip-card-inner"); // Returns a list with all "cards"
    const cardsBack = document.querySelectorAll(".flip-card-back"); // Returns a list with all backs of the "cards". Will be the parents of img elements
    const buttons = document.querySelectorAll("button"); // Returns a list with all buttons
    const arrImg = [new Card("afro", "img/afro.svg"), new Card("boy", "img/boy.svg"), new Card("girl", "img/girl.svg")]; // Array of images
    const arrIndex = []; // Array to store image indexes twice in random order
    const length = 6; // Max length of arrIndex. It's the total number of "cards"
    let prevCard = null; // Previous card turned
    let time = 0; // Variable to store the id returned from setTimeout()
    
    // Function executed when clicks a card. Turns the card for a second, unless it match another turned card
    function turnCard(event) {
        let card = this; // Assigns actual element (with "flip-card-inner" class) to card 
        card.style.transform = "rotateY(180deg)"; // Sets the style property transform of card to a rotation of 180 degree around its Y-axis 

        if (prevCard && (prevCard.id == card.id)) { // If previous card exists and it is the same
            prevCard = null; // assigns it null 
        }

        // If previous card exists and its image is the same as actual card and previuos card has not turned around again
        if (prevCard &&(card.querySelector(".flip-card-back img").src == prevCard.querySelector(".flip-card-back img").src) && prevCard.style.transform == "rotateY(180deg)") {
            clearTimeout(time); // Stops setTimeout() execution associated with prevCard (that is the active setTimeout())
            card.removeEventListener("click", turnCard); // this card cannot turn again until game restart
            prevCard.removeEventListener("click", turnCard); // previous card cannot turn again until game restart
        } else {
            time = setTimeout(function () {
                card.removeAttribute("style"); // Remove the style attribute (with the rotation) after 1 second (turns around the card)
            }, 1000);
        }

        prevCard = card;

        event.stopPropagation(); // Prevents bubbling. However, in this case, bubbling has not effects
    }

    // Function executed when clicks "Resultado" button. Turns around all the cards
    function resolve() {
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.transform = "rotateY(180deg)";
            cards[i].removeEventListener("click", turnCard); // Cards cannot turn again until game restart
        }
    }

    do {
        const randNum = Math.floor(Math.random() * arrImg.length); // Random number between 0 and the length of the array of images
        let count = countInArray(arrIndex, randNum); // Coincidences of random number in arrIndex

        if (count < 2) { // If coincidences are less than two
            // Creates a new image element and sets attributes 
            const newImg = document.createElement("img");
            newImg.setAttribute("src", arrImg[randNum].src);
            newImg.setAttribute("alt", arrImg[randNum].nom);
            newImg.setAttribute("title", arrImg[randNum].nom);

            cards[arrIndex.length].removeAttribute("style"); // Removes previous style attribute of card at position coincident with current arrIndex length
            cards[arrIndex.length].addEventListener("click", turnCard); // Sets up turnCard() function that will be called on card click
            cards[arrIndex.length].setAttribute("id", `card${arrIndex.length}`);

            cardsBack[arrIndex.length].innerHTML = ""; // Replaces inner html on the back part of the "card" with an empty string
            cardsBack[arrIndex.length].appendChild(newImg); // Adds img element to the end of the list of children of the div corresponding to the back part of the "card"

            arrIndex.push(randNum); // Adds the random generated number to the end of arrIndex and returns the new length of the array
        }
    } while (arrIndex.length < length);

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent == "Reiniciar") { // If text content of button is "Reiniciar" 
            buttons[i].addEventListener("click", start); // sets up start() function that will be called on button click
        } else{
            // stopPropagation() prevents bubbling. However, in this case, bubbling has not effects. The listener would be automatically removed when invoked
            buttons[i].addEventListener("click", (e) => { e.stopPropagation(); resolve(); }, { once : true });
        }
    }
}

// Function to count coincidences of a variable passed as a parameter in an array passed as a parameter
function countInArray(array, num) {
    let count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] == num) {
            count++;
        }
    }
    return count;
}