const Global = {
    Data: null,
    Parser: new Parser(),
}

function init(json) {
    Global.Data = json;

    let base = Global.Data.decks[0];
    let hand = [
        base.cards.find(c => c.name == "Elven Longbow"),
        base.cards.find(c => c.name == "Elven Archers"),
        base.cards.find(c => c.name == "Empress"),
    ];
    let score = Global.Parser.ParseHand(hand);
    console.log(score);
}

fetch("data.json").then(r => r.json()).then(j => init(j));