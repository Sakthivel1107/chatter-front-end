import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectSocket = (
    userId,
    onMessageReceived,
    addContact,
    onChat,
    offChat,
    onStatusChanged,
    updateMsg,
    addMsg,
    updatedMsg,
    deleteForMeSender,
    deleteForMeReceiver,
    updateContact
) => {
    if (stompClient?.active) {
        return;
    }

    stompClient = new Client({
        brokerURL: "wss://chatter-back-end-api.onrender.com/ws",
        reconnectDelay: 5000,
        connectHeaders: {
            id: userId
        }
    });

    stompClient.onConnect = () => {

        stompClient.subscribe(
            `/queue/${userId}`,
            message => {
                const event = JSON.parse(message.body);
                switch(event.type){
                    case "MESSAGE":
                        onMessageReceived?.(
                            event.data
                        );
                        break;
                    case "SEEN":
                        onChat(event.data);
                        break;
                    case "UNSEEN":
                        offChat(event.data);
                        break;
                    case "LOAD":
                        addContact(event.data);
                        break;
                    case "UPDATE":
                        updateMsg(event.data);
                        break;
                    case "CREATED":
                        addMsg(event.data);
                        break;
                    case "UPDATED":
                        updatedMsg(event.data);
                        break;
                    case "DELETEFOREVERYONE":
                        updateMsg(event.data);
                        break;
                    case "DELETEDFOREVERYONE":
                        updatedMsg(event.data);
                        break;
                    case "DELETEDFORMEFROMSENDER":
                        deleteForMeSender(event.data);
                        break;
                    case "DELETEDFORMEFROMRECEIVER":
                        deleteForMeReceiver(event.data);
                        break;
                    case "USERUPDATE":
                        updateContact(event.data);
                        break;
                }
            }
        );

        stompClient.subscribe(
            "/topic/status",
            message => {

                const status =
                        JSON.parse(
                                message.body
                        );
                onStatusChanged?.(
                        status
                );
            }
        );
    };

    stompClient.activate();
};

export const stompDisconnect = () => {

    if (stompClient) {

        stompClient.deactivate();

        stompClient = null;
    }
};
export const sendMessage = (message) => {
    if(stompClient)
    stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify(message),
    });
};
export const updateMessage = (message) => {
    if(stompClient)
    stompClient.publish({
        destination: "/app/update",
        body: JSON.stringify(message),
    });
};
export const sendChatStatus = (ids) => {
    if(stompClient)
    stompClient.publish(
        {
            destination: "/app/seen",
            body: JSON.stringify(ids)
        }
    );
}
export const sendChatOffStatus = (ids) => {
    if(stompClient)
    stompClient.publish(
        {
            destination: "/app/off",
            body: JSON.stringify(ids)
        }
    );
}
export const deleteForEveryone = (id) => {
    if(stompClient)
    stompClient.publish(
        {
            destination: "/app/deleteForEveryone",
            body: id
        }
    );
}

export const deleteForMeFromSender = (id) => {
    if(stompClient)
    stompClient.publish(
        {
            destination: "/app/deleteForMeFromSender",
            body: id
        }
    );
}

export const deleteForMeFromReceiver = (id) => {
    if(stompClient)
        stompClient.publish(
        {
            destination: "/app/deleteForMeFromReceiver",
            body: id
        }
    );
}