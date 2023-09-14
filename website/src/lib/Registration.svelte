<script lang="ts">
  let action = ''; // Default to registration
  let username = '';
  let email = '';
  let password = '';

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
        // Registration successful, you can redirect or show a success message
        const message = action === 'login' ? 'Login successful' : 'User registered successfully';
        console.log(message);
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
</script>

<div class="container buttonContainer">
  {#if action === ''}
    <button on:click={() => action = 'register'}>Register</button>
    <button on:click={() => action = 'login'}>Login</button>
  {/if}
</div>

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