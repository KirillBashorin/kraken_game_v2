import SceneEffect from "../gameObjects/sceneEffect";

export default class Splash extends Phaser.Scene {
    constructor() {
        super({ key: "splash" });
    }

    create() {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.addBackground();
        this.showLogo();
        this.center_height = this.height / 2;
        this.registry.set("currentPowerUp", 0);
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on(
            "keydown-SPACE",
            () => this.transitionToChange(),
            this
        );

        this.input.on('pointerdown', () => this.transitionToChange(), this);

        this.playMusic();
    }

    addBackground() {
        this.background = this.add
            .tileSprite(0, 0, this.width, this.height, "background")
            .setOrigin(0)
            .setScrollFactor(0, 1);
    }

    transitionToChange() {
        new SceneEffect(this).simpleClose(this.startGame.bind(this));
    }

    startGame() {
        if (this.theme) this.theme.stop();
        this.scene.start("transition", {
            next: "game",
            name: "STAGE",
            number: 0,
            time: 30,
        });
    }

    showLogo() {
        this.gameLogoShadow = this.add
            .image(this.center_width, 250, "logo")
            .setScale(0.7)
            .setOrigin(0.5);
        this.gameLogoShadow.setOrigin(0.48);
        this.gameLogoShadow.tint = 0x3e4e43;
        this.gameLogoShadow.alpha = 0.6;
        this.gameLogo = this.add
            .image(this.center_width, 250, "logo")
            .setScale(1)
            .setOrigin(0.5);

        this.tweens.add({
            targets: [this.gameLogo, this.gameLogoShadow],
            duration: 500,
            y: {
                from: 200,
                to: 250,
            },
        });

        this.tweens.add({
            targets: [this.gameLogo, this.gameLogoShadow],
            duration: 1500,
            y: {
                from: 200,
                to: 250,
            },
            repeat: -1,
            yoyo: true,
        });
    }

    playMusic(theme = "splash") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0,
        });
    }

    showInstructions() {
        this.add
            .bitmapText(this.center_width, 450, "wendy", "Arrows to move", 30)
            .setOrigin(0.5)
            .setDropShadow(3, 4, 0x222222, 0.7);
        this.add
            .bitmapText(this.center_width, 500, "wendy", "SPACE to shoot", 30)
            .setOrigin(0.5)
            .setDropShadow(3, 4, 0x222222, 0.7);

        this.space = this.add
            .bitmapText(this.center_width, 680, "wendy", "Press SPACE to start", 30)
            .setOrigin(0.5)
            .setDropShadow(3, 4, 0x222222, 0.7);

        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: { from: 0, to: 1 },
            repeat: -1,
            yoyo: true,
        });
    }
}
