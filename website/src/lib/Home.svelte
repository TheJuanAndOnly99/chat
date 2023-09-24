<script lang="ts">
  import Cookies from 'js-cookie';
  import io from 'socket.io-client';
  import { onMount } from 'svelte';

  let action: string = ''; // Default to registration
  let username: string = ''; // Store the username
  let userIdNum = ''; // Store the user ID
  let email: string = ''; // Store the email
  let password: string = ''; // Store the password
  let isLoggedIn: boolean = false; // Store the logged in status
  let newRoomName = ''; // Store the new room name
  let rooms: { id: number, name: string }[] = []; // Store the list of rooms
  let roomIdNum = ''; // Store the room ID
  let selectedRoom: string | null = null; // Store the selected room
  let messages: { text: string, userId: string }[] = []; // Store messages for the room
  let newMessage: string | null = ''; // Store the new message text
  let jwt: string | undefined = ''; // Store the JWT
  const serverUrl = import.meta.env.SERVER_URL;
  const socket = io(serverUrl)

   // Emit a chat message to the server
  async function sendChatMessage(text: string | null) {
    socket.emit('chatMessage', { text });
  }

  // Listen for incoming chat messages from the server
  socket.on('chatMessage', (message) => {
    console.log('Received message from server:', message);
    messages = [...messages, { text: message.text, userId: message.userId }];
  });

  // Fetch the list of rooms when the component mounts
  onMount(() => {
    fetchRooms();
  });

  // Handle registration and login
  async function handleSubmit(event: Event) {
    event.preventDefault();

    const formData = { username, email, password };

    let url = `${serverUrl}/users`;
    let method = 'POST'; // Default to POST for registration
    let body = JSON.stringify(formData);

    if (action === 'login') {
      url = `${serverUrl}/login/`;
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
  }

  // Fetch the list of rooms when the page loads
  async function fetchRooms() {
    try {
      const response = await fetch('http://127.0.0.1:3000/rooms');
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
      const response = await fetch('http://127.0.0.1:3000/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        
        },
        body: JSON.stringify({ name: newRoomName }),
      });

      refreshRooms();

    } catch (error) {
      console.error('Error creating a room:', error);
    }
  }

  // Add a function to refresh the list of rooms
  async function refreshRooms() {
    try {
      const response = await fetch('http://127.0.0.1:3000/rooms');
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
      const response = await fetch(`http://127.0.0.1:3000/user/${username}`);
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
      const response = await fetch(`http://127.0.0.1:3000/room/${roomId}`);
      if (response.ok) {
        const roomData = await response.json();
        const roomId = roomData._id;

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
      const response = await fetch(`http://127.0.0.1:3000/rooms/${roomId}/user/${userId}`, {
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
      const response = await fetch(`http://127.0.0.1:3000/room/${roomId}/messages`);
      if (response.ok) {
        const messageData = await response.json();

        // for each message in messageData, fetch the message text
        for (const message of messageData) {
          const messageData = await fetchMessageData(message);

          // Add the message text to the messages array
          messages = [...messages, { text: messageData.text, userId: messageData.userId }];

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
      const response = await fetch(`http://127.0.0.1:3000/messages/${messageId}`);
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

  function setMessage(event: Event) {
    event.preventDefault();
    newMessage = event.target[0].value;
    console.log(`New message: ${newMessage}`);
    createMessage(newMessage);

    // Send the message to the server
    sendChatMessage(newMessage);
  }

  function refreshMessages() {
    messages = [];
    fetchMessages(selectedRoom);
  }

  // Get latest message
  async function getLatestMessage() {
    const messagesResponse = await fetch(`http://127.0.0.1:3000/messages`);
    const messagesData = await messagesResponse.json();
    const messageId = messagesData[messagesData.length - 1]._id;
    return messageId;
  }

  // Create a message
  async function createMessage(newMessage: string | null) {
    jwt = Cookies.get('jwt');
    try {
      const response = await fetch(`http://127.0.0.1:3000/messages`, {
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
      const response = await fetch(`http://127.0.0.1:3000/rooms/${roomId}/message/${messageId}`, {
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

  function goBack() {
    selectedRoom = null;
  }

</script>

<div class="container buttonContainer">
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

    <div class="container buttonContainer">
      <button class="margin-right" on:click={handleBackLogin}>Back</button>
      <button type="submit">{action === 'register' ? 'Register' : 'Login'}</button>
    </div>
      
  </form>
  {/if}
{/if}

{#if isLoggedIn}
  <div class="chat-room">
    <div>
      <div>
        <h2>Chat Room</h2>
        <p>Logged in as {username}</p>
        <button on:click={() => isLoggedIn = false}>Logout</button>
      </div>
      <div>
        <h3>Select Chat Room</h3>
        <ul>
          {#each rooms as room}
            <li>
              {room.name} 
              <button on:click={() => {
                fetchRoomId(room.name); // Fetch room ID and pass 'roomId' as a parameter
              }}>
                Join
              </button>
            </li>
          {/each}
        </ul>
        <h4>Create New Room</h4>
        <form on:submit={handleCreateRoom}>
          <input type="text" placeholder="Room Name" bind:value={newRoomName} />
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  </div>
{/if}

{#if selectedRoom !== null }
  <div class="chat-room">
    <div>
      <h2>Chat Room</h2>
      <ul>
        {#each messages as message}
          <li>{message.userId}: {message.text}</li>
        {/each}
      </ul>
      <form on:submit={setMessage}>
        <input type="text" placeholder="Type your message" bind:value={newMessage} />
        <button class="margin-right" on:click={handleBackRoom}>Leave Room</button>
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
{:else}
  <p></p>
{/if}

<style>
  .container {
    margin: 1em;
  }

  form{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  input{
    margin-bottom: 1em;
  }

  .buttonContainer{
    display: flex;
    justify-content: space-around;
  }

  .margin-right{
    margin-right: 1em;
  }

</style>