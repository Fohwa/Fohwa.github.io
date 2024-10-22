
//neues Element hinzufügen
function addModule(bwlKuerzel, vwlKuerzel, wiKuerzel, modulbezeichnung, pruefer, duration, vorgezogen, date) {
    // Create the <li> element
    const li = document.createElement('li');

    // Create the container div
    const container = document.createElement('div');
    container.className = 'container result';

    // Create the <p> elements for BWL, VWL, WI Kuerzel
    const bwlP = document.createElement('p');
    bwlP.className = 'tag bwltag';
    bwlP.id = 'bwlkuerzel';
    bwlP.textContent = bwlKuerzel;

    const vwlP = document.createElement('p');
    vwlP.className = 'tag vwltag';
    vwlP.id = 'vwlkuerzel';
    vwlP.textContent = vwlKuerzel;

    const wiP = document.createElement('p');
    wiP.className = 'tag witag';
    wiP.id = 'wikuerzel';
    wiP.textContent = wiKuerzel;

    // Create <h2> for Modulbezeichnung
    const modulH2 = document.createElement('h2');
    modulH2.id = 'Modulbezeichnung';
    modulH2.textContent = modulbezeichnung;

    // Create <h3> for Prüfer:in
    const prueferH3 = document.createElement('h3');
    prueferH3.id = 'pruefer';
    prueferH3.textContent = 'Prüfer:in: ' + pruefer;

    // Create <p> for Duration
    const durationP = document.createElement('p');
    durationP.id = 'duration';
    durationP.textContent = 'Dauer: ' + duration + ' Minuten';

    // Create <p> for Vorgezogen
    const vorgezogenP = document.createElement('p');
    vorgezogenP.id = 'vorgezogen';
    vorgezogenP.textContent = 'Klausur: ' + vorgezogen;

    // Create <p> for Date
    const dateP = document.createElement('p');
    dateP.id = 'date';
    dateP.textContent = 'Datum und Uhrzeit: ' + date;

    // Create <button> for "mehr"
    const button = document.createElement('button');
    button.className = 'button';
    button.id = 'mehr';
    button.textContent = 'mehr';

    // Append all the elements to the container div
    container.appendChild(bwlP);
    container.appendChild(vwlP);
    container.appendChild(wiP);
    container.appendChild(document.createElement('br'));
    container.appendChild(modulH2);
    container.appendChild(prueferH3);
    container.appendChild(durationP);
    container.appendChild(vorgezogenP);
    container.appendChild(dateP);
    container.appendChild(document.createElement('br'));
    container.appendChild(button);

    // Append the container div to the <li> element
    li.appendChild(container);

    // Append the <li> to the <ul> with the id "moduleList"
    document.getElementById('resultList').appendChild(li);
}

function requestSync(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

async function getData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error.message);
    }
  }


function addToDom(obj) {
    addModule(obj["Modulnumm\ner BWL"], obj["Modulnumm\ner VWL"], obj["Modulnumm\ner WI"], obj.Modulbezeichnungen, obj["Prüfer:in"], obj["Dauer (Min.)"], obj.Klausurtyp, obj["Datum"] + " " + obj["Beginn"]);
}

function findModule(obj, moduleCode) {
    //custom code in ModulName umwandeln
    //aufteilen in BWL VWL und WI
    var modulart = "";

    if (moduleCode[0] === "B") {
        modulart = "Modulnumm\ner BWL";
    } else if (moduleCode[0] === "V") {
        modulart = "Modulnumm\ner VWL";
    } else if (moduleCode[0] === "W") {
        modulart = "Modulnumm\ner WI";
    }

    const name = moduleCode.substring(1);


    for (var i = 0; i < obj.length; i++) {
        if (obj[i][modulart] = name) {
            return i;
        }
    }
    return -1
}


//sucht nach modulen in obj und hängt gefundene direkt an DOM
function sucheModul(obj, search) {

    //clear List
    document.getElementById('resultList').innerHTML = "";
    
    var found = false;

    //add results
    for (var i = 0; i < obj.length; i++) {


        const nrbwl = String(obj[i]["Modulnumm\ner BWL"]);
        const nrvwl = String(obj[i]["Modulnumm\ner VWL"]);
        const nrwi = String(obj[i]["Modulnumm\ner WI"]);
        const bezeichnung = String(obj[i].Modulbezeichnungen);
        const person = String(obj[i]["Prüfer:in"]);

        const searchable = nrbwl + nrvwl + nrwi + bezeichnung + person;

        if (searchable.toLowerCase().includes(search.toLowerCase())) {
            addToDom(obj[i]);
            found = true
        }
        
    }

    if (!found) {

        const notfound = document.createElement('p');
        notfound.id = 'date';
        notfound.class = 'container'
        notfound.textContent = 'keine Ergebnisse gefunden';

        document.getElementById('resultList').appendChild(notfound);

        

    }
}

