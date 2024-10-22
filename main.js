
//neues Element hinzufügen
function addToDom(obj) {

    //convert obj to variables
    const bwltag = obj["Modulnumm\ner BWL"];
    const vwltag = obj["Modulnumm\ner VWL"];
    const witag = obj["Modulnumm\ner WI"];
    const modulbezeichnung = obj.Modulbezeichnungen;
    const pruefungName = obj.Prüfung;
    const prueferIn = obj["Prüfer:in"];
    const dauer = obj["Dauer (Min.)"];
    const vorgezogen = obj["Anmeldung\nvorgezogen\n(JA/NEIN)"];
    const date = convertDate(obj);


    // Create the <li> element
    const li = document.createElement('li');

    // div
    const div = document.createElement('div');
    div.className = 'container result';

    // Create the <p> elements for BWL, VWL, WI Kuerzel
    const bwlP = document.createElement('p');
    bwlP.className = 'tag bwltag';
    bwlP.textContent = bwltag;

    const vwlP = document.createElement('p');
    vwlP.className = 'tag vwltag';
    vwlP.textContent = vwltag;

    const wiP = document.createElement('p');
    wiP.className = 'tag witag';
    wiP.textContent = witag;

    // Create <h2> for Name der Prüfung
    const pruefung = document.createElement('h2');
    pruefung.textContent = pruefungName;

    // Create <p> for Name der Prüfung
    const modulbez = document.createElement('p');
    modulbez.textContent = modulbezeichnung;

    // Create <h3> for Prüfer:in
    const prueferH3 = document.createElement('h3');
    prueferH3.textContent = 'Prüfer:in: ' + prueferIn;

    // Create <p> for Duration
    const durationP = document.createElement('p');
    if (dauer) {
        durationP.textContent = 'Dauer: ' + dauer + ' Minuten';
    }
    

    // Create <p> for Vorgezogen
    const vorgezogenP = document.createElement('p');
    vorgezogenP.textContent = 'vorgezogen: ' + vorgezogen;

    // Create <p> for Date
    const dateP = document.createElement('p');
    dateP.textContent = 'Zeit: ' + date;

    // Append all the elements to the li
    div.appendChild(bwlP);
    div.appendChild(vwlP);
    div.appendChild(wiP);
    div.appendChild(document.createElement('br'));
    div.appendChild(pruefung);
    div.appendChild(modulbez);
    div.appendChild(prueferH3);
    div.appendChild(durationP);
    div.appendChild(vorgezogenP);
    div.appendChild(dateP);
    div.appendChild(document.createElement('br'));

    // append div to li
    li.appendChild(div);

    // Append the <li> to the <ul> with the id "moduleList"
    document.getElementById('resultList').appendChild(li);
}

function convertDate(obj) {
    var date = String(obj.Datum);
    if (date.length === 7) {
        date = date[0] + '.' + date[1] + date[2] + '.' + date.substring(3);
    } else if (date.length === 8) {
        date = date[0] + date[1] + '.' + date[2] + date[3] + '.' + date.substring(4);
    }

    var result = obj.Tag + " " + date + " " + obj.Beginn;

    if(obj.Beginn) {
        result += " Uhr";
    }

    return result;
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
        if (obj[i][modulart] === name) {
            console.log(obj[i])
            addToDom(obj[i]);  
        }
    }
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

