import Explosion from "./explosion";
import { LightParticle } from "./particle";
import ShootingPatterns from "./shooting_patterns";

class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = "player", powerUp = "water") {
    super(scene, x, y, name);
    this.name = name;
    this.spawnShadow(x, y);
    this.powerUp = powerUp;
    this.id = Math.random();
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.setAllowGravity(false);
    this.body.setCircle(26);
    this.body.setOffset(6, 9);
    this.power = 0;
    this.blinking = false;
    this.shootingPatterns = new ShootingPatterns(this.scene, this.name);
    this.init();
    this.setControls();
    this.initTouchControls(); // Инициализация управления для тач-устройств
  }

  spawnShadow(x, y) {
    this.shadow = this.scene.add
        .image(x + 20, y + 20, "player")
        .setTint(0x000000)
        .setAlpha(0.4);
  }

  init() {
    this.scene.anims.create({
      key: this.name,
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 0,
        end: 0,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: this.name + "right",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 1,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: this.name + "left",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 2,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.play(this.name, true);

    this.upDelta = 0;
    this.isShooting = false; // Флаг для проверки, стреляет ли игрок
  }

  setControls() {
    this.SPACE = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.cursor = this.scene.input.keyboard.createCursorKeys();
    this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  initTouchControls() {
    this.scene.input.on('pointerdown', (pointer) => {
      // Стреляем при нажатии
      this.isShooting = true;
      this.shoot(); // Стреляем сразу при нажатии
    });

    this.scene.input.on('pointerup', (pointer) => {
      // Останавливаем стрельбу при отпускании
      this.isShooting = false;
    });

    this.scene.input.on('pointermove', (pointer) => {
      // Перемещаем игрока в зависимости от положения указателя
      this.x = pointer.x;
      this.y = pointer.y;
      this.updateShadow();

      // Если игрок стреляет, вызываем shoot() в определенных интервалах
      // Убираем стрельбу при перемещении
      // Стрельба будет только по тапу
    });
  }

  moveLeft() {
    this.x -= 5;
    this.anims.play(this.name + "left", true);
    this.shadow.setScale(0.5, 1);
  }

  moveRight() {
    this.x += 5;
    this.anims.play(this.name + "right", true);
    this.shadow.setScale(0.5, 1);
  }

  moveUp() {
    this.y -= 5;
  }

  moveDown() {
    this.y += 5;
  }

  shoot() {
    this.scene.playAudio("shot");
    this.shootingPatterns.shoot(this.x, this.y, this.powerUp);
  }

  decreaseLife(count) {
    this.lives -= count;
  }

  increaseLife(count) {
    this.lives += count;
  }

  update(timestep, delta) {
    if (this.death) return;

    if (this.cursor.left.isDown || this.A.isDown) {
      if (this.cursor.up.isDown || this.W.isDown) {
        this.moveLeft();
        this.moveUp();
      } else if (this.cursor.down.isDown || this.S.isDown) {
        this.moveLeft();
        this.moveDown();
      } else {
        this.moveLeft();
      }
    } else if (this.cursor.right.isDown || this.D.isDown) {
      if (this.cursor.up.isDown || this.W.isDown) {
        this.moveRight();
        this.moveUp();
      } else if (this.cursor.down.isDown || this.S.isDown) {
        this.moveRight();
        this.moveDown();
      } else {
        this.moveRight();
      }
    } else if (this.cursor.up.isDown || this.W.isDown) {
      this.moveUp();
    } else if (this.cursor.down.isDown || this.S.isDown) {
      this.moveDown();
    } else {
      this.anims.play(this.name, true);
      this.shadow.setScale(1, 1);
    }

    if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
      this.shoot();
    }

    this.scene.trailLayer.add(
        new LightParticle(this.scene, this.x, this.y, 0x5238CE, 8)
    );

    this.updateShadow();
  }

  updateShadow() {
    this.shadow.x = this.x + 20;
    this.shadow.y = this.y + 20;
  }

  showPoints(score, color = 0xff0000) {
    let text = this.scene.add
        .bitmapText(this.x + 20, this.y - 30, "starshipped", score, 20, 0xfffd37)
        .setOrigin(0.5);
    this.scene.tweens.add({
      targets: text,
      duration: 2000,
      alpha: { from: 1, to: 0 },
      y: { from: text.y - 10, to: text.y - 100 },
    });
  }

  dead() {
    const explosion = this.scene.add
        .circle(this.x, this.y, 10)
        .setStrokeStyle(40, 0xffffff);
    this.scene.tweens.add({
      targets: explosion,
      radius: { from: 10, to: 512 },
      alpha: { from: 1, to: 0.3 },
      duration: 300,
      onComplete: () => {
        explosion.destroy();
      },
    });
    this.scene.cameras.main.shake(500);
    this.death = true;
    this.shadow.destroy();
    new Explosion(this.scene, this.x, this.y, 40);
    super.destroy();
  }
}

export default Player;
