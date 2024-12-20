const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 625,
    backgroundColor: "#f4f4f4",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    parent: 'game-container'
};

const game = new Phaser.Game(config);

let ball, hoop, leftRim, rightRim, scoreText, highScoreText;
let score = 0;
let highScore = 0;
let timerText;
let timerEvent;
let timeLeft = 15;

function preload() {
    // Load assets
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('hoop', 'assets/images/hoop.png');
    this.load.image('rim', 'assets/images/side_rim.png');
    this.load.audio('score', 'assets/audio/score.wav');
    this.load.audio('fail', 'assets/audio/fail.wav');

    console.log('Assets are being loaded...');
}

function create() {
    console.log('Game is being created...');

    // Add the hoop
    hoop = this.add.image(200, 100, 'hoop').setScale(0.5);

    // Add left and right rims for collision
    leftRim = this.physics.add.staticImage(170, 150, 'rim').setScale(0.5).setVisible(false);
    rightRim = this.physics.add.staticImage(230, 150, 'rim').setScale(0.5).setVisible(false);

    // Add the ball
    ball = this.physics.add.image(200, 500, 'ball').setScale(0.3);
    ball.setBounce(0.8);
    ball.setCollideWorldBounds(true);

    // Enable drag for the ball
    ball.setInteractive();
    this.input.setDraggable(ball);

    // Drag events
    this.input.on('dragstart', (pointer, gameObject) => {
        console.log('Drag started');
        gameObject.body.setVelocity(0, 0);
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        console.log(`Dragging to: (${dragX}, ${dragY})`);
        gameObject.setPosition(dragX, dragY);
    });

    this.input.on('dragend', (pointer, gameObject) => {
        console.log('Drag ended');
        const velocityX = (pointer.upX - pointer.downX) * 3;
        const velocityY = (pointer.upY - pointer.downY) * 3;
        gameObject.body.setVelocity(velocityX, velocityY);
    });

    // Collisions
    this.physics.add.collider(ball, leftRim, onRimHit, null, this);
    this.physics.add.collider(ball, rightRim, onRimHit, null, this);

    // Score and high score
    scoreText = this.add.text(10, 10, 'Score: 0', { font: '20px Arial', fill: '#000' });
    highScoreText = this.add.text(10, 40, 'High Score: 0', { font: '20px Arial', fill: '#000' });

    // Sounds
    this.scoreSound = this.sound.add('score');
    this.failSound = this.sound.add('fail');


    // Timer---
    timerText = this.add.text(300, 10, 'Time: 15', { font: '20px Arial', fill: '#000' });

    // Countdown timer
    timerEvent = this.time.addEvent({
        delay: 1000,
        callback: updateTimer,
        callbackScope: this,
        loop: true,
    });


    function updateTimer() {
        timeLeft--;
        timerText.setText('Time: ' + timeLeft);

        if (timeLeft <= 0) {
            timerEvent.remove(); // Stop the timer
            this.scene.pause(); // Pause the scene
            alert(`Game Over! Your score: ${score}`);
            resetGame(this); // Reset the game
        }
    }

    function resetGame(scene) {
        // Reset all game variables
        timeLeft = 60;
        score = 0;
        scoreText.setText('Score: ' + score);
        timerText.setText('Time: ' + timeLeft);

        // Restart the scene
        scene.scene.restart();
    }
}

function update() {
    // Check if the ball falls out of bounds
    if (ball.y > 625) {
        console.log('Ball out of bounds. Resetting...');
        resetBall(this);
        this.failSound.play();
        updateHighScore();
        score = 0;
        scoreText.setText('Score: ' + score);
    }

    // Check for successful score
    if (ball.y < 120 && ball.x > 170 && ball.x < 230) {
        console.log('Ball scored!');
        score++;
        scoreText.setText('Score: ' + score);
        this.scoreSound.play();
        resetBall(this);
    }
}

function onRimHit() {
    console.log('Ball hit the rim.');
    ball.setVelocityY(ball.body.velocity.y * -0.5);
}

function resetBall(scene) {
    console.log('Resetting ball position.');
    ball.setPosition(200, 500);
    ball.body.setVelocity(0, 0);
}

function updateHighScore() {
    if (score > highScore) {
        console.log('New high score!');
        highScore = score;
        highScoreText.setText('High Score: ' + highScore);
    }
}
