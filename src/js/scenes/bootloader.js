import Phaser from 'phaser';

export default class Bootloader extends Phaser.Scene {
    constructor() {
        super({ key: "bootloader" });
    }

    preload() {
        this.createBars();
        this.setLoadEvents();
        this.loadFonts();
        this.loadImages();
        this.loadAudios();
        this.loadSpritesheets();
        this.setRegistry();
    }

    setLoadEvents() {
        this.load.on(
            "progress",
            function (value) {
                this.progressBar.clear();
                this.progressBar.fillStyle(0xEB64FF, 1);
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                );
            },
            this
        );

        this.load.on(
            "complete",
            () => {
                this.scene.start("splash");
            },
            this
        );
    }

    loadFonts() {
        this.load.bitmapFont(
            "wendy",
            "assets/fonts/wendy.png",
            "assets/fonts/wendy.xml"
        );
    }

    loadImages() {
        this.load.image("logo", "assets/images/logo.png");
        this.load.image("background", "assets/background/background.png");
        Array(2)
            .fill(0)
            .forEach((_, index) => {
                this.load.image(`stage${index}`, `assets/background/stage${index}.png`);
            });
    }

    loadAudios() {
        this.load.audio("shot", "assets/sounds/shot.mp3");
        this.load.audio("foeshot", "assets/sounds/foeshot.mp3");
        this.load.audio("foedestroy", "assets/sounds/foedestroy.mp3");
        this.load.audio("foexplosion", "assets/sounds/foexplosion.mp3");
        this.load.audio("explosion", "assets/sounds/explosion.mp3");
        this.load.audio("stageclear1", "assets/sounds/stageclear1.mp3");
        this.load.audio("stageclear2", "assets/sounds/stageclear2.mp3");
        this.load.audio("boss", "assets/sounds/boss.mp3");
        this.load.audio("splash", "assets/sounds/splash.mp3");
        Array(3)
            .fill(0)
            .forEach((_, index) => {
                this.load.audio(`music${index}`, `assets/sounds/music${index}.mp3`);
            });
    }

    loadSpritesheets() {
        this.load.spritesheet("player", "assets/characters/player.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("foe0", "assets/characters/foe0.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("foe1", "assets/characters/foe1.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("boss", "assets/characters/boss0.png", {
            frameWidth: 128,
            frameHeight: 102,
        });
        this.load.spritesheet("heal", "assets/objects/heal.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("coin", "assets/objects/coin.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("booster", "assets/objects/booster.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    setRegistry() {
        this.registry.set("score_player", 0);
        this.registry.set("power_player", "water");
        this.registry.set("lives_player", 5);
    }

    createBars() {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x5238CE, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
