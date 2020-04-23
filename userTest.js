const binary = ["->", "&", "|", "~"];
const braces = ["(", ")"];
const constant = ["0", "1"];
const symbol = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "X", "Y", "Z", "V", "W"];

const nestLimit = 15;
var nest = 0;

var testFormula = "";
var fval = 0;
var symSet = new Set();

// testUser impleents user's knowledges testing mode.
function testUser() {
    try {
        symSet = new Set();
        testInputStr = genFormula();
        let varArr = new Array().concat(...symSet).sort();
        for (let i = 0; i < varArr.length; i++) {
            testInputStr =
                varArr[i] + " = " +
                Math.floor(Math.random() * 2) +
                ", " + testInputStr;
        }
        testFormula = processInput(testInputStr);

        fval = calculateFormula(testFormula);

        document.getElementById("formula").innerHTML = "Формула: " + testInputStr;
        document.getElementById("result").innerHTML = "";
        event.preventDefault()
    } catch (err) {
        document.getElementById("formula").innerHTML = err;
        event.preventDefault()
    }
}

function checkAnswer() {
    try {
        let answ = document.forms["form"]["answer-input"].value;

        document.getElementById("result").innerHTML = answ == fval ? "Правильно!" : "Не правильно!";
        event.preventDefault()
    } catch (err) {
        document.getElementById("result").innerHTML = err;
        event.preventDefault()
    }
}

// genConst ...
function genConst() {
    return constant[Math.floor(Math.random() * constant.length)];
}

// genSymbol ...
function genSymbol() {
    let sym = symbol[Math.floor(Math.random() * symbol.length)]
    symSet.add(sym);
    return sym;
}

// genBinary ...
function genBinary() {
    nest++;
    return "(" + genFormula() + binary[Math.floor(Math.random() * binary.length)] + genFormula() + ")"
}

// genUnary ...
function genUnary() {
    nest++;
    return "(!" + genFormula() + ")"
}

// genFormula ...
function genFormula() {
    nest = 0;
    let c = Math.floor(Math.random() * (nest < nestLimit ? 4 : 2));

    switch (c) {
        case 0:
            return genConst();
        case 1:
            return genSymbol();
        case 2:
            return genBinary();
        case 3:
            return genUnary();
    }
}
