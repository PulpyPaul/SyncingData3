let canvas;
let ctx;
let socket;
let hash;
let draws = {};
let speed;

const init = () => {
    speed = 5;
    
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');
    
    socket = io.connect();
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);    
    
    socket.on('join', (data) => {
        hash = data.userID;
        draws[hash] = data;
        setInterval(update, 20);
    });
    
    socket.on('updateCanvas', (data) => {
        draws = data;
        draw();
    });
}

// Draws everything in the draw array
const draw = () => {
    
    ctx.clearRect(0, 0, 500, 500);
    
    let keys = Object.keys(draws);
    
    for(let i = 0; i < keys.length; i++){
        const square = draws[keys[i]];
        
        ctx.fillRect(square.x, square.y, square.width, square.height);
    }
}

// Keydown event
const handleKeyDown = (e) => {
    let key = e.which;
    
    // A 
    if(key === 65) {
        draws[hash].moveLeft = true;
    }
    // D
    else if(key === 68) {
        draws[hash].moveRight = true;
    }
    
    // space
    if (key === 32){
        draws[hash].y -= 200;
    }
}

// Keyup event
const handleKeyUp = (e) => {
    let key = e.which;
    
    // A 
    if(key === 65) {
        draws[hash].moveLeft = false;
    }
    // D
    else if(key === 68) {
        draws[hash].moveRight = false;
    }
}

const update = () => {
    socket.emit('updateMovement', draws[hash]);
}


window.onload = init;