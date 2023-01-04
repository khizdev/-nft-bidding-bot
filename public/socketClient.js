const socket = io.connect('http://localhost:4000');
// const socket = io.connect('https://pkeepserver.theellipsis.exchange');

let pair = 'ETH/BTC';

/************** Test Emit & On **************/
socket.emit('hello', pair);
socket.on('hello', data => console.log('*******hello back = ', data));

socket.emit('getNFTdata', pair);
socket.on('getNFTdata', data => console.log('*******NFT BACK = ', data));
