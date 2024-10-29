class Coin extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "coin") {
        super(scene, x, y, name);
        this.name = name;
        this.scene = scene;
        this.id = Math.random();
        this.points = 5000;
        this.spawnShadow(x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setCircle(19);
        this.body.setOffset(12, 12);
        this.body.setVelocityX(-100);
        this.init();
    }

    /*
     The power-up also spawns a shadow.
      */
    spawnShadow(x, y) {
        this.shadow = this.scene.add
            .image(x + 20, y + 20, "coin")
            .setTint(0x000000)
            .setAlpha(0.4);
        this.scene.physics.add.existing(this.shadow);
        this.shadow.body.setVelocityX(-100);
    }

    /*
      This sets the animation and movement of the power-up.
      */
    init() {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name),
            frameRate: 10,
            repeat: -1,
        });

        this.scene.tweens.add({
            targets: this,
            duration: 5000,
            y: { from: this.y, to: this.y + 400 },
            onComplete: () => {
                this.destroy();
            }
        });

        this.scene.tweens.add({
            targets: [this],
            duration: 1000,
            x: { from: this.x, to: 0 },
            scale: { from: 0.8, to: 1 },
            repeat: -1,
            yoyo: true,
        });

        this.scene.tweens.add({
            targets: this.shadow,
            duration: 5000,
            x: { from: this.shadow.x - 20, to: this.shadow.x + 20 },
            scale: { from: 0.8, to: 1 },
            repeat: -1,
            yoyo: true,
        });

        this.anims.play(this.name, true);
        this.body.setVelocityX(-100);
        this.shadow.body.setVelocityX(-100);
        this.direction = -1;
    }

    /*
      When this element is destroyed, it will also destroy the shadow.
      */
    picked() {
        this.showPoints(this.points);
        this.shadow.destroy();
        this.destroy();
    }

    showPoints(score, color = 0xff0000) {
        let text = this.scene.add
            .bitmapText(this.x + 20, this.y - 30, "wendy", "+" + score, 40, color)
            .setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 800,
            alpha: {from: 1, to: 0},
            y: {from: this.y - 20, to: this.y - 80},
            onComplete: () => {
                text.destroy();
            },
        });
    }
}

export default Coin;
