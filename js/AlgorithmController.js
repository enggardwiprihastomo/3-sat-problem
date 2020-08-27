var AlgorithmController = (function(){
    var reduce = function(formula, assignment){
        var new_formula = JSON.parse(JSON.stringify(formula));
        for(var i=0; i<assignment[0].length; i++){
            for(var j=0; j<formula.length; j++){
                if(new_formula[j].length){
                    for(var k=0; k<formula[j].length; k++){
                        if(new_formula.length != 0){
                            if(formula[j][k].includes("~")){
                                if(assignment[0][i] == formula[j][k].substring(1)){
                                    if(assignment[1][i]){
                                        new_formula[j][k] = 0;
                                    }
                                    else{
                                        new_formula[j] = 0;
                                    }
                                }
                            }
                            else{
                                if(assignment[0][i] == formula[j][k]){
                                    if(assignment[1][i]){
                                        new_formula[j] = 0;
                                    }
                                    else{
                                        new_formula[j][k] = 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        var reduced_formula = [];
        var k = 0;
        for(var i=0; i<new_formula.length; i++){
            if(new_formula[i].length != null){
                reduced_formula.push([]);
                for(var j=0; j<new_formula[i].length; j++){
                    if(new_formula[i][j] != "0"){
                        reduced_formula[k].push(new_formula[i][j]);
                    }
                }
                k++;
            }
        }
        return reduced_formula;
    }

    var assignments = [[], []];
    var monien_speckenmeyers = function(formula){
        var shortestClause = search_shortest_clause(formula);
        var result;
        console.log("Shortest clause = " + JSON.stringify(shortestClause));
        for(var i=0; i<shortestClause.length; i++){
            if(shortestClause[i].includes("~")){
                shortestClause[i] = shortestClause[i].substring(1);
            }
            var assignment = [[],[]];
            for(var j=0; j<=i; j++){
                if(j == i){
                    assignment[0].push(shortestClause[j]);
                    assignment[1].push(true);
                }
                else{
                    assignment[0].push(shortestClause[j]);
                    assignment[1].push(false);
                }
            }

            if(assignments[0].length){
                for(var j=0; j<assignment[0].length; j++){
                    var exist = false;
                    for(k=0; k<assignments[0].length; k++){
                        if(assignments[0][k] == assignment[0][j]){
                            exist = true;
                            break;
                        }
                    }        
                    // if(!exist){
                    //     assignments[0].push(assignment[0][j]);
                    //     assignments[1].push(assignment[1][j]);
                    // }
                    assignments[0].push(assignment[0][j]);
                    assignments[1].push(assignment[1][j]);
                }
            }
            else{
                for(var j=0; j<assignment[0].length; j++){
                    assignments[0].push(assignment[0][j]);
                    assignments[1].push(assignment[1][j]);
                }
            }
            
            if(i==0){
                result = reduce(formula, assignment);
            }
            else{
                result = reduce(result, assignment);
            }
            if(checksat(result)){
                break;
            }
            console.log("Assignment passed to the formula = " + JSON.stringify(assignment));
            console.log("Result = " + JSON.stringify(result));
        }
        var status = false;
        for(var j=0; j<result.length; j++){
            if(result[j].length > 1){
                status = true;
                break;
            }
        }
        if(status){
            monien_speckenmeyers(result);
        }
        else{
            for(var j=0; j<result.length; j++){
                if(result[j].length){
                    if(result[j][0].includes("~")){
                        assignments[0].push(result[j][0].substring(1));
                        assignments[1].push(false);
                    }
                    else{
                        assignments[0].push(result[j][0]);
                        assignments[1].push(true);
                    }
                }
            }
        }
        // console.log("Assignments = " + JSON.stringify(assignments));

        return assignments;  
    }

    var search_shortest_clause = function(formula){
        var shortest;
        var shortestClause = [];

        for(var i=0; i<formula.length; i++){
            if(formula[i].length){
                shortest = formula[i].length;
                for(var j=0; j<formula[i].length; j++){
                    shortestClause.push(formula[i][j]);
                }
                break;
            }
        }

        for(var i=0; i<formula.length; i++){
            if(formula[i].length){
                if(shortest >= formula[i].length){
                    shortestClause = [];
                    shortest = formula[i].length;
                    for(var j=0; j<formula[i].length; j++){
                        shortestClause.push(formula[i][j]);
                    }
                }
            }
        }
        return shortestClause;
    }

    var checksat = function(formula){
        if(!formula.length){
            return true;
        }
        else{
            return false;
        }
    }

    return {
        monien_speckenmeyers_alg: function(formula){
            console.log(assignments);
            assignments = [[], []];
            return monien_speckenmeyers(formula);
        },

        check_sat: function(formula, assignment){
            var result = reduce(formula, assignment);
            return checksat(result);
        }
    }
})();