// server.js
// start the express server with the appropriate routes for our webhook and web requests
// With this setup, the webhook URL you’ll need later is https://\<yoururl.com>/alchemyhook

var app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .post('/alchemyhook', (req, res) => { notificationReceived(req); res.status(200).end() })
  .get('/*', (req, res) => res.sendFile('/index.html'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

// notification received from Alchemy from the webhook. Let the clients know.
function notificationReceived(req) {
    console.log("notification received!"); 
    io.emit('notification', JSON.stringify(req.body));
  }

// start the websocket server
const io = socketIO(app);

// listen for client connections/calls on the WebSocket server
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
    socket.on('register address', (msg) => {
      //send address to Alchemy to add to notification
      addAddress(msg);
    });
  });

// add an address to a notification in Alchemy
// Be sure to replace with your auth token found on the Alchemy Dashboard. The webhook_id here is a unique ID provided by Alchemy when we create the webhook in the next step.
async function addAddress(new_address) {
    console.log("adding address " + new_address);
    const body = { webhook_id: <your alchemy webhook id>, addresses_to_add: [new_address], addresses_to_remove: [] };
    try {
      fetch('https://dashboard.alchemyapi.io/api/update-webhook-addresses', {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        headers: { 'X-Alchemy-Token': <your alchemy token> }
      })
        .then(res => res.json())
        .then(json => console.log(json));
    }
    catch (err) {
      console.error(err);
    }
  }

  <script>
    // connect to WebSocket server and start listening for notifications
    let socket = io();
    let el;
    socket.on('notification', (notificationBody) => {
      console.log("got notification");
      el = document.getElementById('server-notification');
      el.innerHTML = 'Look what just happened!: ' + notificationBody;
    });
  </script>

  enableNotificationsButton.addEventListener('click', function (e) {
      e.preventDefault();
      console.log("send address");
      if (showAccount.innerHTML) {
        socket.emit('register address', showAccount.innerHTML);
      }
      alert(showAccount.innerHTML + " added to notifications.")
    });