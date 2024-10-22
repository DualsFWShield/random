// ---------------------- Roulette Graphique avec aiguille ----------------------

function spinRoulette() {
    const options = document.getElementById('rouletteOptions').value.split(',').map(option => option.trim());
    const canvas = document.getElementById('rouletteCanvas');
    const ctx = canvas.getContext('2d');
    const segments = options.length;
    const arcSize = (2 * Math.PI) / segments;
    let angle = 0;

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the segments of the roulette
    options.forEach((option, i) => {
        ctx.beginPath();
        ctx.arc(150, 150, 150, angle, angle + arcSize);
        ctx.lineTo(150, 150);
        ctx.fillStyle = `hsl(${(i / segments) * 360}, 100%, 50%)`; // Dynamic color for each segment
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // Draw the text
        ctx.save();
        ctx.translate(150, 150);
        ctx.rotate(angle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "14px Arial";
        ctx.fillText(option, 140, 10);
        ctx.restore();

        angle += arcSize;
    });

    // Animate the roulette spin
    let currentAngle = 0;
    const spinDuration = 3000; // 3 seconds
    const startTime = Date.now();
    const randomSpin = Math.random() * 360 + 360 * 5; // Random spin with at least 5 full rotations

    function animateSpin() {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < spinDuration) {
            currentAngle = (elapsedTime / spinDuration) * randomSpin;
            canvas.style.transform = `rotate(${currentAngle}deg)`;
            requestAnimationFrame(animateSpin);
        } else {
            // Stop the spin and determine the result
            const finalAngle = currentAngle % 360;
            const selectedOptionIndex = Math.floor(segments - (finalAngle / 360) * segments) % segments;
            document.getElementById('output').innerText = `Le résultat est : ${options[selectedOptionIndex]}`;
        }
    }

    animateSpin();
}

// ---------------------- Dés 3D ----------------------

function rollDice3D() {
    const diceCount = document.getElementById('diceCount').value;
    const diceContainer = document.getElementById('dice3DContainer');
    diceContainer.innerHTML = ''; // Clear the container before rolling the dice

    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, diceContainer.offsetWidth / diceContainer.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(diceContainer.offsetWidth, diceContainer.offsetHeight);
    diceContainer.appendChild(renderer.domElement);

    // Create dice
    const diceArray = [];
    for (let i = 0; i < diceCount; i++) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const materials = [
            new THREE.MeshBasicMaterial({ color: 0xff0000, map: createDiceFaceTexture(1) }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00, map: createDiceFaceTexture(2) }),
            new THREE.MeshBasicMaterial({ color: 0x0000ff, map: createDiceFaceTexture(3) }),
            new THREE.MeshBasicMaterial({ color: 0xffff00, map: createDiceFaceTexture(4) }),
            new THREE.MeshBasicMaterial({ color: 0xff00ff, map: createDiceFaceTexture(5) }),
            new THREE.MeshBasicMaterial({ color: 0x00ffff, map: createDiceFaceTexture(6) })
        ];
        const dice = new THREE.Mesh(geometry, materials);
        scene.add(dice);
        dice.position.x = (i - diceCount / 2) * 2; // Position the dice
        dice.rotation.x = Math.random() * Math.PI;
        dice.rotation.y = Math.random() * Math.PI;
        diceArray.push(dice);
    }

    camera.position.z = 5;

    let animationFrameId;
    const animate = function () {
        animationFrameId = requestAnimationFrame(animate);
        diceArray.forEach(dice => {
            dice.rotation.x += 0.1;
            dice.rotation.y += 0.1;
        });
        renderer.render(scene, camera);
    };
    animate();

    // Stop the animation after 3 seconds and display the result
    setTimeout(() => {
        cancelAnimationFrame(animationFrameId);
        diceArray.forEach(dice => {
            // Randomize the final rotation to simulate a random face
            dice.rotation.x = Math.random() * Math.PI * 2;
            dice.rotation.y = Math.random() * Math.PI * 2;
        });
        renderer.render(scene, camera);

        const results = diceArray.map(dice => {
            const faceIndex = Math.floor(Math.random() * 6);
            return faceIndex + 1;
        });
        document.getElementById('output').innerText = `Résultat des dés : ${results.join(', ')}`;
    }, 3000);
}

function createDiceFaceTexture(number) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, canvas.width / 2, canvas.height / 2);
    return new THREE.CanvasTexture(canvas);
}

// ---------------------- Tirage de Cartes avec images ----------------------

function drawCard() {
    const cards = [
        'ace_of_spades.png',
        'king_of_hearts.png',
        'queen_of_clubs.png',
        'jack_of_diamonds.png',
        '10_of_spades.png',
        '9_of_hearts.png'
    ];
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    document.getElementById('cardResult').innerHTML = `<img src="images/${randomCard}" alt="Carte aléatoire">`;
}

// ---------------------- Couleur Aléatoire avec affichage HEX ----------------------

function generateRandomColor() {
    let randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    while (randomColor.length < 7) {
        randomColor += '0';
    }
    document.getElementById('randomColorResult').style.backgroundColor = randomColor;
    document.getElementById('randomColorHex').innerText = randomColor;
}

// ---------------------- Nombre Aléatoire ----------------------

function generateRandomNumber() {
    const min = parseInt(document.getElementById('randomNumberMin').value);
    const max = parseInt(document.getElementById('randomNumberMax').value);
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    document.getElementById('randomNumberResult').innerText = `Nombre aléatoire : ${randomNumber}`;
}

// Pile ou face avec animation simple
function flipCoin() {
    const outcome = Math.random() < 0.5 ? "Pile" : "Face";
    document.getElementById('coinResult').innerText = `Résultat : ${outcome}`;
}

// Sélection aléatoire d'un élément dans une liste
function pickRandomItem() {
    const itemList = document.getElementById('itemList').value.split(',').map(item => item.trim());
    const randomItem = itemList[Math.floor(Math.random() * itemList.length)];
    document.getElementById('randomItemResult').innerText = `Sélectionné : ${randomItem}`;
}

// Générer une date/heure aléatoire entre deux dates
function generateRandomDate() {
    const start = new Date(document.getElementById('dateStart').value);
    const end = new Date(document.getElementById('dateEnd').value);

    if (start > end) {
        document.getElementById('randomDateResult').innerText = "La date de début doit être inférieure à la date de fin.";
        return;
    }

    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    document.getElementById('randomDateResult').innerText = `Date Aléatoire : ${randomDate}`;
}