import React, {Component} from "react";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import jwt from 'jsonwebtoken';

class SocketConnection extends Component {
    serverUrl = 'http://95.216.199.251:8080/websocket/tracker';
    BASE_URL = 'http://95.216.199.251:8080'

    openGlobalSocket = () => {
        // subscribe all this three channel
        // name of the broker is CH2
        // subscribe to the /CH2/invoice/created
        this.stompClient.subscribe('/CH2/invoice/created', (message) => {
            console.log('invoice created');
            console.log(JSON.parse(message.body));
        });
        // subscribe to the /CH2/invoice/updated
        this.stompClient.subscribe('/CH2/invoice/updated', (message) => {
            console.log('invoice updated');
            console.log(JSON.parse(message.body));
        });
    };

    initializeSocket = () => {
        const token = localStorage.getItem("id_token");
        // parse the JSON web token
        let decoded_token = jwt.decode(token); // decoded_token.exp = 1595047402
        let current_time = parseInt(Date.now().toString().substr(0, 10)); // 1592529176400
        if (token && decoded_token.exp && decoded_token.exp > current_time) {
            this.serverUrl += '?access_token=' + token;
            const ws = new SockJS(this.serverUrl);
            this.stompClient = Stomp.over(ws);
            const self = this;
            this.stompClient.connect({}, function (frame) {
                self.openGlobalSocket();
            });
        } else {
            window.alert('Token expired!');
        }
    };

    login = () => {
        fetch('/api/authenticate',
            {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "password": "admin",
                    "rememberMe": true,
                    "username": "admin"
                })
            }).then(res => res.json())
            .then(data => localStorage.setItem("id_token", data.id_token));
    }

    componentDidMount() {
        this.login();
        this.initializeSocket();
    }

    componentWillUnmount() {
        // close the socket connection
        this.stompClient.disconnect()
    }

    onCreatedInvoice = () => {
        const invoice = {
            messageType: "invoice_created",
            targetedDevices: [
                "A1",
                "A2"
            ],
            fullInvoiceDetails: [],
            invoice: {}
        }
        this.stompClient.send("/CH2/invoice-created", {}, JSON.stringify(invoice))
    }

    onUpdatedInvoice = () => {
        const invoice = {
            messageType: "invoice_updated",
            targetedDevices: [
                "A1",
                "A2",
                "A3",
                "A4",
            ],
            fullInvoiceDetails: [],
            invoice: {}
        }
        this.stompClient.send("/CH2/invoice-updated", {}, JSON.stringify(invoice))
    }

    render() {
        return (
            <React.Fragment>
                <button type="button" onClick={this.onCreatedInvoice}>Create Invoice</button>
                <button type="button" onClick={this.onUpdatedInvoice}>Update Invoice</button>
            </React.Fragment>
        )
    }

}

export default SocketConnection;