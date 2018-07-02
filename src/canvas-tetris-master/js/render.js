var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
var ctx = canvas.getContext( '2d' );
var W = 480, H = 480;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
score = 0
// draw a single square at (x, y)
function drawBlock( x, y ) {
    ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}

// draws the board and the moving shape
function render(score) {
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,W,H)
    ctx.clearRect( 1, 1, W-2, H-2 );
    // ctx.clearRect( 0, 0, W, H );
    drawScore(score)

    ctx.strokeStyle = 'black';
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
            if ( board[ y ][ x ] ) {
                ctx.fillStyle = colors[ board[ y ][ x ] - 1 ];
                drawBlock( x, y );
            }
        }
    }

    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                ctx.fillStyle = colors[ current[ y ][ x ] - 1 ];
                drawBlock( currentX + x, currentY + y );
            }
        }
    }

}

function drawScore(score) {
    // ctx.fillStyle="red";
    ctx.clearRect(W+20, 0, 400, 400)
    ctx.fillStyle="black";
    // ctx.fillRect( W+20, 0, 50, 50)
    ctx.font="30px Arial";
    tmp = "Score : " + score
    ctx.fillText(tmp, W + 5, 25)
}