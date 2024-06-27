import { Constant } from "./Constant.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.symbols = ['symbol1', 'symbol2', 'symbol3', 'symbol4'];
        this.reels = [];
        this.repeat = [3, 6, 9];
        this.payouts = {
            "symbol1": 10,
            "symbol2": 20,
            "symbol3": 30,
            "symbol4": 40,
            "bonus": 50
        };
    };

    init() { };
    preload() { };

    create() {
        this.CreateBg();
        this.CreateMask();
        this.CreateReels();
        this.CreateBase();
        this.CreateSpinButton();
        this.CreatePopup();
    };

    CreateBg() {
        this.gameplayBg = this.add.image(Math.round(Constant.game.config.width / 2), Math.round(Constant.game.config.height / 2), "one_pixel_white").setOrigin(0.5, 0.5).setScale(Math.round(Constant.game.config.width), Math.round(Constant.game.config.height));
        this.gameplayBg.setTint(0x5b6624);
        this.baseFalse = this.add.image(Math.round(Constant.game.config.width / 2), Math.round(Constant.game.config.height / 2), "slot_machine_base1").setOrigin(0.5, 0.5).setScale(Constant.scaleFactor, Constant.scaleFactor);
        this.baseFalse.setVisible(false)
    };

    CreateBase() {
        this.base = this.add.sprite(Math.round(Constant.game.config.width / 2), Math.round(Constant.game.config.height / 2), "slot_machine_base1").setOrigin(0.5, 0.5).setScale(Constant.scaleFactor, Constant.scaleFactor);
    };

    CreateMask() {
        this.graphics = this.add.graphics(0, 0);
        this.graphics.fillRect(0, 0, this.baseFalse.displayWidth, this.baseFalse.displayHeight);
        this.graphics.x = this.baseFalse.x - this.baseFalse.displayWidth / 2;
        this.graphics.y = this.baseFalse.y - this.baseFalse.displayHeight / 2;
    };

    CreateReels() {
        this.reelsImg = this.add.image(Math.round(Constant.game.config.width / 2), Math.round(Constant.game.config.height / 2), "slot_machine_reels").setOrigin(0.5, 0.5).setScale(Constant.scaleFactor, Constant.scaleFactor)

        for (let i = 0; i < 3; i++) {
            let reelContainer = this.add.container(this.reelsImg.x - 125, this.reelsImg.y - 65);
            for (let j = 0; j < 4; j++) {
                let symbol = this.add.image(i * 130, 0 + j * 100, Phaser.Utils.Array.GetRandom(this.symbols));
                reelContainer.add(symbol);
            }
            this.reels.push(reelContainer);
        }

        for (let i = 0; i < this.reels.length; i++) {
            let reelContainer = this.reels[i];
            reelContainer.mask = new Phaser.Display.Masks.GeometryMask(this, this.graphics);
        }
    };

    CreateSpinButton() {
        this.spinButton = this.add.image(Math.round(Constant.game.config.width / 2), Math.round(Constant.game.config.height / 2), "slot_machine_handle1").setOrigin(0.5, 0.5).setScale(Constant.scaleFactor, Constant.scaleFactor);
        this.spinButton.setInteractive({ useHandCursor: true });
        this.spinButton.on('pointerdown', this.SpinReels, this);
        this.spinButton.on('pointerup', this.SpinReelsRelease, this);
    };

    SpinReels() {
        this.spinButton.setTexture("slot_machine_handle2");
        for (let index = 0; index < this.reels.length; index++) {
            let height = this.reels[index].list[0].displayHeight;
            this.columnTween1 = this.tweens.add({
                targets: this.reels[index],
                ease: 'Linear',
                props: {
                    y: {
                        value: "+=" + height,
                        duration: 150
                    }
                },
                repeat: this.repeat[index],
                onRepeat: (tween) => {
                    const randomNumber = Phaser.Math.RND.between(1, 4);
                    const target = this.reels[index];
                    tween.updateTo('y', target.y + height, true);
                    target.last.y = target.first.y - height;
                    const symbol = target.last;
                    symbol.setVisible(true).setTexture('symbol' + randomNumber);
                    target.moveTo(symbol, 0);
                },
                onComplete: () => {
                    this.reels[index].setPosition(this.reels[index].x, this.reels[index].y - 96);

                    this.reels[index].setPosition(this.reels[index].x, this.reels[index].y);
                    if (index === this.reels.length - 1) {
                        this.CheckWin();
                    }
                }
            });
        }
    }

    SpinReelsRelease() {
        this.spinButton.setTexture("slot_machine_handle1");
        this.spinButton.removeInteractive();
    };

    HandleBonusFeature() {
        this.ShowPopup("Bonus Feature Activated!");
        //Here to implement what features you want
    }

    CheckWin() {
        let middleRowSymbols = this.reels.map(reel => reel.list[1].texture.key);
        let isWin = middleRowSymbols.every(symbol => symbol === middleRowSymbols[0]);

        if (isWin) {
            let payout = this.payouts[middleRowSymbols[0]];
            this.ShowPopup(`You Win ${payout} Points`);
        } else if (middleRowSymbols.includes('bonus')) {
            this.HandleBonusFeature();
        } else {
            this.ShowPopup("You Lose");
        }
        this.spinButton.setInteractive({ useHandCursor: true });
    };

    CreatePopup() {
        this.popupContainer = this.add.container(Math.round(Constant.game.config.width / 2), Math.round(Constant.game.config.height / 2));

        this.popupBase = this.add.image(0, -450, "one_pixel_white").setOrigin(0.5, 0.5).setScale(Math.round(Constant.game.config.width / 1.9), Math.round(Constant.game.config.height / 10));
        this.popupBase.setTint(0x442694);
        let textStyle = { fontFamily: 'Poppins_Bold', fontSize: '48px', fill: '#FFF', fontStyle: "bold", align: 'center' };
        this.messageText = this.add.text(0, -450, "MESSAGE", textStyle).setOrigin(0.5, 0.5).setScale(Constant.scaleFactor, Constant.scaleFactor);
        this.popupContainer.add([this.popupBase, this.messageText]);
        this.popupContainer.setDepth(2);
        this.popupContainer.setAlpha(0);
    };
    ShowPopup(_msg) {
        this.messageText.setText(_msg);
        this.add.tween({
            targets: [this.popupContainer],
            ease: 'Sine.easeInOut',
            duration: 300,
            alpha: 1,
            callbackScope: this,
            onComplete: () => {
                setTimeout(() => {
                    this.HidePopup();
                }, 700);
            }
        });
    };
    HidePopup() {
        this.add.tween({
            targets: [this.popupContainer],
            ease: 'Sine.easeInOut',
            duration: 200,
            alpha: 0,
            callbackScope: this,
            onComplete: () => {

            }
        });
    };

}