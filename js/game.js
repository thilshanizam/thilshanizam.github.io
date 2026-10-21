
import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const playerStatus =
    document.getElementById("playerStatus");

const gameContent =
    document.getElementById("gameContent");

const characterName =
    document.getElementById("characterName");

const createCharacterBtn =
    document.getElementById("createCharacterBtn");

const characterMessage =
    document.getElementById("characterMessage");

// Check whether the player is logged in
onAuthStateChanged(auth, (user) => {

    if (user) {

        playerStatus.textContent = user.isAnonymous
            ? "Playing as Guest"
            : "Signed in Player";

        gameContent.hidden = false;

    } else {

        playerStatus.textContent =
            "Please sign in to start playing.";

        gameContent.hidden = true;
    }
});

// Create a character
createCharacterBtn.addEventListener("click", () => {

    const name = characterName.value.trim();

    if (!name) {
        characterMessage.textContent =
            "Please enter a character name.";
        return;
    }

    characterMessage.textContent =
        `Welcome, ${name}! Your political journey begins.`;

});
