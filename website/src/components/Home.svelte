<script lang="ts">
  import Cookies from 'js-cookie';
  import io from 'socket.io-client';
  import { onMount } from 'svelte';

  let action: string = ''; // Default to registration
  let username: string = ''; // Store the username
  let userIdNum: string = ''; // Store the user ID
  let email: string = ''; // Store the email
  let password: string = ''; // Store the password
  let isLoggedIn: boolean = false; // Store the logged in status
  let newRoomName: string = ''; // Store the new room name
  let rooms: { id: number, name: string }[] = []; // Store the list of rooms
  let roomName: string = ''; // Store the room Name
  let roomIdNum: string = ''; // Store the room ID
  let selectedRoom: string | null = null; // Store the selected room
  let messages: { text: string, userId: string, createdAt: string }[] = []; // Store messages for the room
  let newMessage: string | null = ''; // Store the new message text
  let jwt: string | undefined = ''; // Store the JWT
  
  const SERVER_URL = "http://127.0.0.1:3000"
  const socket = io(SERVER_URL)

  // Fetch the list of rooms when the component mounts
  onMount(() => {
    fetchRooms();
  });

  // Handle registration and login
  async function handleSubmit(event: Event) {
    event.preventDefault();

    const formData = { username, email, password };

    let url = `${SERVER_URL}/users`;
    let method = 'POST'; // Default to POST for registration
    let body = JSON.stringify(formData);

    if (action === 'login') {
      url = `${SERVER_URL}/login`;
      console.log(url);
      body = JSON.stringify({ username });
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
        credentials: 'include',
      });

    
      if (response.ok) {
        if (action === 'login') {
          // Set isLoggedIn to true upon successful login
          isLoggedIn = true;
          jwt = Cookies.get('jwt');
          username = formData.username;
        } else {
          // Show a success message for registration
          console.log('User registered successfully');
        }
      } else {
        // Registration failed, handle errors
        console.error('Registration or login failed');
      }
    } catch (error) {
      console.error('Error registering or logging in:', error);
    }
  }

  // Handle going back to the login/registration screen
  function handleBackLogin() {
    action = ''; // Reset the action to empty when going back
  }

  // Handle going back to the room selection screen
  function handleBackRoom() {
    selectedRoom = null; // Reset the selected room to null when going back
    
    // remove user from room
    removeUserFromRoom(roomIdNum, userIdNum);
  }

  // Remove user from room
  async function removeUserFromRoom(roomId: string, userId: string) {
    try {
      const response = await fetch(`${SERVER_URL}/rooms/${roomId}/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'credentials': 'include',
        },
        // You may need to include some user information in the request body
        body: JSON.stringify({ userId: userId }), // Replace userId with the actual user ID
      });

      if (response.ok) {
        // Handle a successful leave, e.g., show a message or update the UI
        console.log(`Left room ${roomId}`);
      } else {
        // Handle errors if the leave request fails
        console.error('Error leaving the room');
      }
    } catch (error) {
      console.error('Error leaving the room:', error);
    }
  }

  // Fetch the list of rooms when the page loads
  async function fetchRooms() {
    try {
      const response = await fetch(`${SERVER_URL}/rooms`);
      if (response.ok) {
        rooms = await response.json();
      } else {
        console.error('Error fetching rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }

  async function handleCreateRoom(event: Event) {
    event.preventDefault();
    jwt = Cookies.get('jwt');

    try {
      const response = await fetch(`${SERVER_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        
        },
        body: JSON.stringify({ name: newRoomName }),
      });
      console.log("before refresh")
      refreshRooms();
      console.log("after refresh")

    } catch (error) {
      console.error('Error creating a room:', error);
    }
  }

  // Add a function to refresh the list of rooms
  async function refreshRooms() {
    try {
      const response = await fetch(`${SERVER_URL}/rooms`);
      if (response.status === 200) {
        const roomsData = await response.json();
        
        // Update the rooms list with the new data
        rooms = roomsData;
        newRoomName = ''; // Clear the input field
      } else {
        console.error('Error fetching rooms:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }

  // Get user _id from the DB
  async function fetchUserId() {
    try {
      const response = await fetch(`${SERVER_URL}/user/${username}`);
      if (response.ok) {
        const userData = await response.json();
        const userId = userData._id;

        userIdNum = userId;
        console.log('User ID:', userId)

        return userId;
      } else {
        console.error('Error fetching user ID');
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  }

  // Get room _id from the DB
  async function fetchRoomId(roomId: string) {
  try {
    const userId = await fetchUserId();
    if (userId) {
      const response = await fetch(`${SERVER_URL}/room/${roomId}`);
      if (response.ok) {
        const roomData = await response.json();
        const roomId = roomData._id;
        
        roomName = roomData.name;
        roomIdNum = roomId;

        console.log('Room ID:', roomId);
        
        joinRoom(roomId, userId); 
        fetchMessages(roomId);
      } else {
        console.error('Error fetching room ID');
      }
    } else {
      console.error('User ID not available.');
    }
  } catch (error) {
    console.error('Error fetching room ID:', error);
  }
}

  // Join a room
  async function joinRoom(roomId: string, userId: string) {
    try {
      // Send a request to the server to add the user to the selected room
      const response = await fetch(`${SERVER_URL}/rooms/${roomId}/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'credentials': 'include',
        },
        // You may need to include some user information in the request body
        body: JSON.stringify({ userId: userId }), // Replace userId with the actual user ID
      });

      if (response.ok) {
        // Handle a successful join, e.g., show a message or update the UI
        console.log(`Joined room ${roomId}`);
        selectRoom(roomId);
        messages = [];
        fetchMessages(selectedRoom);
      } else {
        // Handle errors if the join request fails
        console.error('Error joining the room');
      }
    } catch (error) {
      console.error('Error joining the room:', error);
    }
  }

  // Select a room
  function selectRoom(roomName: string) {
    selectedRoom = roomName; // Assign a room name to selectedRoom
  }

  // Fetch messages
  async function fetchMessages(roomId: string | null) {
    try {
      const response = await fetch(`${SERVER_URL}/room/${roomId}/messages`);
      if (response.ok) {
        const messageData = await response.json();

        // for each message in messageData, fetch the message text
        for (const message of messageData) {
          const messageData = await fetchMessageData(message);

          // format createdAt date to be more readable
          const date = new Date(messageData.createdAt);
          const formattedDate = date.toLocaleString();

          // Add the message text to the messages array
          messages = [...messages, { text: messageData.text, userId: messageData.userId, createdAt: formattedDate }];

          for (const message of messages) {
            console.log(`Message: ${message.text}`);
          }
        }
      } else {
        console.error('Error fetching messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  // Fetch message text
  async function fetchMessageData(messageId: string) {
    try {
      const response = await fetch(`${SERVER_URL}/messages/${messageId}`);
      if (response.ok) {
        const messageData = await response.json();
    
        return messageData;
      } else {
        console.error('Error fetching message text');
      }
    } catch (error) {
      console.error('Error fetching message text:', error);
    }
  }

  function setMessage(event: Event | null) {
    event?.preventDefault();
    newMessage = event.target[0].value || '';
    console.log(`New message: ${newMessage}`);
    createMessage(newMessage);

    // Send the message to the server
    sendChatMessage(newMessage);
  }

  // Emit a chat message to the server
  async function sendChatMessage(text: string | null) {
    socket.emit('chatMessage', { text });
  }

  // Listen for incoming chat messages from the server
  socket.on('chatMessage', (message) => {
    console.log('Received message from server:', message);
    messages = [...messages, { text: message.text, userId: message.userId }];
  });

  function refreshMessages() {
    messages = [];
    fetchMessages(selectedRoom);
  }

  // Get latest message
  async function getLatestMessage() {
    const messagesResponse = await fetch(`${SERVER_URL}/messages`);
    const messagesData = await messagesResponse.json();
    const messageId = messagesData[messagesData.length - 1]._id;
    return messageId;
  }

  // Create a message
  async function createMessage(newMessage: string | null) {
    jwt = Cookies.get('jwt');
    try {
      const response = await fetch(`${SERVER_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({ text: newMessage, userId: username }),
      });

      if (response.ok) {
        console.log(response.body);
      } else {
        console.error('Error creating message');
      }

      const messageId = await getLatestMessage();

      addMessage(selectedRoom, messageId);

    } catch (error) {
      console.error('Error creating message:', error);
    }
  }

  async function addMessage(roomId: string | null, messageId: string) {
    console.log(`Message ID: ${messageId}`);
    console.log (`Room ID: ${roomId}`);
    jwt = Cookies.get('jwt');
    try {
      const response = await fetch(`${SERVER_URL}/rooms/${roomId}/message/${messageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
      });

      newMessage = '';
      refreshMessages();
      
    } catch (error) {
      console.error('Error adding message:', error);
    }
  }

</script>

<div class="container flex-space-around">
  {#if !isLoggedIn && action === ''}
    <button on:click={() => action = 'register'}>Register</button>
    <button on:click={() => action = 'login'}>Login</button>
  {/if}
</div>

{#if !isLoggedIn}
  {#if action === 'register' || action === 'login'}
  <form on:submit={handleSubmit}>
    {#if action === 'register'}
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" bind:value={email} />
      </div>
    {/if}

    <div>
      <label for="username">Username:</label>
      <input type="text" id="username" bind:value={username} />
    </div>

    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" bind:value={password} />
    </div>

    <div class="container flex-space-around">
      <button class="margin-right" on:click={handleBackLogin}>Back</button>
      <button type="submit">{action === 'register' ? 'Register' : 'Login'}</button>
    </div>
      
  </form>
  {/if}
{/if}

{#if isLoggedIn}
  <div class="chat-room">
    <div>
      <div class="flex-space-around border">
        <p>Logged in as {username}</p>
        <button on:click={() => isLoggedIn = false}>Logout</button>
      </div>
      <div class="flex flex-row">
        {#if selectedRoom === null}
          <div class="flex flex-row">
            <div class="border-right">
              <h3>Select Chat Room</h3>
              <ul>
                {#each rooms as room}
                  <li class="rooms-list">
                    {room.name} 
                    <button on:click={() => {
                      fetchRoomId(room.name); // Fetch room ID and pass 'roomId' as a parameter
                    }}>
                      Join Room
                    </button>
                  </li>
                {/each}
                <button class="margin-right margin-top" on:click={refreshRooms}>Refresh Rooms</button>
              </ul>
            </div>
            <div class="margin-left">
              <h3>Create New Room</h3>
              <form on:submit={handleCreateRoom}>
                <input type="text" placeholder="Room Name" bind:value={newRoomName} />
                <button type="submit">Create</button>
              </form>
            </div>
          </div>
        {:else}
          <p></p>
        {/if}  
        <div>
          {#if selectedRoom !== null }
            <div class="chat-room">
              <div class="flex-center flex-column border">
                <h3>Room: {roomName}</h3>
                <div class="chatbox">
                  <ul>
                    {#each messages as message}
                      <li class="messages-list">{message.userId}: {message.text} - {message.createdAt}</li>
                    {/each}
                  </ul>
                </div>
                <form on:submit={setMessage}>
                  <div class="flex-row send-message-container">
                    <input class="text-box" type="text" placeholder="Type your message" bind:value={newMessage} />
                    <button class="send-message-button" type="submit">Send</button>
                  </div>
                </form>
                <button on:click={handleBackRoom}>Leave Room</button>
              </div>
            </div>
          {:else}
            <p></p>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    margin: 1em;
  }

  .border {
    margin-bottom: 1em;
    border: 1px solid darkgrey;
    border-radius: 5px;
    box-shadow: 1px 1px 1px darkgrey;
    padding: 1em;
  }

  .border-right{
    border-right: 1px solid darkgrey;
  }

  form{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  input{
    margin-bottom: 1em;
  }
  .margin-right{
    margin-right: 1em;
  }

  .margin-top {
    margin-top: 1em;
  }

  .margin-left {
    margin-left: 1em;
  }

  .rooms-list{
    margin-bottom: .5em;
    list-style-type: none;
  }

  .messages-list{
    margin-bottom: .5em;
    list-style-type: none;
  }

  .flex {
    display: flex;
    justify-content: space-between;
  }

  .flex-space-around {
    display: flex;
    justify-content: space-around;
  }

  .flex-center {
    display: flex;
    justify-content: center;
  }

  .flex-row {
    display:flex;
    flex-direction: row;
  }

  .flex-column {
    display:flex;
    flex-direction: column;
  }

  .text-box {
    width: -webkit-fill-available;
    height: 3em;
  }

  .chatbox {
    width: 500px;
    height: 250px;
    overflow: scroll;
    display: flex;
    flex-direction: column-reverse;
  }

  .send-message-container {
    width: 500px;
  }

  .send-message-button {
    margin-left: 1em;
    height: 3em;
  }


</style>