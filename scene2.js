class Scene2 extends Phaser.Scene {
    constructor() {
      super("playGame");
    }
  
    create() {
      this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
      this.background.setOrigin(0, 0);
      this.background.setScale(2.4);
  
      this.ship1 = this.add.sprite(config.width / 2 - 50, config.height / 2, "ship");
      this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
      this.ship3 = this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3");
  
      this.ship1.play("ship1_anim");
      this.ship2.play("ship2_anim");
      this.ship3.play("ship3_anim");
  
      this.ship1.setInteractive();
      this.ship2.setInteractive();
      this.ship3.setInteractive();
  
      this.input.on('gameobjectdown', this.destroyShip, this);
      
      this.score = 0;
      this.scoreLabel = this.add.text(10, 5, "SCORE: ", {
        font: "20px"
      })

    //   this.powerUps = this.physics.add.group();
    //   const maxObjects = 4;

    //   for (var i = 0; i <= maxObjects; i++) {
    //     const powerUp = this.physics.add.sprite(16, 16, "power-up");
    //     this.powerUps.add(powerUp);
    //     powerUp.setRandomPosition(0, 0, game.config.width, game.config.height)

    //     if (Math.random() > 0.5) {
    //         powerUp.play("red");
    //     } else {
    //         powerUp.play("gray");
    //     }

    //     powerUp.setVelocity(100, 100)
    //     powerUp.setCollideWorldBounds(true);
    //     powerUp.setBounce(1);
    //   }

      this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 46, "player");
      this.player.play("thrust");
      this.cursorKeys = this.input.keyboard.createCursorKeys();
      this.player.setCollideWorldBounds(true);

      this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      this.projectiles = this.add.group();

    //   this.physics.add.collider(this.projectiles, this.powerUps, function (projectiles, powerUp) {
    //     projectiles.destroy();
    //   })

    //   this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);
      
      this.enemies= this.physics.add.group();
      this.enemies.add(this.ship1)
      this.enemies.add(this.ship2)
      this.enemies.add(this.ship3)

      this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);

      this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

      this.beamSound = this.sound.add("beam");
      this.explosionSound = this.sound.add("explosion");
      this.music = this.sound.add("music");
    //   this.pickupSound = this.sound.add("pickup");

        const musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
     this.music.play(musicConfig);
    }
  
    update() {
      this.moveShip(this.ship1, 1);
      this.moveShip(this.ship2, 2);
      this.moveShip(this.ship3, 3);
  
      this.background.tilePositionY -= 0.2;

      this.movePlayerManager();

      if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
        if (this.player.active) {
            this.shootBeam();
        }
      }

      this.projectiles.getChildren().forEach((projectile) => {
        projectile.update();
      });
    }

    // pickPowerUp(player, powerUp) {
    //     powerUp.disableBody(true, true);
    // }

    shootBeam() {
        const beam = new Beam(this);
        this.beamSound.play();
    }

    movePlayerManager() {
        const Move = 200;
        this.player.setDrag(2000);

        if (this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-Move);
        } else if(this.cursorKeys.right.isDown) {
            this.player.setVelocityX(Move);
        }

         if (this.cursorKeys.up.isDown) {
            this.player.setVelocityY(-Move);
        } else if(this.cursorKeys.down.isDown) {
            this.player.setVelocityY(Move);
        }
    }

    resetPlayer() {
        const x = config.width / 2 - 8;
        const y = config.height + 64;
        this.player.enableBody(true, x, y, true, true);

        this.player.alpha = 0.5;

        const tween = this.tweens.add({
            targets: this.player,
            y: config.height - 64,
            ease: 'Power1',
            duration: 1500,
            repeat:0,
            onComplete: function(){
              this.player.alpha = 1;
            },
            callbackScope: this
        });
    }
  
    hurtPlayer(player, enemy) {
        this.resetShipPos(enemy);

        if(this.player.alpha < 1){
            return;
        }
        
        const explosion = new Explosion(this, player.x, player.y);
        player.disableBody(true,true);

        this.time.addEvent({
            delay: 1000,
            callback: this.resetPlayer,
            callbackScope: this,
            loop: false
        });

        this.explosionSound.play();
    }

    hitEnemy(projectile, enemy) {
        const explosion = new Explosion(this, enemy.x, enemy.y);

        projectile.destroy();
        this.resetShipPos(enemy);

        this.score += 15;
        this.scoreLabel.text = "SCORE: " + this.score;

        this.explosionSound.play();
    }

    moveShip(ship, speed) {
      ship.y += speed;
      if (ship.y > config.height) {
        this.resetShipPos(ship);
      }
    }
  
    resetShipPos(ship){
      ship.y = 0;
      const randomX = Phaser.Math.Between(0, config.width);
      ship.x = randomX;
    }
  
    destroyShip(pointer, gameObject) {
      gameObject.setTexture("explosion");
      gameObject.play("explode");
    }
  }