
import { auth, db } from "./firebase-config.js";
import { getDailyEvent, applyDecision } from "./engine.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const $ = (id) => document.getElementById(id);

let currentUser = null;
let player = null;
let saving = false;

// Show the current player's statistics and daily event
function renderGame() {
    $("gameContent").hidden = true;
    $("dailyGame").hidden = false;

    $("playerName").textContent = player.name;
    $("dayValue").textContent = player.day;
    $("careerValue").textContent = player.career;
    $("moneyValue").textContent = player.money;
    $("reputationValue").textContent = player.reputation;
    $("influenceValue").textContent = player.influence;

    const event = getDailyEvent(player.day);

    $("eventTitle").textContent = event.title;
    $("eventDescription").textContent = event.description;
    $("decisionOutcome").textContent = "";

    const container = $("choicesContainer");
    container.replaceChildren();

    event.choices.forEach((choice, index) => {
        const button = document.createElement("button");

        button.textContent = choice.text;
        button.style.display = "block";
        button.style.margin = "12px auto";
        button.style.padding = "12px";

        button.addEventListener("click", () => {
            makeDecision(index);
        });

        container.appendChild(button);
    });
}

// Save a decision to Firestore
async function makeDecision(choiceIndex) {
    if (saving || !player || !currentUser) return;

    saving = true;

    const buttons = $("choicesContainer")
        .querySelectorAll("button");

    buttons.forEach((button) => {
        button.disabled = true;
    });

    $("decisionOutcome").textContent = "Saving decision...";

    const userId = currentUser.uid;
    const expectedDay = player.day;

    try {
        const playerRef = doc(db, "players", userId);
        let result;

        await runTransaction(db, async (transaction) => {
            const snapshot = await transaction.get(playerRef);

            if (!snapshot.exists()) {
                throw new Error("Character not found.");
            }

            const savedPlayer = snapshot.data();

            // Prevent duplicate decisions for the same day
            if (savedPlayer.day !== expectedDay) {
                throw new Error(
                    "Game progress changed. Please refresh."
                );
            }

            result = applyDecision(
                savedPlayer,
                choiceIndex
            );

            transaction.update(playerRef, {
                money: result.player.money,
                reputation: result.player.reputation,
                influence: result.player.influence,
                day: result.player.day,
                updatedAt: serverTimestamp()
            });
        });

        if (auth.currentUser?.uid !== userId) return;

        player = result.player;
        renderGame();

        $("decisionOutcome").textContent =
            result.outcome;

    } catch (error) {
        console.error("Decision error:", error);

        $("decisionOutcome").textContent =
            "Unable to save decision: " + error.message;

        buttons.forEach((button) => {
            button.disabled = false;
        });

    } finally {
        saving = false;
    }
}

// Create a new character
$("createCharacterBtn").addEventListener(
    "click",
    async () => {
        if (saving || !currentUser) return;

        const name = $("characterName").value.trim();

        if (!name) {
            $("characterMessage").textContent =
                "Please enter a character name.";
            return;
        }

        saving = true;
        $("createCharacterBtn").disabled = true;

        const userId = currentUser.uid;

        try {
            const playerRef = doc(db, "players", userId);

            const newPlayer = {
                name,
                age: 22,
                career: "Ordinary Citizen",
                day: 1,
                money: 100,
                reputation: 10,
                influence: 0,
                createdAt: serverTimestamp()
            };

            await runTransaction(db, async (transaction) => {
                const snapshot = await transaction.get(playerRef);

                if (snapshot.exists()) {
                    throw new Error(
                        "Character already exists."
                    );
                }

                transaction.set(playerRef, newPlayer);
            });

            if (auth.currentUser?.uid !== userId) return;

            player = newPlayer;
            renderGame();

        } catch (error) {
            $("characterMessage").textContent =
                "Unable to create character: " +
                error.message;
        } finally {
            saving = false;
            $("createCharacterBtn").disabled = false;
        }
    }
);

// Check login and load saved progress
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    player = null;

    $("gameContent").hidden = true;
    $("dailyGame").hidden = true;

    if (!user) {
        $("playerStatus").textContent =
            "Please sign in to play.";
        return;
    }

    $("playerStatus").textContent = "Loading game...";

    try {
        const snapshot = await getDoc(
            doc(db, "players", user.uid)
        );

        if (auth.currentUser?.uid !== user.uid) return;

        $("playerStatus").textContent = user.isAnonymous
            ? "Playing as Guest"
            : "Signed in Player";

        if (snapshot.exists()) {
            player = snapshot.data();
            renderGame();
        } else {
            $("gameContent").hidden = false;
        }

    } catch (error) {
        console.error("Loading error:", error);

        $("playerStatus").textContent =
            "Unable to load game: " + error.message;
    }
});
