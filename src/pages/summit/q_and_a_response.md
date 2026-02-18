# Summit Q&A Response

This document addresses community questions about Summit's game design, economics, and mechanics.

---

## 1. Season Structure: Single vs Multiple Seasons

**Question:** Is Summit designed as a single-season game (running until rewards are exhausted or for a fixed number of days), or will there be multiple seasons (fixed duration with any remaining rewards rolling over)?

**Answer:** Summit is designed as a single-season game with a fixed duration of approximately 3 months. The game has a `terminal_timestamp` set at deployment, and the reward pool of ~100,000 $SURVIVOR tokens is distributed until this endpoint is reached.

The current documentation does not describe multiple seasons or rollover mechanics. Once the terminal timestamp is reached and rewards are distributed, the game ends.

---

## 2. Competitiveness Without Potions

**Question:** Is Summit still fun and competitive without potions? Can someone realistically hold Summit without them? If not, does competition become purely market-gated, shifting toward capital endurance?

**Answer:** Potions are central to sustained competitive play, but the system includes important mitigations:

### Core Mechanics

- **24-hour death cooldown** without revival potions
- **Spirit upgrade** can reduce cooldown to 4 hours minimum
- **Multi-attack sequences** require revival potions to chain attacks atomically
- **Extra lives** (up to 4,000) are critical for defense

### Can Someone Hold Summit Without Potions?

Technically yes, but with significant limitations:

- Vulnerable during 4-24 hour cooldown after being defeated
- Cannot defend against coordinated multi-attack assaults
- Cannot immediately counter-attack after losing the Summit

### Mitigations for Non-Potion Players

1. **Quest System**: All beasts can earn up to 0.50 $SURVIVOR through activity-based quests (see Section 4), providing rewards without needing to hold Summit

2. **Diplomacy System**: Beasts with matching names can earn ~1% of rewards per beast when an ally holds Summit, providing passive income without direct competition

3. **Strategic Timing**: Attack during off-peak hours when competition is lower and dominant beasts are on cooldown

4. **Beast Upgrades**: Spirit reduces cooldown; Luck provides critical hit chance—both reduce potion dependency

The economic model (discussed in Question 3) also ensures that heavy potion spending supports all $SURVIVOR holders through buyback pressure.

---

## 3. Market Manipulation Risk (Potion Cornering)

**Question:** How might players take advantage of the system? For example, buying up a large number of potions at launch to push prices up, and temporarily control both Summit and the potion market.

**Answer:** This risk has been **significantly mitigated** through the potion distribution mechanism.

### TWAMM-Based Distribution

Potions are distributed via Ekubo's **Time-Weighted Average Market Maker (TWAMM)**—a continuous clearing auction:

| Potion Type | Daily Emission |
| ----------- | -------------- |
| Extra Life  | 4,860          |
| Revival     | 97,206         |
| Attack      | 97,206         |
| Poison      | 97,206         |

### Why TWAMM Prevents Cornering

1. **No Front-Running Advantage**: Sales execute continuously, not in discrete batches. A whale buying at time T gets the same average price as someone buying later.

2. **Time-Distributed Price Impact**: Large buy orders are absorbed over time. Price rises gradually, and the manipulator pays increasingly higher prices for later units.

3. **Continuous Supply**: With 97,206 potions/day streaming continuously, hoarding requires sustained capital commitment. Tomorrow brings another 97,206 potions.

4. **No Discrete Launch Window**: Unlike traditional token launches, there's no single block where all supply is available—no MEV extraction opportunity.

### Remaining Considerations

- **Short-term price spikes** can still occur during high demand, but this is intended behavior (dynamic pricing)
- **Capital concentration** still provides advantage, but through fair market pricing, not manipulation

---

## 4. Participation Density and the Quest System

**Question:** Under this system, smaller holders may struggle to sustain potion spending, which could create participation-density risk. I understand quests are intended to help mitigate this. I'd appreciate further clarity on the quest system.

**Answer:** The quest system provides activity-based rewards for all participating beasts.

### Quest System Overview

Quests are **activity-based milestones** that reward participation rather than just Summit dominance. Each beast can complete quests independently and earn rewards based on their individual actions.

### Quest Objectives and Rewards

| Quest                  | Requirement                       | Reward               |
| ---------------------- | --------------------------------- | -------------------- |
| **Attack the Summit**  | Attack with Beast                 | 0.05 $SURVIVOR       |
| **Use Revival Potion** | Revive Beast using revival potion | 0.05 $SURVIVOR       |
| **Use Attack Potion**  | Attack using attack potions       | 0.05 $SURVIVOR       |
| **Capture Summit**     | Successfully take the Summit      | 0.05 $SURVIVOR       |
| **Hold Summit 10s**    | Hold Summit for 10+ seconds       | 0.10 $SURVIVOR       |
| **Max Attack Streak**  | Achieve 10-attack streak          | 0.05 $SURVIVOR       |
| **Level Up**           | Gain bonus levels from XP         | Variable (see below) |

### Level Up Quest Rewards (Progressive)

| Bonus Levels | Reward         |
| ------------ | -------------- |
| 1 level      | 0.02 $SURVIVOR |
| 3 levels     | 0.05 $SURVIVOR |
| 5 levels     | 0.09 $SURVIVOR |
| 10+ levels   | 0.15 $SURVIVOR |

**Note:** Level rewards are mutually exclusive—you earn the highest tier achieved, not cumulative.

### Maximum Rewards Per Beast

**Total possible per beast: 0.50 $SURVIVOR**

Breakdown of maximum:

- Attack quests: 0.05 + 0.05 + 0.05 = 0.15 $SURVIVOR
- Summit quests: 0.05 + 0.10 = 0.15 $SURVIVOR
- Streak quest: 0.05 $SURVIVOR
- Level quest (max): 0.15 $SURVIVOR
- **Total: 0.50 $SURVIVOR**

### How Quest Tracking Works

The contract tracks quest completion per-beast using flags:

- `captured_summit` - Set when beast takes Summit
- `used_revival_potion` - Set when revival potion is used
- `used_attack_potion` - Set when attack potion is used
- `max_attack_streak` - Set when 10-attack streak is achieved

Other quests are derived from existing state:

- Death tracked via `last_death_timestamp > 0`
- Summit hold time via `summit_held_seconds`
- Levels via `bonus_xp` calculation

### Why This Helps Smaller Holders

1. **No Summit dominance required**: Most quests can be completed without holding Summit
2. **One-time completion**: Quest rewards are earned once per beast, not competed for
3. **Activity-based**: Rewards participation, not capital
4. **Accessible goals**: Attack streak and level-up don't require potions

---

## 5. Reward Allocation: Summit vs Quests

**Question:** How much Survivor reward is allocated to Summit holders vs. quest rewards (previously top 5,000 structure)?

**Answer:** Based on the implementation:

### Summit Holder Rewards (~50,000 $SURVIVOR)

- **Rate**: ~0.01 $SURVIVOR per second to the Summit holder
- **Duration**: 90 days = ~7.78M seconds
- **Diplomacy sharing**: Each Diplomacy beast receives ~1% of holder rewards
- **Maximum Diplomacy beasts**: 75 per name combination

### Example Distribution Per Second

| Diplomacy Beasts | Each Gets | Summit Holder Gets |
| ---------------- | --------- | ------------------ |
| 0                | -         | 0.01 $SURVIVOR     |
| 10               | 0.0001    | 0.009 $SURVIVOR    |
| 75 (max)         | 0.0001    | 0.0025 $SURVIVOR   |

### Quest Rewards (Variable Based on Participation)

Quest rewards are **not from a fixed pool** but are minted based on completion:

| Metric              | Calculation       |
| ------------------- | ----------------- |
| Max per beast       | 0.50 $SURVIVOR    |
| Total beasts        | ~93,500           |
| **Theoretical max** | ~46,750 $SURVIVOR |

**However**, actual quest rewards will be lower because:

- Not all beasts will participate
- Not all beasts will complete all quests
- Many beasts won't achieve 10+ bonus levels

### Realistic Quest Reward Estimate

| Participation Rate   | Avg Completion  | Est. Quest Rewards |
| -------------------- | --------------- | ------------------ |
| 33% (~31,000 beasts) | 50% (0.25 each) | ~7,750 $SURVIVOR   |
| 50% (~46,750 beasts) | 50% (0.25 each) | ~11,688 $SURVIVOR  |
| 33% (~31,000 beasts) | 80% (0.40 each) | ~12,400 $SURVIVOR  |

---

## 6. Beast Tiers and Quest Farming Prevention

**Question:** If all Beasts are eligible through quests, is there a tier or rarity breakdown? And what prevents someone from buying T5 Beasts purely to farm quest rewards?

**Answer:** Quest rewards are **uniform across all tiers**—every beast can earn up to 0.50 $SURVIVOR regardless of tier.

### What Prevents T5 Quest Farming?

**1. Activity Requirements**

Quests require actual gameplay, not just ownership:

- Must attack (and likely die) to earn attack quest
- Must use potions to earn potion quests
- Must take Summit to earn capture quest
- Must hold for 10 seconds to earn hold quest
- Must level up through combat to earn level quests

**2. Potion Costs**

Completing all quests requires spending on potions:

- Revival potion quest requires buying revival potions
- Attack potion quest requires buying attack potions
- These costs may exceed the 0.10 $SURVIVOR reward for those two quests

**3. Time Investment**

- Achieving 10-attack streak requires sustained play
- Leveling up 10+ times requires significant XP grinding
- Taking and holding Summit requires competing against others

**4. Economic Analysis**

| Quest               | Potion Cost?     | Net Profit?            |
| ------------------- | ---------------- | ---------------------- |
| Attack Summit (die) | No               | +0.05                  |
| Use Revival Potion  | Yes              | Depends on price       |
| Use Attack Potion   | Yes              | Depends on price       |
| Capture Summit      | Likely           | Depends on competition |
| Hold 10 seconds     | No (if captured) | +0.10                  |
| Max Attack Streak   | No               | +0.05                  |
| Level Up (1-10)     | No               | +0.02 to +0.15         |

**Minimum "free" rewards**: 0.05 (attack) + 0.05 (streak) + 0.02 (1 level) = **0.12 $SURVIVOR per beast**

For T5 farming to be profitable, the beast acquisition cost must be less than ~0.12 $SURVIVOR (~$0.03 at current prices).

---

## 7. Quest Feasibility for Large Holders

**Question:** How feasible is quest completion for large holders (e.g., 1,500+ Beasts) if quests are per-Beast? What will happen with unclaimed quest allocations?

**Answer:** The quest system is designed to support large holders through **batch claiming** and **progressive accumulation**.

### Batch Claiming Support

The `claim_quest_rewards` function accepts an array of beast token IDs:

```
fn claim_quest_rewards(ref self: ContractState, beast_token_ids: Span<u32>)
```

**Features:**

- Claim for multiple beasts in a single transaction
- Batch event emission (295 items per event to stay within limits)
- Only transfers if rewards are available

### Quest Completion Strategy for Large Holders

**Automated/Low-Effort Quests:**

- Attack quest: Script attacks across beasts
- Level-up quest: Accumulates naturally from attacks

**Manual/Competitive Quests:**

- Capture Summit: Requires winning
- Hold 10 seconds: Requires defending
- Max attack streak: Requires 10 consecutive attacks

**Realistic Approach for 1,500+ Beasts:**

1. Batch attack with all beasts (earns attack + some level XP)
2. Selectively compete for Summit with strongest beasts
3. Claim rewards periodically in batches

### Unclaimed Quest Allocations

**Quest rewards are not from a fixed pool—they're minted on claim.**

This means:

- No "unclaimed allocation" that gets redistributed
- Rewards remain available indefinitely until claimed
- No expiration or rollover concern
- Each beast's rewards are independent

### Operational Considerations

| Beasts | Estimated Transactions | Notes                        |
| ------ | ---------------------- | ---------------------------- |
| 100    | 1                      | Single batch claim           |
| 500    | 2-3                    | Multiple batches             |
| 1,500  | 5-10                   | Comfortable batching         |
| 5,000+ | 20+                    | May want to spread over time |

---

## 8. Alternative Mechanisms Considered

**Question:** Have alternative mechanisms been considered? For example, a small drip feed of potions to Beast holders based on Summit participation—making activity a requirement to claim them.

**Answer:** The implemented quest system **addresses this concern** by making activity a requirement for rewards.

### How Quests Achieve Activity-Based Distribution

The quest system effectively implements "activity-gated rewards":

| Activity                          | Reward              |
| --------------------------------- | ------------------- |
| Attack at least once              | 0.05 $SURVIVOR      |
| Use consumables                   | 0.10 $SURVIVOR      |
| Achieve combat milestones         | 0.05-0.15 $SURVIVOR |
| Participate in Summit competition | 0.15 $SURVIVOR      |

This is similar to a "potion drip" but rewards $SURVIVOR instead of potions.

### Existing Participation Incentives (Summary)

1. **Quest System**: Activity-based $SURVIVOR rewards (0.50 max per beast)
2. **Diplomacy**: Passive reward sharing for matching beasts
3. **Skull tokens**: Earned from Loot Survivor kills, used for upgrades
4. **Corpse tokens**: Earned from dead adventurers, used for health
5. **Starter pack**: One-time potion claim per beast (tier-based)

### Economic Self-Balancing

The system includes a powerful economic balancing mechanism:

- **100% of potion revenue** → $SURVIVOR buybacks → DAO treasury
- **Break-even point**: ~$139/day in potion purchases
- If spending > rewards distributed: deflationary pressure, benefiting all holders
- If spending < rewards distributed: inflationary but self-correcting

This means heavy spenders effectively fund the ecosystem, benefiting even passive $SURVIVOR holders through buyback pressure.

---

## 9. Tiered Summit System

**Question:** Has a tiered Summit system been explored, where the reward pool is split by percentage across Beast tiers, and only that tier can compete within its bracket?

**Answer:** A tiered bracket system is **not currently implemented**. The design has a single Summit for all beasts.

### Current Structure

- One Summit, all beasts compete equally
- Quest rewards are tier-agnostic
- Leaderboard rewards top beasts by time-held
- No tier separation

### Tiered System Considerations

**Potential Benefits:**

- More accessible competition for lower-tier beasts
- Distributed participation across tiers
- Multiple "winners" at any given time

**Potential Drawbacks:**

- Reduced stakes/excitement from unified competition
- Complexity in reward allocation
- May reduce demand for higher-tier beasts

This would require significant contract architecture changes and is not part of current plans.

---

## 10. Beast Training Stats Transferability

**Question:** If Summit functions as a "training ground" for Beasts, how does that translate beyond Summit? Will trained stats carry into future Loot Survivor games, or will they exist only within Summit?

**Answer:** **Stats are Summit-specific and do not transfer to other games.**

### Summit-Specific Stats

These are stored in Summit's contract storage, not on the Beast NFT:

- Luck (critical hit chance)
- Spirit (revival cooldown reduction)
- Specials (prefix/suffix bonuses)
- Diplomacy (reward sharing)
- Wisdom (defensive XP gain)
- Bonus Health (from Corpse tokens)
- Bonus XP (from battles)
- Quest completion flags

### What Persists

The Beast NFT itself persists with its fixed attributes:

- Tier
- Level
- Type (Brute/Hunter/Magical)
- Prefix/Suffix names

### Future Utility

Your assessment is correct: unless the community/DAO builds additional utility around Summit stats, they exist only within Summit's context.

Potential future integrations could include:

- Other games recognizing Summit training
- DAO governance weight based on Summit participation
- Cosmetic/social recognition

These would require additional development beyond current scope.

---

## Economic Model Summary

### The Circular Economy

```
Players buy Potions (TWAMM)
         ↓
    100% Revenue
         ↓
   $SURVIVOR Buyback
         ↓
    DAO Treasury
         ↓
   Summit Rewards + Quest Rewards
         ↓
   Players earn $SURVIVOR
         ↓
    (cycle repeats)
```

### Key Metrics

| Metric                    | Value                   |
| ------------------------- | ----------------------- |
| Total Summit Rewards      | ~50,000 $SURVIVOR       |
| Quest Rewards (estimated) | ~7,500-15,000 $SURVIVOR |
| Duration                  | 90 days                 |
| Daily Summit Emission     | ~555 $SURVIVOR          |
| Current Token Price       | $0.25                   |
| Daily Reward Value        | ~$139                   |
| Break-even Spending       | ~$139/day               |

### Economic Outcomes

| Scenario        | Spending vs Rewards | Effect                          |
| --------------- | ------------------- | ------------------------------- |
| Low Engagement  | Spending < $139/day | Mild inflation, easier rewards  |
| High Engagement | Spending > $139/day | Deflation, benefits all holders |
| Equilibrium     | Spending ≈ $139/day | Sustainable, price-neutral      |

### Why This Design Works

1. **Competition funds sustainability**: Potion spending flows back as buyback pressure
2. **Spending creates value for all**: Even non-competitors benefit from token appreciation
3. **Natural limits on aggressive play**: Overspending supports competitors' holdings
4. **Passive strategies remain viable**: Diplomacy, quests, and token holding provide value
5. **Activity-gated rewards**: Quest system ensures rewards go to participants, not passive holders

---

## Quest System Summary

### At a Glance

| Aspect                   | Detail                 |
| ------------------------ | ---------------------- |
| **Max per beast**        | 0.50 $SURVIVOR         |
| **Quest count**          | 7 objectives           |
| **Tier differentiation** | None (uniform rewards) |
| **Claiming**             | Batch supported        |
| **Expiration**           | None                   |
| **Requirement**          | Activity-based         |

### Quest Completion Checklist

- [ ] Attack the Summit (die once): 0.05
- [ ] Use Revival Potion: 0.05
- [ ] Use Attack Potion: 0.05
- [ ] Capture Summit: 0.05
- [ ] Hold Summit 10+ seconds: 0.10
- [ ] Max Attack Streak (10): 0.05
- [ ] Level Up (1/3/5/10): 0.02/0.05/0.09/0.15

---

## Resolved Questions

The following questions from the original analysis have been addressed by the quest implementation:

| Original Question     | Resolution                                              |
| --------------------- | ------------------------------------------------------- |
| Quest system details  | ✅ Fully implemented with 7 objectives                  |
| Unclaimed allocations | ✅ No fixed pool; rewards minted on claim               |
| Large holder UX       | ✅ Batch claiming supported                             |
| Activity requirements | ✅ Quests require participation                         |
| Tier differentiation  | ✅ Uniform quest rewards (starter potions still tiered) |

---

## Remaining Open Questions

1. **Post-Season Plans**: Whether additional seasons are planned
2. **Stats Portability**: Any plans for cross-game stat recognition
3. **Quest Reward Pool Cap**: Is there a maximum total quest rewards to be distributed?

---

_Document updated with quest implementation details from contracts. Summit is currently in alpha and details are subject to change._
