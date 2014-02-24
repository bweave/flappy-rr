// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game( 500, 490, Phaser.AUTO, 'game_div' );
var game_state = {};

// Creates a new 'main' state that wil contain the game
game_state.main = function() { };
game_state.main.prototype = {

    preload: function() {
		this.game.stage.backgroundColor = '#71c5cf';
        this.game.load.image( 'bird', 'assets/bird.png' );
        this.game.load.image( 'pipe', 'assets/pipe.png' );
    },

    create: function() {
    	this.bird = this.game.add.sprite( 100,245, 'bird' );
        this.bird.body.gravity.y = 1000;

        this.pipes = game.add.group();
        this.pipes.createMultiple( 20, 'pipe' );

        this.timer = this.game.time.events.loop( 1500, this.addRowOfPipes, this );

        this.score = 0;

        var style = {
            font: '30px Arial',
            fill: '#ffffff'
        };

        this.labelScore = this.game.add.text( 20, 20, "0", style );

        var spaceKey = this.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
        spaceKey.onDown.add( this.jump, this );
    },

    update: function() {
		if (this.bird.inWorld === false) {
            this.restartGame();
        }

        this.game.physics.overlap( this.bird, this.pipes, this.restartGame, null, this );
    },

    addOnePipe: function( x, y ) {
        var pipe = this.pipes.getFirstDead();

        pipe.reset( x, y );
        pipe.body.velocity.x = -200;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        var hole = Math.floor( Math.random() * 5 ) + 1;

        for ( var i = 0; i < 8; i++ ) {
            if ( i !== hole && i !== hole + 1 ) {
                this.addOnePipe( 500, (i * 60 + 10) );
            }
        }

        this.score += 1;
        this.labelScore.content = this.score;
    },

    jump: function() {
        this.bird.body.velocity.y = -250;
    },

    restartGame: function() {
        this.game.time.events.remove( this.timer );
        this.game.state.start('main');
    }
};

// Add and start the 'main' state to start the game
game.state.add('main', game_state.main);
game.state.start('main');