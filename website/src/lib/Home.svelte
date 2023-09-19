<script lang="ts">
  let action = ''; // Default to registration
  let username = '';
  let email = '';
  let password = '';
  let isLoggedIn = false;

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = { username, email, password };

    let url = 'http://localhost:3000/users';
    let method = 'POST'; // Default to POST for registration

    if (action === 'login') {
      url = `http://localhost:3000/user/${username}`;
      method = 'GET'; // Use GET for login
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method === 'POST' ? JSON.stringify(formData) : undefined, // Only include a body for POST requests
      });

    
      if (response.ok) {
        if (action === 'login') {
          // Set isLoggedIn to true upon successful login
          isLoggedIn = true;
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

  function handleBack() {
    action = ''; // Reset the action to empty when going back
  }

  // Get the list of rooms
  // Add a variable to store the list of rooms
  let rooms = [];

  // Fetch the list of rooms when the page loads
  async function fetchRooms() {
    try {
      const response = await fetch('http://localhost:3000/rooms');
      if (response.ok) {
        rooms = await response.json();
      } else {
        console.error('Error fetching rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }

  // Call the fetchRooms function to load the list of rooms
  fetchRooms();


  // Create new room
  // Add a variable to store the name of the new room
  let newRoomName = '';

  async function handleCreateRoom(event) {
  event.preventDefault();

  try {
    const response = await fetch('http://localhost:3000/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Uid: newRoomName }),
    });

    refreshRooms();

  } catch (error) {
    console.error('Error creating a room:', error);
  }
}

async function refreshRooms() {
  try {
    const response = await fetch('http://localhost:3000/rooms');
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
      <button class="margin-right" on:click={handleBack}>Back</button>
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
            <li>{room.Uid}</li>
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