
import { auth } from "./firebase-config.js";

import {
    signInAnonymously,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

// Watch for changes to the player's login status
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Player signed in:", user.uid);

        if (user.isAnonymous) {
            console.log("Player is a guest");
        } else {
            console.log("Player has a registered account");
        }
    } else {
        console.log("No player signed in");
    }
});

// Start a guest session
async function playAsGuest() {
    try {
        const userCredential = await signInAnonymously(auth);

        console.log(
            "Guest account created:",
            userCredential.user.uid
        );

        window.location.href = "game.html";

    } catch (error) {
        console.error("Guest login failed:", error);
        alert("Unable to start guest game: " + error.message);
    }
}

// Connect the Guest button to the function
document.getElementById("guestBtn")
    .addEventListener("click", playAsGuest);
