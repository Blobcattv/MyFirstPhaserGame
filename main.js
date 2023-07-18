const config = {
    width: 400,
    height: 400,
    backgroundColor: 0x20395,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    zoom: 2,
    scene: [Scene1, Scene2]
}

const gameSettings = {
    playerSpeed: 200
}

const game = new Phaser.Game(config);
