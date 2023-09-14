<script>
  let action = 'register'; // Default to registration
  let username = '';
  let email = '';
  let password = '';

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = { username, email, password };

    try {
      let url = 'http://localhost:3000/users'

      if (action === 'login') {
        url = 'http://localhost:3000/login';
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registration successful, you can redirect or show a success message
        console.log('User registered successfully');
      } else {
        // Registration failed, handle errors
        console.error('User registration failed');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }
</script>

<div class="container registerLoginContainer">
  <button on:click={() => action = 'register'}>Register</button>
  <button on:click={() => action = 'login'}>Login</button>
</div>

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

  <div class="buttonContainer">
    <button type="submit">{action === 'register' ? 'Register' : 'Login'}</button>
  </div>
    
</form>

<style>
  .container {
    margin: 1em;
  }

  .registerLoginContainer{
    display: flex;
    justify-content: space-around;
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
    justify-content: center;
  }

</style>