$(document).ready(function() {
    $('#timer').hide();
    $('#quit').hide();
    $('#easy, #med, #hard').click(function() {
        createGame($(this).val());
    });
    $('#quit').click(function() {
        var time=$('#timer').text();
        var row='<tr><td>You solved '+solved+' squares in '+time+'.</td></tr>';
        $('#puzzle').html(row);
        solved=0; 
        solutions=0;
		index=18001;
        $('#easy, #med, #hard').fadeIn(500);
        $('#timer').hide().html('');
        $('#quit').hide();
    });
});
function createGame(difficulty) {
    difficulty = Math.floor(parseInt(difficulty) / 9);
    var table = "";
    $('#easy, #med, #hard').fadeOut(500);
    $('#quit').show();
    $('#timer').show();
    createRandomVal();
    solveSudoku(grid, 0, 0);
    markCells(difficulty);
    for (var i = 0; i < 9; i++) {
        table = table + createRow(i);
    }
	index=0;
    addTime(0, 0, index);
    $('#puzzle').html(table);
}
//create table to be displayed negative values have a text input
function createRow(col) {
    if (col == 2 || col == 5) {
        var row = "<tr class='bot'>";
    } else {
        var row = '<tr>';
    }
    var index = 1;
    for (var i = 0; i < 9; i++) {
        if (grid[col][i] < 0) {
            if (index == 3) {
                row = row + "<td class='right'><input type='text' id='" + col
                        + "_" + i + "' oninput='compare("+col+","+i+");' ></td>";
                index = 1;
            } else {
                row = row + "<td><input type='text' id='" + col + "_" + i
                        + "' oninput='compare("+col+","+i+");' ></td>";
                index++;
            }
            solutions++;
        } else {
            if (index == 3) {
                row = row + "<td class='right'>" + grid[col][i] + '</td>';
                index = 1;
            } else {
                row = row + "<td>" + grid[col][i] + '</td>';
                index++;
            }
        }
    }
    row = row + '</tr>';
    return row;
}
// timer
function addTime(seconds, minutes, index) {
    if (index < 18000) {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
        }
        var second = seconds > 9 ? "" : 0;
        $('#timer').html(minutes + ':' + second + seconds);
        index++;
        setTimeout(function() {
            addTime(seconds, minutes, index)
        }, 1000);
    }
}
// create placeholder value
function createRandomVal() {
    var i = Math.floor((Math.random() * 8) + 1);
    grid[0][7] = i;
}
//squares to solve are assigned at random negative values
function markCells(difficulty) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < difficulty; j++) {
            var row = Math.floor(Math.random() * 9);
            var val = grid[i][row];
            grid[i][row] = val * -1;
        }
    }
}
//puzzle grid
var grid = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ];
//number of cells to be solved		
var solutions = 0;
//number of user solved cells
var solved=0;
//timer start stop index
var index=0;
//entry point to fill puzzle
function solveSudoku(grid, row, col) {
    var cell = findUnassignedLocation(grid, row, col);
    row = cell[0];
    col = cell[1];
    // base case: if no empty cell
    if (row == -1) {
        return true;
    }
    for (var num = 1; num <= 9; num++) {
        if (noConflicts(grid, row, col, num)) {
            grid[row][col] = num;

            if (solveSudoku(grid, row, col)) {
                return true;
            }
            // mark cell as empty (with 0)
            grid[row][col] = 0;
        }
    }
    // trigger back tracking
    return false;
}
//find 0 row and col locations
function findUnassignedLocation(grid, row, col) {
    var done = false;
    var res = [ -1, -1 ];

    while (!done) {
        if (row == 9) {
            done = true;
        } else {
            if (grid[row][col] == 0) {
                res[0] = row;
                res[1] = col;
                done = true;
            } else {
                if (col < 8) {
                    col++;
                } else {
                    row++;
                    col = 0;
                }
            }
        }
    }
    return res;
}
//returns true if number in row and col don't conflict
function noConflicts(grid, row, col, num) {
    return isRowOk(grid, row, num) && isColOk(grid, col, num)
            && isBoxOk(grid, row, col, num);
}
//check that the number in the grid doesn't repeat along the row
function isRowOk(grid, row, num) {
    for (var col = 0; col < 9; col++){
        if (grid[row][col] == num){
            return false;
		}
	}	
    return true;
}
//check that the number in the grid doesn't repeat along the column
function isColOk(grid, col, num) {
    for (var row = 0; row < 9; row++){
        if (grid[row][col] == num){
            return false;
		}
	}
    return true;
}
//check that the number in the grid doesn't repeat along the row or column in the 3 x 3 grid
function isBoxOk(grid, row, col, num) {
    row = Math.floor(row / 3) * 3;
    col = Math.floor(col / 3) * 3;
    for (var r = 0; r < 3; r++){
        for (var c = 0; c < 3; c++){
            if (grid[row + r][col + c] == num){
                return false;
			}
		}
	}
    return true;
}
//check user entered value against the grid wrong answers get a red background, right answers get a green background and the input box removed
//
function compare(col,row){   
    if((grid[col][row]*-1) ==   $('#'+col+'_'+row).val() ){
         $('#'+col+'_'+row).closest('td').html($('#'+col+'_'+row).val()).css("background-color", "#33FF33");
         solutions--;
         solved++;
    }             
    else{
        $('#'+col+'_'+row).css("background-color", "#FF0000");
        console.log(grid[col][row]);
    }
    if(solutions==0){
        var time=$('#timer').text();
        var row='<tr><td>Congratulations! You finished the puzzle in '+time+' and solved '+solved+' squares.</td></tr>';
        $('#puzzle').html(row);
        solved=0; 
        solutions=0;
		index=18001;
        $('#easy, #med, #hard').fadeIn(500);
        $('#timer').hide().html('');
        $('#quit').hide();
    }
}


