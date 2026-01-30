# 4Guys1Code
### Theme: Stock Market & FinTech
### ID: CS06SF
### Statement: Gamified Virtual Trading League for Students

## TradeLeague: A Gamified Approach to Student Trading
TradeLeague is a project built to bridge the gap between financial literacy and actual engagement. Most students find the stock market intimidating or dry; we designed this platform to turn learning into a competitive, high-stakes game. By simulating real-world market movements in a 1v1 arena, players can test their intuition and analytical skills without the risk of losing real capital.
The Concept
The core idea is simple: provide a space where students can learn the mechanics of stock and options trading through a progression-based league system. The game focuses on research-backed decision-making rather than pure luck. Before every trade, players are given specific information about an asset that hints at its future performance.
Progression and Leagues
A player's journey is defined by their total profit. As the portfolio grows, the player advances through four distinct tiers. This ranking system is designed to provide a sense of status and achievement within the student community.

## Rank Profit Threshold Status Description

- **Level 1: NPC** — 0 to 50,000  
  The entry point for beginners.

- **Level 2: Valid** — 50,001 to 200,000  
  Demonstrates a basic understanding of market trends.

- **Level 3: Main Character** — 200,001 to 1,000,000  
  A high-tier trader with consistent wins.

- **Level 4: G.O.A.T** — 1,000,000+  
  Greatest of all time.


## Game Mechanics
Onboarding and Dashboard
The experience begins with an educational slideshow detailing the game's objectives. Once logged in, the player reaches a responsive dashboard. Key features include:
Mode Toggle: Switch between standard Stock Market trading and the higher volatility of Option Trading.
Profit Tracking: A visual timeline showing portfolio growth and current win streaks.
League Leaderboard: A live list showing how other players in the same tier are performing.
1v1 Matchmaking
For the purpose of this hackathon, we have optimized the game for local connectivity. One player hosts a session, and another joins via the local network. Both players start with a virtual balance of 100,000.
The Trading Arena
During a match, both players are presented with a selection of asset "cards." Each card represents a stock or commodity (e.g., SagarCorporation, NithinLimited, or Gold).
Asset Analysis: Clicking a card reveals a detailed view with a price chart and relevant news snippets.
Investment: Players must decide how much of their 100,000 to allocate to various assets based on the news provided.
Outcome: Once both players submit their choices, the trade "closes." The growth or decline of an asset is predetermined by the news context provided earlier in the round.

The winner of the match is the player who ends the session with the highest total profit, which is then added to their global account balance.
Asset Data and Influence Factors
To make the simulation realistic, we generated specific assets with corresponding growth triggers:
SagarCorporation: Influenced by green energy policy shifts.
NithinLimited: Heavily impacted by quarterly earnings reports and supply chain logistics.
Digital Gold: Acts as a safe haven during periods of simulated market volatility.
TechNova: Highly sensitive to regulatory news and patent approvals.
Future Integration: ML Performance Analysis
After the game concludes, we have reserved a module for a Machine Learning engine. This feature will analyze the player's choices versus the information provided, offering a "post-game breakdown." It will identify whether a player’s losses were due to over-leveraging or misinterpreting the news, providing a genuine educational feedback loop.
