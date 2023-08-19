class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            chatMessages: document.querySelector('.chatbox__messages')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox) {
        const textField = chatbox.querySelector('input');
        const userMessage = textField.value.trim();
        
        if (userMessage === "") {
            return;
        }
    
        const chatMessages = this.args.chatMessages;
        const sendButton = chatbox.querySelector('.send__button');
        
        //Add the user's message to the chatbox instantly
        // const userMessageHTML = '<div class="messages__item messages__item--visitor">' + userMessage + '</div>';
        // chatMessages.insertAdjacentHTML('beforeend', userMessageHTML);
        
        const msg1 = { name: "User", message: userMessage };
        this.messages.push(msg1);
        this.updateChatText(chatbox);

        // Scroll to the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;

        sendButton.disabled = true;
        sendButton.textContent = "Sending...";
    
        fetch('https://ebot.onrender.com/predict', {
            method: 'POST',
            body: JSON.stringify({ message: userMessage }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            let responseMessage = r.answer;
    
            //const msg1 = { name: "User", message: userMessage };
            const msg2 = { name: "Sam", message: responseMessage };
    
            // Push the new messages and update the chat text
            //this.messages.push(msg1);
            this.messages.push(msg2);
            this.updateChatText(chatbox);
    
            textField.value = '';
            sendButton.disabled = false;
            sendButton.textContent = "Send";
    
            // Scroll to the latest message
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch((error) => {
            console.error('Error:', error);
            sendButton.disabled = false;
            sendButton.textContent = "Send";
        });
    }
    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function (item, index) {
            if (item.name === "Sam") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        const chatMessages = this.args.chatMessages;
        chatMessages.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();
