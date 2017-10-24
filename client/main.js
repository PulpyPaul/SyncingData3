let canvas;
let ctx;
let socket;
let hash;
let draws = [];
let speed;

const init = () => {
    speed = 5;
    
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');
    
    socket = io.connect();
    
    socket.on('connect', (data) => {
        hash = data.userID;
        draws[hash] = data;
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
        
        ctx.fillRect(draws.x, draws.y, draws.width, draws.height);
    }
}

// Adjusts user's position based on input
const handleKeyDown = (e) => {
    let key = e.which;
    
    let square = draws[hash];
    
    // W 
    if(key === 87) {
        square.y -= speed;
    }
    // A
    else if(key === 65) {
        square.x -= speed;
    }
    // S 
    else if(key === 83) {
        square.y += speed;
    }
    // D
    else if(key === 68) {
        square.x += speed;
    }
    
    socket.emit('movementUpdate', draws);
}

window.onload = init;