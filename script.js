//ЛР 1. Вариант b. Проверить является ли строка формулой логики высказываний.
//ЛР 2. Вариант 1. Вычислить возможные значения формулы при частично заданной интерпретации формулы
//      (частично заданных значениях пропозициональных переменных).
//      Результат оформить в виде таблицы.

//Автор: Никифоров С. А. Гр. 621702


//ЛР1

const NEGATION = "!";
const CONJUNCTION = "&";
const DISJUNCTION = "|";
const IMPLICATION = "->";
const EQUIVALENCE = "~";
const FORMULA_REGEXP = new RegExp('([(]([A-Z]|[0-1])((->)|(&)|(\\|)|(~))([A-Z]|[0-1])[)])|([(][!]([A-Z]|[0-1])[)])|([A-Z])|([0-1])','g');


let countAnswer = 0;
let n = 1;

function verificate(){
	//var isCorrect = false;
	
    var inputStringVar = document.getElementById('inputString').value;

	if(stringWithPartialValuesCheck(inputStringVar)){
		alert("Строка является формулой логики высказываний.");
	} else {
		alert("Строка НЕ является формулой логики высказываний или не содержит символов.");
	}
}

function stringWithPartialValuesCheck(inputStringVar){
	if(inputStringVar.length == 1){
		if(inputStringVar.match(/([0-1]|[A-Z])/)){
			return true;
		} else {
			return false;
		}
	//унарная формула
	} else if(inputStringVar.match(/^\(!([A-Z]|[0-1]|(\((\(|\)|[A-Z]|[0-1]|!|&|~|\||(->))+\)))\)$/)){
		/*if(stringWithPartialValuesCheck(inputStringVar.substring(2, inputStringVar.length - 1))){
			return true;
		} else {
			return false;*/
			return (stringWithPartialValuesCheck(inputStringVar.substring(2, inputStringVar.length - 1)));
		//}
	//бинарная формула                 (первая подформула __________________________________)(связка_____)(вторая подформула __________________________________)
	} else if(inputStringVar.match(/^\(([A-Z]|[0-1]|(\((\(|\)|[A-Z]|[0-1]|!|&|~|\||(->))+\)))(&|~|\||(->))([A-Z]|[0-1]|(\((\(|\)|[A-Z]|[0-1]|!|&|~|\||(->))+\)))\)$/)){
		var substringWithPartialValuesStart = 0;
		var lev = 0;//уровень вложенности
		var max = inputStringVar.length - 2;
		var subformualsCheckResults = [false, false];
		var substringWithPartialValuesInd = 0;
		var substringWithPartialValuesIndex = 0;
		for(var i = 1; i <= max; i++){
			if(inputStringVar.charAt(i) == '('){
				if(lev == 0){
					substringWithPartialValuesStart = i;
				}
				lev++
			} else if (inputStringVar.charAt(i) == ')'){
				lev--;
				if(lev == 0){
					subformualsCheckResults[substringWithPartialValuesInd] = stringWithPartialValuesCheck(inputStringVar.substring(substringWithPartialValuesStart, i + 1));//крайний символ НЕ включается
					substringWithPartialValuesInd++;					
				}
			} else if(lev == 0) {
				if(inputStringVar.charAt(i).match(/([0-1]|[A-Z])/)){
					subformualsCheckResults[substringWithPartialValuesInd] = true;
					substringWithPartialValuesInd++;
				}
			}
		}
		if(subformualsCheckResults[0]&&subformualsCheckResults[0]){
			return true;
		} else return false;
	}
}

//-----------------------------------------------------------------------------------------------


//ЛР2

function calculate(){
	document.getElementById('TableBody').innerHTML = '';
	document.getElementById('continueButtonDiv').innerHTML = '';
	var inputStringVar = document.getElementById('inputString').value;
	if(!stringWithPartialValuesCheck(inputStringVar)){
		alert("Строка НЕ является формулой логики высказываний или не содержит символов.");
	} else {
	var variablesArr = searchVariables(inputStringVar);
	drawInputTable(variablesArr, inputStringVar);
	//drawVariablesTable(variablesArr);//таблица для указания значений некоторых пееменных, добавить кнопку для продолжения
	//var valueMatrix;//размерность зависит от количества заданных переменных
	
	//составить таблицу с возможными значениями переменных
	//calculatestringWithPartialValuesValue, результат добавить в таблицу
	}
}

function searchVariables(inputStringVar){
	var variablesArr = [];
	var stringLength = inputStringVar.length;
	for(var i = 0; i < stringLength; i++){
		if(inputStringVar[i].match(/([A-Z])/)){
			if(variablesArr.indexOf(inputStringVar[i]) == -1){
				variablesArr.push(inputStringVar[i]);
			}
		}
	}
	return variablesArr;
}

function drawInputTable(variablesArr, inputStringVar){
	var tbody = document.getElementById('TableBody');
	var row1 = document.createElement("tr");
	var row2 = document.createElement("tr");
	for(var i = 0; i < variablesArr.length; i++){
		//tbody.append('<tr><td>' + variablesArr[i] + '</td><td><input type="number" id="' + i + '"></td></tr>');
		var cell = document.createElement("td");
        cell.innerHTML = variablesArr[i];
		row1.appendChild(cell);
	}
	for(var i = 0; i < variablesArr.length; i++){
		var cell = document.createElement("td");
        cell.innerHTML = '<input type="number" min=0 max=1 id="input' + i + '">';
		row2.appendChild(cell);
	}
	tbody.appendChild(row1);
	tbody.appendChild(row2);
	
	continueButton = document.createElement("button");
	continueButton.innerHTML = 'Рассчитать возможные значения формулы';
	document.getElementById('continueButtonDiv').appendChild(continueButton);
    
	var stringWithPartialValues = inputStringVar;
	continueButton.onclick = function() {
		
		
		var redusedVarArr = [];
		for(var i = 0; i < variablesArr.length; i++){
		var inputValue = document.getElementById('input' + i).value;
		if(inputValue){
			inputValue = parseInt(inputValue);
			//stringWithPartialValues.replace("A", '1');
//			stringWithPartialValues = stringWithPartialValues.replace(variablesArr[i], inputValue);
            stringWithPartialValues = stringWithPartialValues.replace(new RegExp(variablesArr[i], 'g'), inputValue);

			} else {
				redusedVarArr.push(variablesArr[i]);
			}
            console.log(stringWithPartialValues)
            let obj = calculateTableTruth(stringWithPartialValues);
            printTableTruth(obj.table, obj.symbolSize);
		}
		
//		var tbody = document.getElementById('TableBody');
//		tbody.innerHTML = '';
//		document.getElementById('continueButtonDiv').innerHTML = '';
//		createHeadline(tbody, redusedVarArr);
//		var numOfCombinations = Math.pow(2, redusedVarArr.length);
//		for(var i = 0; i < numOfCombinations; i++){
//			var values = i.toString(2);
//			while(values.length < redusedVarArr.length){
//				values = '0' + values;
//			}
//			var stringWithValues = stringWithPartialValues;
//			for(j = 0; j < redusedVarArr.length; j++){
//				stringWithValues = stringWithValues.replace(redusedVarArr[j], values[j]);
//			}
//			var value = calculateValue(stringWithValues);
//			addInResult(tbody, values, value, redusedVarArr);
//		}
	};
}






function calculateTableTruth(stringWithPartialValues) {
    countAnswer = 0;
    n = 1;

    if(stringWithPartialValues == '0') {
        countAnswer = 1;
        return {containsOnes: false};
    }

    if(stringWithPartialValues == '1') {
        return {containsOnes: true};
    }

    if (stringWithPartialValues == '') {
        return null;
    }

    if (stringWithPartialValues.match(/[A-Z]/g) !== null) {
        let answer = stringWithPartialValues;
        let symbolInstringWithPartialValues = calculatestringWithPartialValuesSymbols(stringWithPartialValues).sort();
        let sizeSymbolInstringWithPartialValues = symbolInstringWithPartialValues.length;
        n = Math.pow(2, sizeSymbolInstringWithPartialValues);

        let table = {};
        for (let index = 0; index < n; index++) {
            let inputParameters = calculateInputstringWithPartialValuesParameters(index, sizeSymbolInstringWithPartialValues);
            let obj = createstringWithPartialValuesWithParameters(symbolInstringWithPartialValues, inputParameters);

            obj[answer] = getAnswer(stringWithPartialValues, obj);
            table[index] = obj;

            if (obj[answer] == 0) {
                countAnswer++;
            }
        }
        var vals = Object.keys(table).map(function(key) {
            return table[key][Object.keys(table[key])[Object.keys(table[key]).length - 1]];
        });
        let containsOnes = false;
        if (vals.includes('1')) {
            containsOnes = true;
        }
        return  {
            table: table,
            symbolSize: sizeSymbolInstringWithPartialValues,
            containsOnes: containsOnes
        };
    } else {
        containsOnes = (calculatestringWithPartialValues(stringWithPartialValues) === '1' ? true : false);
        return {containsOnes: containsOnes};
    }
}

function calculatestringWithPartialValuesSymbols(stringWithPartialValues) {
    const SYMBOL_REGEXP = new RegExp('([A-Z])', "g");
    let results = stringWithPartialValues.match(SYMBOL_REGEXP);

    //удаляет повторяющиеся символы

    for(let i = 0; i < results.length; i++) {
        for(let j = i + 1; j < results.length; j++) {
            if (results[i] == results[j]) {
                results.splice(j, 1);
                j--;
            }
        }
    }
    return results;
}

//Функция расчета входных параметров для формулы
function calculateInputstringWithPartialValuesParameters(index, symbolSize) {
    let res = index.toString(2);
    //дописывает 0, если не хватает разрядов
    for (let index = res.length; index < symbolSize; index++) {
        res = "0" + res;
    }

    return res;
}

//Создания объекта формулы со входными параметрами
function createstringWithPartialValuesWithParameters(symbolInstringWithPartialValues, inputParameters) {
    let object = {};
    for (let index = 0; index < symbolInstringWithPartialValues.length; index++) {
        let symbol = symbolInstringWithPartialValues[index];
        //связь входного символа формулы с его входным значением
        object[symbol] = inputParameters[index];
    }

    return object;
}

function getAnswer(stringWithPartialValues, obj){
    let conststringWithPartialValues = stringWithPartialValues;
    for (let key of Object.keys(obj)) {
        let value = obj[key];
        //заменяем буквы значениями
        conststringWithPartialValues = conststringWithPartialValues.replace(new RegExp(key, 'g'), value);
    }
    return calculatestringWithPartialValues(conststringWithPartialValues);
}

function calculatestringWithPartialValues(stringWithPartialValues) {
    const REGEXP = new RegExp("([(][" + NEGATION + "][0-1][)])|" + "([(][0-1]((" + CONJUNCTION + ")|("+ "\\" + DISJUNCTION + ")|(" + IMPLICATION + ")|(" + EQUIVALENCE + "))[0-1][)])");
    var array;
    while ((array = REGEXP.exec(stringWithPartialValues)) !== null) {
        let substringWithPartialValues = array[0];
        let result = calculateSimplestringWithPartialValues(substringWithPartialValues);
        stringWithPartialValues = stringWithPartialValues.replace(substringWithPartialValues, result);
    }

    return stringWithPartialValues;
}

function calculateSimplestringWithPartialValues(substringWithPartialValues) {
    if (substringWithPartialValues.indexOf(NEGATION) > -1) {
        return calculateNegation(substringWithPartialValues);
    }

    if (substringWithPartialValues.indexOf(CONJUNCTION) > -1) {
        return calculateConjunction(substringWithPartialValues);
    }

    if (substringWithPartialValues.indexOf(DISJUNCTION) > -1) {
        return calculateDisjunction(substringWithPartialValues);
    }

    if (substringWithPartialValues.indexOf(IMPLICATION) > -1) {
        return calculateImplication(substringWithPartialValues);
    }

    if (substringWithPartialValues.indexOf(EQUIVALENCE) > -1) {
        return calculateEquivalence(substringWithPartialValues);
    }
}

function calculateNegation(substringWithPartialValues) {
    if (parseInt(substringWithPartialValues[2]) == 1) {
        return 0;
    }
    return 1;
}

//Функция высчитывания конъюнкции
function calculateConjunction(substringWithPartialValues) {
    if (parseInt(substringWithPartialValues[1]) && parseInt(substringWithPartialValues[3])) {
        return 1;
    } else {
        return 0;
    }
}

//Функция высчитывания дизъюнкции
function calculateDisjunction(substringWithPartialValues) {
    if (parseInt(substringWithPartialValues[1]) || parseInt(substringWithPartialValues[3])) {
        return 1;
    } else {
        return 0;
    }
}

//Функция высчитывания импликации
function calculateImplication(substringWithPartialValues) {
    if ((!parseInt(substringWithPartialValues[1])) || parseInt(substringWithPartialValues[4])) {
        return 1;
    } else {
        return 0;
    }
}

//Функция высчитывания эквиваленции
function calculateEquivalence(substringWithPartialValues) {
    if (parseInt(substringWithPartialValues[1]) == parseInt(substringWithPartialValues[3])) {
        return 1;
    } else {
        return 0;
    }
}

function printTableTruth(table, symbolSize) {
    console.log(table)
    let tableSize = Math.pow(2, symbolSize);
    let html = "";

    //построение шапки таблицы

    html += "<tr>";

    for (let key of Object.keys(table[0])) {
        html += "<td>" + key + "</td>"
    }

    html += "</tr>";

    //непосредственное заполнение

    for (let index = 0; index < tableSize; index++) {
        let object = table[index];
        html += "<tr>";

        for (let key of Object.keys(object)) {
            html += "<td>" + object[key] + "</td>"
        }
        html += "</tr>";
    }

    let tableElement = document.getElementById('table');
    tableElement.innerHTML = html;
}













//function addInResult(tbody, values, value, redusedVarArr){
//	var row = document.createElement("tr");
//	for(var i = 0; i < redusedVarArr.length; i++){
//		var cell = document.createElement("td");
//		cell.innerHTML = values[i];
//		row.appendChild(cell);
//		//tbody.appendChild(row);
//	}
//	var cell = document.createElement("td");
//    cell.innerHTML = value;
//	row.appendChild(cell);
//	tbody.appendChild(row);
//}
//
//function createHeadline(tbody, redusedVarArr){
//	var row = document.createElement("tr");
//	for(var i = 0; i < redusedVarArr.length; i++){
//		var cell = document.createElement("td");
//        cell.innerHTML = redusedVarArr[i];
//		row.appendChild(cell);
//		//tbody.appendChild(row);
//	}
//	var cell = document.createElement("td");
//    cell.innerHTML = 'Результат';
//	row.appendChild(cell);
//	tbody.appendChild(row);
//}
//
//function calculateValue(stringWithValues){
//	var unary_stringWithPartialValues = /\(\!([01])\)/g;
//    var binary_stringWithPartialValues = /\(([01])([\&\|\~]|(\-\>))([01])\)/g;
//	var conjunction = /\(([01])(\&)([01])\)/g;
//	var disjunction = /\(([01])(\|)([01])\)/g;
//	var implication = /\(([01])(\-\>)([01])\)/g;
//	var equivalence = /\(([01])(\~)([01])\)/g;
//
//    while(stringWithValues.match(unary_stringWithPartialValues) || stringWithValues.match(binary_stringWithPartialValues)){
//        if(stringWithValues.match(unary_stringWithPartialValues)){
//			var match = stringWithValues.match(unary_stringWithPartialValues);
//			for(var i = 0; i < match.length; i++){
//				stringWithValues = stringWithValues.replace(match[i], unary_stringWithPartialValues_result(match[i]));
//			}
//		} else if(stringWithValues.match(conjunction)){
//			var match = stringWithValues.match(conjunction);
//			for(var i = 0; i < match.length; i++){
//				stringWithValues = stringWithValues.replace(match[i], conjunction_result(match[i]));
//			}
//		} else if(stringWithValues.match(disjunction)){
//			var match = stringWithValues.match(disjunction);
//			for(var i = 0; i < match.length; i++){
//				stringWithValues = stringWithValues.replace(match[i], disjunction_result(match[i]));
//			}
//		} else if(stringWithValues.match(implication)){
//			var match = stringWithValues.match(implication);
//			for(var i = 0; i < match.length; i++){
//				stringWithValues = stringWithValues.replace(match[i], implication_result(match[i]));
//			}
//		} else if(stringWithValues.match(equivalence)){
//			var match = stringWithValues.match(equivalence);
//			for(var i = 0; i < match.length; i++){
//				stringWithValues = stringWithValues.replace(match[i], equivalence_result(match[i]));
//			}
//		}
//    }
//	
//	return stringWithValues;
//}
//
//function unary_stringWithPartialValues_result(match){
//	if(match.match(/\(\!([1])\)/g)){
//		return 0;
//	} else {
//		return 1;
//	}
//}
//
//function conjunction_result(match){
//	if(match.match(/\(([1])(\&)([1])\)/g)){
//		return 1;
//	} else {
//		return 0;
//	}
//}
//
//function disjunction_result(match){
//	if(match.match(/\(([0])(\|)([0])\)/g)){
//		return 0;
//	} else {
//		return 1;
//	}
//}
//
//function implication_result(match){
//	if((match.match(/\(([0])(\-\>)([01])\)/g))||(match.match(/\(([1])(\-\>)([1])\)/g))){
//		return 1;
//	} else {
//		return 0;
//	}
//}
//
//function equivalence_result(match){
//	if((match.match(/\(([0])(\~)([0])\)/g))||(match.match(/\(([1])(\~)([1])\)/g))){
//		return 1;
//	} else {
//		return 0;
//	}
//}