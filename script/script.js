// inizializzo punteggio
let score = 0;

// all'onload genero i primi due numeri
window.onload = function() {
    genera();
    genera();
}

// assegno i tasti per muovere il gioco
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':
            event.preventDefault(); // non scrolla
            move('up');
            break;
        case 'ArrowDown':
            event.preventDefault(); 
            move('down');
            break;
        case 'ArrowLeft':
            event.preventDefault(); 
            move('l');
            break;
        case 'ArrowRight':
            event.preventDefault(); 
            move('r');
            break;
        default:
            break; 
    }
});



// funzione che si attiva all'onload e ad ogni mossa per geneare un nuovo numero
function genera() {

    // genero con probabilita maggiore per il 2 il numero da mettere nel campo di gioco
    let n = Math.floor(Math.random() * 10);
    n < 8 ? n = '2' : n = '4';

    // inizializzo variabile per avere lo scope su tutta la funzione
    let cella;

    for (i = 0; i < 16; i++) {
        cella = Math.floor(Math.random()*4).toString() + Math.floor(Math.random()*4).toString();
        if (document.getElementById(cella).textContent === '') {
            break;
        }
    }

    if (document.getElementById(cella).textContent === '') {
       // aggiungo n e cambio lo stile della cella
        document.getElementById(cella).textContent = n;
        document.getElementById(cella).classList.add(`n${n}`); 
        let img = document.createElement('img');
        img.src = `img/${n}.png`;
        document.getElementById(cella).appendChild(img);
        
    }


}

// ritorna la tabella corrente
function currentTable() {
    // inizializzo tabella
    let table = [];

    // ricreo la tabella corrente in un array
    for (let j = 0; j < 4; j++) {
        let row = [];
        for (let i = 0; i < 4; i++) {
            let cell = document.getElementById(`${j}${i}`).textContent;
            row.push(cell === '' ? 0 : parseInt(cell));
        }
        table.push(row);
    }
    return table;
}

function aggiorna(table) {
    // Aggiorna la pagiina immettendi la nuova tabella e applicando gli stili
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
            let cell = document.getElementById(`${j}${i}`);
            cell.textContent = table[j][i] === 0 ? '' : table[j][i];
            cell.setAttribute('class', '');
            if (table[j][i] !== 0) {
                cell.classList.add(`n${table[j][i]}`);
                let img = document.createElement('img');
                img.src = `img/${table[j][i]}.png`;
                cell.appendChild(img);
            }
        }
    }
}

function move(direction) {
    // inizializzo tabella
    let table = currentTable();

    

    // in base alla direzione assegno la funzione
    switch (direction) {
        case 'l':
            table = moveLeft(table);
            break;
        case 'r':
            table = moveRight(table);
            break;
        case 'up':
            table = moveUp(table);
            break;
        case 'down':
            table = moveDown(table);
            break;
    }

    aggiorna(table); // Aggiorna la pagina
    
    genera(); // Genera un nuovo numero

    
}




// funzione unisci 
function unisci(row) {
// per ogni elemnto della row apparte l'ultimo
for (let i = 0; i < row.length - 1; i++) {
    // se è uguale al successivo
    if (row[i] === row[i + 1]) {
        // sommo i due numeri
        row[i] *= 2;
        if (row[i] === 2048) {
            vittoria();
        }
        // aggiorno il punteggio
        score += row[i];
        document.getElementById('score').textContent = 'Score: ' + score;
        // elimino il secondo numero
        row[i + 1] = 0;
    }
}

}

function moveLeft(table) {
    // per ogni riga
    for (let j = 0; j < 4; j++) {
        // rimuovo gli zeri
        let row = table[j].filter(n => n !== 0); 
        // richiamo per sommare
        unisci(row);
        // rimuovo gli zeri
        row = row.filter(n => n !== 0);
        // aggiungo gli zeri fino a 4
        while (row.length < 4) {
            row.push(0);
        }
        // aggiorno la tabella
        table[j] = row;
    }
    return table;
}

// il ragionamento è lo stesso di moveleft ma con i reverse
function moveRight(table) {
    for (let j = 0; j < 4; j++) {
        let row = (table[j].reverse()).filter(n => n !== 0); // Rimuovi gli 0
        unisci(row);
        
        row = row.filter(n => n !== 0); // Rimuovi gli 0 generati
        while (row.length < 4) {
            row.push(0);
        }
        row = row.reverse();
        table[j] = row;
    }
    return table;
}

// ragiono allo stesso modo avendo righe verticali
function moveUp(table) {
    // per ogni colonna
    for (let i = 0; i < 4; i++) {
        // array colonna
        let column = [];

        for (let j = 0; j < 4; j++) {
         
            column.push(table[j][i]);
        }
        column = column.filter(n => n !== 0); // Rimuovi gli 0
        unisci(column);
        column = column.filter(n => n !== 0); // Rimuovi gli 0 generati
        while (column.length < 4) {
            column.push(0);
        }
        
        for (let j = 0; j < 4; j++) {
            table[j][i] = column[j];
        }
    }
    return table;
}

// ragiono allo stesso modo avendo righe verticali e come per moveRight uso il reverse
function moveDown(table) {
    for (let i = 0; i < 4; i++) {
        let column = [];
        for (let j = 0; j < 4; j++) {
            column.push(table[j][i]);
        }
        column = (column.reverse()).filter(n => n !== 0); // Rimuovi gli 0
        unisci(column);
        column = column.filter(n => n !== 0); // Rimuovi gli 0 generati
        while (column.length < 4) {
            column.push(0);
        }
        column = column.reverse();
        for (let j = 0; j < 4; j++) {
            table[j][i] = column[j];
        }
    }
    return table;
}

// restart
function restart() {
    location.reload();
}

// inizializzo tempo
let time = 600;

// ogni secondo aggiorno il countdown
setInterval(aggiornaCountdown, 1000);


function aggiornaCountdown() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    // aggiunngo 0 per avere sempre due cifre
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    // aggiorno
    document.getElementById('countdown').innerHTML = `${minutes}:${seconds}`;
    time--;
    // tempo scaduto
    if (time <= 0) {
        gameOver();
    }
}

// funzione per la sconfitta
function gameOver() {
    document.getElementById('sconfittaText').innerHTML = `Hai pesrso <br> Il tuo punteggio è: ${score}`; 
    document.getElementById('sconfitta').style.display = 'block';
}

// funzione per la vittoria
function vittoria() {
    document.getElementById('vittoriaText').innerHTML = `Hai vinto <br> Il tuo punteggio è: ${score}`; 
    document.getElementById('vittoria').style.display = 'block';
}

function cancellaPiccoli() {
    let table = currentTable();
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
            if (table[j][i] === 2 || table[j][i] === 4) {
                table[j][i] = 0;
            }
        }
    }

    aggiorna(table);

    document.getElementById('cancellaPiccoli').style.display = 'none';


}

function riordina() {
    let table = currentTable();

    let numeri = [];

    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
                numeri.push(table[j][i]);
        }
    }

    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
            
            let max = 0;
            let maxIndex = 0;

            for (let k = 0; k <= numeri.length; k++) {
                if (numeri[k] > max) {
                    max = numeri[k];
                    maxIndex = k;
                }

            
            }

            table[j][i] = max;
            numeri.splice(maxIndex, 1);
        }
    }

    aggiorna(table);

    document.getElementById('riordina').style.display = 'none';

    
}




