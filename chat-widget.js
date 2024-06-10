(function () {
  const widgetHtml = `
        <div id="chat-widget">
            <div id="chat-header">
                <h3>Чат с нас</h3>
            </div>
            <div id="chat-body">
                <div id="messages"></div>
            </div>
            <div id="chat-footer">
                <input type="text" id="chat-input" placeholder="Напишете съобщение...">
                <button id="send-btn">Изпрати</button>
            </div>
        </div>
    `;

  const widgetStyles = `
        body {
            font-family: Arial, sans-serif;
        }
        #chat-widget {
            width: 300px;
            border: 1px solid #ccc;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #fff;
            z-index: 1000;
        }
        #chat-header {
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            text-align: center;
        }
        #chat-body {
            max-height: 400px;
            overflow-y: auto;
            padding: 10px;
        }
        #messages {
            display: flex;
            flex-direction: column;
        }
        .message {
            margin: 5px 0;
        }
        .user-message {
            align-self: flex-end;
            background-color: #DCF8C6;
            padding: 10px;
            border-radius: 10px;
        }
        .bot-message {
            align-self: flex-start;
            background-color: #eee;
            padding: 10px;
            border-radius: 10px;
        }
        #chat-footer {
            display: flex;
            padding: 10px;
            background-color: #f1f1f1;
        }
        #chat-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        #send-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            margin-left: 10px;
            cursor: pointer;
            border-radius: 5px;
        }
        #send-btn:hover {
            background-color: #45a049;
        }
    `;

  function addStyles(styles) {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }

  function addWidget() {
    const widgetContainer = document.createElement('div');
    widgetContainer.innerHTML = widgetHtml;
    document.body.appendChild(widgetContainer);

    document.getElementById('send-btn').addEventListener('click', sendMessage);
  }

  function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value;
    if (message.trim() !== '') {
      displayMessage(message, 'user');
      input.value = '';
      getResponse(message);
    }
  }

  function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className =
      sender === 'user' ? 'message user-message' : 'message bot-message';
    messageElement.textContent = message;
    document.getElementById('messages').appendChild(messageElement);
    document.getElementById('chat-body').scrollTop =
      document.getElementById('chat-body').scrollHeight;
  }

  async function getResponse(message) {
    displayMessage('Typing...', 'bot');
    try {
      const response = await fetch('https://YOUR_BACKEND_URL/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      });
      const data = await response.json();
      document.querySelector('.bot-message:last-child').remove();
      displayMessage(data.response, 'bot');
    } catch (error) {
      console.error('Error:', error);
      document.querySelector('.bot-message:last-child').remove();
      displayMessage('Извинете, възникна проблем. Опитайте отново.', 'bot');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    addStyles(widgetStyles);
    addWidget();
  });
})();
