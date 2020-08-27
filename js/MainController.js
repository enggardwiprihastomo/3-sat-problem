var MainController = (function(AlgorithmController, UIController){
    var DOM = UIController.DOM;

    DOM.FormulaFile.addEventListener("change", function(e){
        if(e.target.files[0].name){
            var fr = new FileReader();
            fr.onload = function(){
                DOM.InputFormula.value = this.result;
            }
            fr.readAsText(e.target.files[0]);
        }
    });

    DOM.BtnCheck.addEventListener("click", function(){
        var formula = DOM.InputFormula.value;
        if(formula){
            formula = formula.toUpperCase();
            formula = formula.split("(").join("");
            formula = formula.split(")").join("");
            formula = formula.split("AND");
            for(var j=0; j<formula.length; j++){
                formula[j] = formula[j].split(" ").join("");
                formula[j] = formula[j].split("OR");
            }
            if(!check3Sat(formula)){
                UIController.Message("The formula given is not in 3-SAT", "error");
                DOM.InputFormula.focus();
            }
            else if(DOM.InputFormula.value.includes("()") || DOM.InputFormula.value.includes("( )")){
                UIController.Message("Empty clause is found, the formula is unsatisfiable. Please insert non-empty clause formula", "error");
                DOM.InputFormula.focus();
            }
            else{
                var Alg = ["Monien-Speckenmeyer", 1.839];
                var variables = getVariables(formula);

                var showFormula = "";
                for(var i=0; i<formula.length; i++){
                    showFormula = showFormula + "(";
                    for(var j=0; j<formula[i].length; j++){
                        if(j < formula[i].length-1){
                            showFormula = showFormula + formula[i][j] + " OR ";
                        }
                        else{
                            showFormula = showFormula + formula[i][j];
                        }
                    }
                    showFormula = showFormula + ")";
                    if(i < formula.length-1){
                        showFormula = showFormula + " AND "
                    }
                }

                var showVariables = "";
                for(var i=0; i<variables.length; i++){
                    if(i < variables.length-1){
                        showVariables = showVariables + variables[i] + ", ";
                    }
                    else{
                        showVariables = showVariables + variables[i];
                    }
                }

                var result =  AlgorithmController.monien_speckenmeyers_alg(formula, variables);
        
                variables = variables.sort();

                var assignment = [];
                for(var i=0; i<variables.length; i++){
                    assignment.push([]);
                    for(var j=0; j<Math.pow(2, i+1); j++){
                        if(j%2 == 0){
                            for(var k=0; k<(Math.pow(2, variables.length) / Math.pow(2, i+1)); k++){
                                assignment[i].push(false);
                            }
                        }
                        else{
                            for(var k=0; k<(Math.pow(2, variables.length) / Math.pow(2, i+1)); k++){
                                assignment[i].push(true);
                            }
                        }
                    }
                }

                var result, status;
                for(var i=0; i<assignment[0].length; i++){
                    result = [[],[]];
                    for(var j=0; j<assignment.length; j++){
                        result[0].push(variables[j]);
                        result[1].push(assignment[j][i]);
                    }
                    var status = AlgorithmController.check_sat(formula, result);
                    if(status){
                        break;
                    }
                }

                var assignments = "";
                if(status){
                    status = "Satisfiable";
                    for(var i=0; i<result[0].length; i++){
                        if(i<result[0].length-1){
                            assignments = assignments + result[0][i] + " = " + result[1][i].toString()[0].toUpperCase() + result[1][i].toString().substr(1) + ", ";
                        }
                        else{
                            assignments = assignments + result[0][i] + " = " + result[1][i].toString()[0].toUpperCase() + result[1][i].toString().substr(1);
                        }
                    }
                }
                else{
                    status = "Unsatisfiable";
                    assignments = "None";
                }

                UIController.DisplayText(Alg[0], "algorithm");
                UIController.DisplayText(Alg[1], "complexity");
                UIController.DisplayText(showFormula, "formula");
                UIController.DisplayText(variables.length + " (" + showVariables + ")", "variables");
                UIController.DisplayText(status, "status");
                UIController.DisplayText(assignments, "assignment");
                UIController.DisplayText(formula.length, "clauses");
                DOM.Result.style.display = "block";
                DOM.Result.style.height = "200px";
            }
        }
        else{
            UIController.Message("The formula is empty, please enter the formula", "error");
        }   
    });

    var check3Sat = function(formula){
        var sat_3 = true;
        for(var i=0; i<formula.length;i++){
            if(formula[i].length > 3){
                sat_3 = false;
                break;
            }
        }
        return sat_3;
    }

    var getVariables = function(formula){
        var variables = [];
        for(var i=0; i<formula.length; i++){
            for(var j=0; j<formula[i].length; j++){
                if(i==0 && j==0){
                    if(formula[i][j].includes("~")){
                        variables.push(formula[i][j].substring(1));
                    }
                    else{
                        variables.push(formula[i][j]);
                    }
                }
                else{
                    if(formula[i][j].includes("~")){
                        if(!checkExist(formula[i][j].substring(1),variables)){
                            variables.push(formula[i][j].substring(1));
                        }
                    }
                    else{
                        if(!checkExist(formula[i][j],variables)){
                            variables.push(formula[i][j]);
                        }
                    }
                }
            }
        }
        return variables;
    }

    function checkExist(variable, variables){
        var status = true;
        for(var i=0; i<variables.length; i++){
            if(variable==variables[i]){
                status = true;
                break;
            }
            else{
                status = false;
            }
        }
        return status;
    }

    DOM.BtnClose.addEventListener("click", function(){
        UIController.SlideDown();
    });

    DOM.BtnOr.addEventListener("click", function(){
        UIController.InsertText(" OR ");
    });

    DOM.BtnAnd.addEventListener("click", function(){
        UIController.InsertText(" AND ");
    });
})(AlgorithmController, UIController);