import { Constant } from "./Constant.js";

export default class PreloadScene extends Phaser.Scene {

    constructor() {
        super('PreloadScene');
        this.progressBar = null;
        this.loadingText = null;
        this.fonts = {
            "Poppins_Bold": null,
        }
    }

    preload() {
        this.load.image('one_pixel_white', 'assets/images/one_pixel_white.png');
        this.load.image('progress_base', 'assets/images/progress_base.png');
        this.load.image('progress_bar', 'assets/images/progress_bar.png');
    };

    create() {
        this.LoadFonts();

        this.splashBg = this.add.image(Math.round(Constant.game.config.width / 2), Math.round(Constant.game.config.height / 2), "one_pixel_white").setOrigin(0.5, 0.5).setScale(Math.round(Constant.game.config.width), Math.round(Constant.game.config.height));
        this.splashBg.setTint(0x22542f);
        this.progressBase = this.add.image(Math.round(Constant.game.config.width / 2), Math.round(Constant.game.config.height / 1.25), "progress_base").setOrigin(0.5, 0.5).setScale(Constant.scaleFactor, Constant.scaleFactor);
        this.progressBar = this.add.image(Math.round(Constant.game.config.width / 2), Math.round(Constant.game.config.height / 1.25), "progress_bar").setOrigin(0.5, 0.5).setScale(Constant.scaleFactor, Constant.scaleFactor);
        this.loadingText = this.add.text(Math.round(Constant.game.config.width / 2), Math.round(Constant.game.config.height / 1.2), "Loading: ", { fontFamily: 'Poppins_Bold', fontSize: '46px', fill: '#FFF', fontStyle: "normal", align: 'center' }).setOrigin(0.5, 0.5).setScale(Constant.scaleFactor, Constant.scaleFactor);
        this.progressBar.setCrop(0, 0, 0, this.progressBar.height);
    };

    LoadFonts() {
        let propNames = Object.getOwnPropertyNames(this.fonts);
        propNames.forEach((fontName, index) => {
            let isLast = index >= propNames.length - 1;
            this.fonts[fontName] = new FontFaceObserver(fontName);
            this.fonts[fontName].load().then(this.FontLoadSuccess.bind(this, fontName, isLast), this.FontLoadError.bind(this, fontName));
        });
    };

    FontLoadSuccess(fontName, isLast) {
        if (isLast) {
            this.LoadAssests();
        }
    };
    FontLoadError(fontName) { };

    LoadAssests() {
        this.load.on('progress', this.LoadProgress, this);
        this.load.on('complete', this.OnComplete, { scene: this.scene });

        //MENU
        this.load.image('symbol1', 'assets/images/slot-symbol1.png');
        this.load.image('symbol2', 'assets/images/slot-symbol2.png');
        this.load.image('symbol3', 'assets/images/slot-symbol3.png');
        this.load.image('symbol4', 'assets/images/slot-symbol4.png');
        this.load.image('slot_machine_base1', 'assets/images/slot-machine4.png');
        this.load.image('slot_machine_base2', 'assets/images/slot-machine1.png');
        this.load.image('slot_machine_reels', 'assets/images/slot-machine5.png');
        this.load.image('slot_machine_handle1', 'assets/images/slot-machine2.png');
        this.load.image('slot_machine_handle2', 'assets/images/slot-machine3.png');

        this.load.start();
    };

    LoadProgress(percentage) {
        this.progressBar.setCrop(0, 0, this.progressBar.width * percentage, this.progressBar.height);
        percentage = percentage * 100;
        this.loadingText.setText("Loading: " + parseInt(percentage) + " %");
    };

    OnComplete() {
        setTimeout(() => {
            Constant.game.scene.stop('PreloadScene');
            this.scene.start("GameScene");
        }, 500);
    };

}