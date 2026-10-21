
import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const playerStatus = document.getElementById("playerStatus");
const gameContent = document.getElementById("gameContent");
const characterName = document.getElementById("characterName");
const createCharacterBtn = document.getElementById("createCharacterBtn");
const characterMessage = document.getElementById("characterMessage");

let currentUser = null;

// Check authentication and load saved character
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    gameContent.hidden = true;

    if (!user) {
        playerStatus.textContent = "Please sign in to play.";
        return;
    }

    playerStatus.textContent = "Loading player...";

    try {
        const playerRef = doc(db, "players", user.uid);
        const playerSnapshot = await getDoc(playerRef);

        // Ignore a result if the account changed while loading
        if (auth.currentUser?.uid !== user.uid) return;

        playerStatus.textContent = user.isAnonymous
            ? "Playing as Guest"
            : "Signed in Player";

        if (playerSnapshot.exists()) {
            const player = playerSnapshot.data();

            characterMessage.textContent =
                `Welcome back, ${player.name}! ` +
                `Day ${player.day} — ${player.career}.`;

            characterName.value = player.name;
            characterName.disabled = true;
            createCharacterBtn.hidden = true;
        } else {
            characterName.disabled = false;
            createCharacterBtn.hidden = false;
            characterMessage.textContent = "";
        }

        gameContent.hidden = false;

    } catch (error) {
        console.error("Error loading character:", error);
        playerStatus.textContent =
            "Unable to load your character. Please try refreshing.";
    }
});

// Create and save character
createCharacterBtn.addEventListener("click", async () => {
    const name = characterName.value.trim();

    if (!currentUser || auth.currentUser?.uid !== currentUser.uid) {
        characterMessage.textContent = "Please sign in first.";
        return;
    }

    if (!name) {
        characterMessage.textContent =
            "Please enter a character name.";
        return;
    }

    createCharacterBtn.disabled = true;
    characterMessage.textContent = "Saving character...";

    try {
        const playerRef = doc(db, "players", currentUser.uid);

        const newPlayer = {
            name: name,
            age: 22,
            career: "Ordinary Citizen",
            day: 1,
            money: 100,
            reputation: 10,
            influence: 0,
            createdAt: serverTimestamp()
        };

        // Create only if a character does not already exist
        const existing = await getDoc(playerRef);

        if (existing.exists()) {
            characterMessage.textContent =
                "A character already exists for this account.";
            return;
        }

        await setDoc(playerRef, newPlayer);

        characterMessage.textContent =
            `Welcome, ${name}! Your character has been saved.`;

        characterName.disabled = true;
        createCharacterBtn.hidden = true;

    } catch (error) {
        console.error("Error saving character:", error);
        characterMessage.textContent =
            "Unable to save character: " + error.message;
    } finally {
        createCharacterBtn.disabled = false;
    }
});
