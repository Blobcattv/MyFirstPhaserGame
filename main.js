const config = {
    width: 600,
    height: 500,
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

const game = new Phaser.Game(config);
