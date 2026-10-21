
import { events } from "./events.js";

// Select the event for the current day
export function getDailyEvent(day) {
    const index = (day - 1) % events.length;
    return events[index];
}

// Keep a number within allowed limits
function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
}

// Apply a player's decision
export function applyDecision(player, choiceIndex) {

    const event = getDailyEvent(player.day);
    const choice = event.choices[choiceIndex];

    if (!choice) {
        throw new Error("Invalid decision");
    }

    const effects = choice.effects;

    const updatedPlayer = {
        ...player,

        money: Math.max(
            0,
            player.money + effects.money
        ),

        reputation: clamp(
            player.reputation + effects.reputation,
            0,
            100
        ),

        influence: clamp(
            player.influence + effects.influence,
            0,
            100
        ),

        day: player.day + 1
    };

    return {
        player: updatedPlayer,
        outcome: choice.outcome,
        eventTitle: event.title,
        choiceText: choice.text
    };
}
