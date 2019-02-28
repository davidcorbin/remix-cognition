function loadLesson(){
    var lessonName;
    const fs = require('fs');
    let rawdata = fs.readFileSync('./data/lessons/lessons.json');
    let allLessons = JSON.parse(rawdata);
    allLessons.forEach(function(element){
        if(element.id == 1){
            lessonName = `<h>${element.name}</h>`;
        }
    });
    document.getElementById("button1").innerHTML = lessonName;
}