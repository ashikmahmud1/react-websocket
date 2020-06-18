import React, {Component} from "react";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

//    String plainCredentials = username + ":" + password;
//    String base64Credentials = Base64.getEncoder().encodeToString(plainCredentials.getBytes());
//    final WebSocketHttpHeaders headers = new WebSocketHttpHeaders();
//    headers.add("Authorization", "Basic " + base64Credentials);

class SocketConnection extends Component {

    serverUrl = 'http://95.216.199.251:8080/websocket/tracker';

    openGlobalSocket = () => {
        // subscribe all this three channel
        // name of the broker is topics
        // subscribe to the /topics/tokens/created
        this.stompClient.subscribe('/topics/tokens/created', (message) => {
          this.onTokenCreated(JSON.parse(message.body));
        });
        // subscribe to the /topics/tokens/updated
        this.stompClient.subscribe('/topics/tokens/updated', (message) => {
          this.onTokenUpdated(JSON.parse(message.body));
        });
        // subscribe to the /topics/tokens/deleted
        this.stompClient.subscribe('/topics/tokens/deleted', (message) => {
          this.onTokenDeleted(JSON.parse(message.body));
        });
        // subscribe to the /topics/tokens/reset
        this.stompClient.subscribe('/topics/tokens/reset', (message) => {
          this.onTokenReset(JSON.parse(message.body));
        });
      };

    initializeSocket = () => {
        const ws = new SockJS(this.serverUrl);
        this.stompClient = Stomp.over(ws);
        const self = this;
        this.stompClient.connect({}, function (frame) {
          self.openGlobalSocket();
        });
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
          <React.Fragment/>
        )
      }

}

export default SocketConnection;