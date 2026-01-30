# **App Name**: FinTrade League

## Core Features:

- Stock/Options Mode Toggle: A toggle switch in the left panel to switch between Stock and Options trading modes.  The selected mode is saved in the global state.
- Multi-Asset Investment System: Allows players to select multiple assets, enter investment amounts for each, and see the total invested amount updating live, which tool prevents exceeding the ₹1,00,000 total balance. It also has features for removing assets before submitting investments.
- Local Multiplayer Support: Implements a socket service placeholder using WebSocket style architecture to simulate local network 2-player games. Includes functions for creating/joining rooms, syncing game state, and sending/receiving investment data.
- Rotating Investment Tips: A card that displays auto rotating tips.
- ML Analysis Service Placeholder: Service that analyzes user performance, risk behavior, and improvement suggestions based on game data.

## Style Guidelines:

- Primary background: Dark Navy / Charcoal (#0B1220) for a professional look.
- Card background: Slightly lighter dark (#111827) to distinguish content areas.
- Accent colors: Professional Green (profit indicators), Professional Red (loss indicators), and Soft Blue (secondary highlights).
- Body and headline font: 'Inter' (sans-serif) for a modern, objective feel, suitable for both headlines and body text.
- Smooth hover elevation on cards and buttons for interactivity.
- Subtle number counter animations for financial data updates.
- Dashboard with a league badge and name in the top left, and profile card (avatar, username, win rate, win streak, total matches) in the top right.