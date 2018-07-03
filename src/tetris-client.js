import React from 'react';
import './style.css';
import socketIOClient from "socket.io-client";
// import {Container, Col, Row} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


class Tetris extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            playerId: 0,
            endpoint: "http://127.0.0.1:3010",
            io: socketIOClient("http://127.0.0.1:3010"),
            W: 480,
            H: 480,
            COLS: 16,
            ROWS: 16,
        }
        this.BLOCK_H = this.state.H / this.state.ROWS
        this.BLOCK_W = this.state.W / this.state.COLS
        this.current = []
        this.currentX = 5
        this.currentY = 0
        this.colors = ['cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'];
        this.shapes = [
            [1, 1, 1, 1],
            [1, 1, 1, 0,
                1],
            [1, 1, 1, 0,
                0, 0, 1],
            [1, 1, 0, 0,
                1, 1],
            [1, 1, 0, 0,
                0, 1, 1],
            [0, 1, 1, 0,
                1, 1],
            [0, 1, 0, 0,
                1, 1, 1]
        ];
        this.board = [];
        this.players = [];
        this.playersNUM = 0;
        this.freezed = false;
    }

    drawBlock(x, y) {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillRect(this.BLOCK_W * x, this.BLOCK_H * y, this.BLOCK_W - 1, this.BLOCK_H - 1);
        ctx.strokeRect(this.BLOCK_W * x, this.BLOCK_H * y, this.BLOCK_W - 1, this.BLOCK_H - 1);
    }

    renderGame() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, this.state.W, this.state.H)
        ctx.clearRect(1, 1, this.state.W - 2, this.state.H - 2);
        // ctx.clearRect( 0, 0, W, H );
        this.drawScore()

        ctx.strokeStyle = 'black';
        for (var x = 0; x < this.state.COLS; ++x) {
            for (var y = 0; y < this.state.ROWS; ++y) {
                if (this.board[y][x]) {
                    ctx.fillStyle = this.colors[this.board[y][x] - 1];
                    this.drawBlock(x, y);
                }
            }
        }

        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'black';
        for (var p = 0; p < this.playersNUM; p++) {
            for (var y = 0; y < 4; ++y) {
                for (var x = 0; x < 4; ++x) {
                    if (this.players[p].current[y][x]) {
                        ctx.fillStyle = this.colors[this.players[p].current[y][x] - 1];
                        this.drawBlock(this.players[p].currentX + x, this.players[p].currentY + y);
                    }
                }
            }
        }
    }

    drawScore() {
        const ctx = this.refs.canvas.getContext('2d');
        // ctx.fillStyle="red";
        ctx.clearRect(this.state.W + 20, 0, 400, 400)
        ctx.fillStyle = "black";
        // ctx.fillRect( W+20, 0, 50, 50)
        ctx.font = "30px Arial";
        let tmp = "Score : " + this.score
        ctx.fillText(tmp, this.state.W + 5, 25)
    }

    init() {
        for (var y = 0; y < this.state.ROWS; ++y) {
            this.board[y] = [];
            for (var x = 0; x < this.state.COLS; ++x) {
                this.board[y][x] = 0;
            }
        }
    }
    // newShape() {
    //     var id = Math.floor( Math.random() * this.shapes.length );
    //     var shape = this.shapes[ id ]; // maintain id for color filling

    //     this.current = [];
    //     for ( var y = 0; y < 4; ++y ) {
    //         this.current[ y ] = [];
    //         for ( var x = 0; x < 4; ++x ) {
    //             var i = 4 * y + x;
    //             if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
    //                 this.current[ y ][ x ] = id + 1;
    //             }
    //             else {
    //                 this.current[ y ][ x ] = 0;
    //             }
    //         }
    //     }

    //     // new shape starts to move
    //     this.freezed = false;
    //     // position where the shape will evolve
    //     this.currentX = 5;
    //     this.currentY = 0;
    // }
    componentDidMount() {
        this.init()
        // this.newShape()

        // this.renderGame(200)
        let pkg = {
            id: this.playerId,
            current: this.current,
            currentX: this.currentX,
            currentY: this.currentY,
            freezed: this.freezed,
            score: this.score,
            lose: this.lose,
        }
        this.state.io.emit("start", pkg)
        this.state.io.on("update", (arr) => {
            this.players = arr[0];
            this.playersNUM = this.players.length
            this.board = arr[1];
            // console.log(this.board);

            console.log('updated!!');
            setInterval(this.renderGame(), 60)
        })
    }

    _handleKeyDown(e) {
        console.log('in handle keys');
        console.log(e);
        
        var keys = {
            37: 'left',
            39: 'right',
            40: 'down',
            38: 'rotate',
            32: 'drop'
        };
        if (typeof keys[e.keyCode] != 'undefined') {
            // this.keyPress(keys[e.keyCode]);
            console.log(keys[e.keyCode]);
            
            this.state.io.emit("move", [this.state.playerId, keys[e.keyCode]])

        }
    }

    componentWillMount() {
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown.bind(this));
    }

    keyPress(key) {
        // TODO: not done
        
        // switch ( key ) {
        //     case 'left':
        //         if ( valid( -1 ) ) {
        //             --currentX;
        //         }
        //         break;
        //     case 'right':
        //         if ( valid( 1 ) ) {
        //             ++currentX;
        //         }
        //         break;
        //     case 'down':
        //         if ( valid( 0, 1 ) ) {
        //             ++currentY;
        //         }
        //         break;
        //     case 'rotate':
        //         var rotated = rotate( current );
        //         if ( valid( 0, 0, rotated ) ) {
        //             current = rotated;
        //         }
        //         break;
        //     case 'drop':
        //         while( valid(0, 1) ) {
        //             ++currentY;
        //         }
        //         tick();
        //         break;
        // }
    }


    render() {
        return <div>
            canvas test
        <canvas ref="canvas" width={960} height={480} />
        </div>
    }

}


export default Tetris;
