notask
======

Simple task runner for node

## Install

Install notask via npm, preferably globally.

    sudo npm install notask -g

## Usage

Make some tasks
  
    //one.task.js
    module.exports.task = function() {
      return 'one';
    };
    
    //two.task.js
    module.exports.task = function() {
      return 'two';
    };
  
    //echo.task.js
    module.exports.task = function(one, two) {
      return one + '? '  + two + '!';
    };
    
  
Now run that task!

    notask echo


## Wowie

Yes, amazing. We can just create a file and name it like *.task.js. These javascript files
should export a 'task' member that may return a promise that will be resolved upon task
execution. When this function has parameters, notask will look for a task file with the same
name as each function parameter, then resolve that task and return the result as function
arguments.



  
