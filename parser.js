class Parser {
    ParseHand(hand) {
        console.debug("ParseHand");
        let score = 0;
        for (let card of hand) {
            score += this.ParseCard(card, hand);
        }
        return score;
    }

    ParseCard(card, hand) {
        console.debug("ParseCard");
        console.debug(card);
        console.debug(hand);

        console.log(`Card: ${card.name} (${card.strength}, ${card.suit})`);
        let score = card.strength;
        if (card.bonus) {
            console.log(`Bonus: ${this.BonusToString(card)}`);
            score += this.ParseBonus(card, hand);
        }
        if (card.penalty) {
            console.log(`Penalty: ${this.PenaltyToString(card)}`);
            //score -= this.ParsePenalty(card.penalty);
        }
        console.log(`Score: ${score}`);
        return score;
    }

    BonusToString(card) {
        let str = `+${card.bonus.value}`;
        let cond = card.bonus.condition;
        if (cond != null) {
            return `${str} ${this.ConditionToString(cond)}`;
        }
        return str;
    }
    PenaltyToString(card) {
        let str = `-${card.penalty.value}`;
        let cond = card.penalty.condition;
        if (cond != null) {
            return `${str} ${this.ConditionToString(cond)}`;
        }
        return str;
    }
    ConditionToString(condition) {
        switch (condition.type) {
            case "AND":
            case "OR": {
                return condition.conditions.map(c => this.ConditionToString(c)).join(", ");
            }
            case "CARD":
            case "SUIT": {
                return condition.value;
            }
            case "FOREACH": {
                return `FOREACH other ${this.ConditionToString(condition.condition)}`;
            }
            default: {
                return `${condition.type} ${this.ConditionToString(condition.condition)}`;
            }
        }
    }

    ParseBonus(card, hand) {
        console.debug("ParseBonus");
        return this.ParseCondition(card.bonus.condition, card, hand) * card.bonus.value;
    }

    ParseCondition(condition, card, hand) {
        console.debug(`ParseCondition ${condition.type}`);
        switch (condition.type) {
            case "NOT": {
                return this.ParseCondition(condition.condition, card, hand) == 0 ? 1 : 0;
            }
            case "SUIT": {
                //TODO: do we need the self check? does it even work
                return hand.filter(c => c != card && c.suit == condition.value).length;
            }
            case "CARD": {
                //TODO: do we need the self check? does it even work
                return hand.filter(c => c != card && c.name == condition.value).length;
            }
            case "OR": {
                for (let cond of condition.conditions) {
                    if (this.ParseCondition(cond, card, hand))
                        return 1;
                }
                return ß;
            }
            case "AND": {
                for (let cond of condition.conditions) {
                    if (!this.ParseCondition(cond, card, hand))
                        return 0;
                }
                return 1;
            }
            case "WITH": {
                return this.ParseCondition(condition.condition, card, hand) > 0 ? 1 : 0;
            }
            case "FOREACH": {
                return this.ParseCondition(condition.condition, card, hand);
            }
            default:
                console.error(`Unknown Condition ${condition.type}`);
                return false;
        }
    }
}