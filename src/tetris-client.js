import React from 'react';
import './style.css';
// import {Container, Col, Row} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


class Tetris extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            playerId: this.props.playerId,
            roomId: this.props.roomId,
            io: this.props.io,
            W: 480,
            H: 480,
            COLS: 20,
            ROWS: 20,
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
        this.interval = undefined
        this.ctx = undefined;
        this.handler = undefined
    }

    drawBlock(x, y) {
        // const ctx = this.refs.canvas.getContext('2d');
        this.ctx.fillRect(this.BLOCK_W * x, this.BLOCK_H * y, this.BLOCK_W - 1, this.BLOCK_H - 1);
        this.ctx.strokeRect(this.BLOCK_W * x, this.BLOCK_H * y, this.BLOCK_W - 1, this.BLOCK_H - 1);
    }

    renderGame() {
        // const ctx = this.refs.canvas.getContext('2d');
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0, 0, this.state.W, this.state.H)
        this.ctx.clearRect(1, 1, this.state.W - 2, this.state.H - 2);
        // ctx.clearRect( 0, 0, W, H );
        this.drawScore()

        this.ctx.strokeStyle = 'black';
        for (var x = 0; x < this.state.COLS; ++x) {
            for (var y = 0; y < this.state.ROWS; ++y) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.colors[this.board[y][x] - 1];
                    this.drawBlock(x, y);
                }
            }
        }

        this.ctx.fillStyle = 'red';
        this.ctx.strokeStyle = 'black';
        for (var p = 0; p < this.playersNUM; p++) {
            for (var y = 0; y < 4; ++y) {
                for (var x = 0; x < 4; ++x) {
                    if (this.players[p].current[y][x]) {
                        this.ctx.fillStyle = this.colors[this.players[p].current[y][x] - 1];
                        this.drawBlock(this.players[p].currentX + x, this.players[p].currentY + y);
                    }
                }
            }
        }
    }

    drawScore() {
        // const ctx = this.refs.canvas.getContext('2d');
        // ctx.fillStyle="red";
        this.ctx.clearRect(this.state.W + 20, 0, 400, 400)
        this.ctx.fillStyle = "black";
        // ctx.fillRect( W+20, 0, 50, 50)
        this.ctx.font = "30px Arial";
        let tmp = "Score : " + this.players[this.state.playerId].score
        this.ctx.fillText(tmp, this.state.W + 5, 25)
    }

    renderGameover() {
        // const ctx = this.refs.canvas.getContext('2d');
        this.ctx.fillStyle = "rgba(0,0,0, 0.5)"
        this.ctx.fillRect(0, 0, this.state.W, this.state.H)
        this.ctx.fillStyle = "black";
        this.ctx.font = "30px Arial";
        let txt = ""
        if(this.players[this.state.playerId].lose)
            txt = "Lose!!"
        else
            txt = "Win!!"
        this.ctx.fillText(txt, this.state.W/2 - 50, this.state.H/2 - 20)
        setTimeout(() => {
            this.props.exitGame(!this.players[this.state.playerId].lose)
        }, 3000);
    }
   
    componentDidMount() {
        console.log('canvas mounted');
        this.ctx = this.refs.canvas.getContext('2d');
        this.state.io.on("update", (arr) => {
            this.players = arr[0];
            this.playersNUM = this.players.length
            this.board = arr[1];
            // console.log(this.board);
            console.log('updated!!');
            this.interval = setInterval(this.renderGame(), 60)

        })

        this.state.io.on("game over", (data) => {
            this.players = data
            clearInterval(this.interval)
            this.renderGameover()
            // document.removeEventListener("keydown", this._handleKeyDown);
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
            this.state.io.emit("move", [this.state.playerId, keys[e.keyCode], this.state.roomId])
        }
    }

    componentWillMount() {
        if(this.props.firstFlag){
            document.addEventListener("keydown", this._handleKeyDown.bind(this));
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown.bind(this));
    }


    render() {
        return <div ref="div">
        <canvas ref="canvas" width={640} height={480}  />
        </div>
    }
    // QQ
}


export default Tetris;
