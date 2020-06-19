import React, { Component } from "react";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import jwt from 'jsonwebtoken';

class SocketConnection extends Component {

    serverUrl = 'http://95.216.199.251:8080/websocket/tracker';

    openGlobalSocket = () => {
        // subscribe all this three channel
        // name of the broker is CH2
        // subscribe to the /CH2/tokens/created
        this.stompClient.subscribe('/CH2/tokens/created', (message) => {
            console.log(JSON.parse(message.body));
        });
        // subscribe to the /CH2/tokens/updated
        this.stompClient.subscribe('/CH2/tokens/updated', (message) => {
            console.log(JSON.parse(message.body));
        });
        // subscribe to the /CH2/tokens/deleted
        this.stompClient.subscribe('/CH2/tokens/deleted', (message) => {
            console.log(JSON.parse(message.body));
        });
        // subscribe to the /CH2/tokens/reset
        this.stompClient.subscribe('/CH2/tokens/reset', (message) => {
            console.log(JSON.parse(message.body));
        });
    };

    initializeSocket = () => {
        const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTU5NTA0NzQwMn0.-gLpwpBv061aCniKIVhWaQ7fVd3in-vuuSz8_cSX1o_KnbPc_MdQfXpOpefj_cW7lAvWhOijLHBIV8dH7uGCNA";
        // parse the JSON web token
        let decoded_token = jwt.decode(token); // decoded_token.exp = 1595047402
        let current_time = parseInt(Date.now().toString().substr(0,10)); // 1592529176400
        if (token && decoded_token.exp && decoded_token.exp > current_time) {
            this.serverUrl += '?access_token=' + token;
            const ws = new SockJS(this.serverUrl);
            this.stompClient = Stomp.over(ws);
            const self = this;
            this.stompClient.connect({}, function (frame) {
                self.openGlobalSocket();
            });
        } else{
            window.alert('Token expired!');
        }
    };

    componentDidMount() {
        this.initializeSocket();
    }

    componentWillUnmount() {
        // close the socket connection
        this.stompClient.disconnect()
    }

    render() {
        return (
            <React.Fragment />
        )
    }

}

export default SocketConnection;