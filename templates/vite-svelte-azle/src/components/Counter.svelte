<script lang="ts">
  import Modal from './Modal.svelte';
  import { backend } from '../declarations/backend/index.js';
  import { AuthClient } from '@dfinity/auth-client';
  import { Principal } from '@dfinity/principal';
  // import {Record, Principal} from 'azle';

  let authClientStore: AuthClient | null = null;

  let username: string;
  let principal: string;
  let haveUser: boolean = false;

  let showModal = false;
  let seeUsers = false;
  let userList = [];

  let toggleModal = () => {
    showModal = !showModal;
  };

  const login = async () => {
    const authClient = await AuthClient.create();
    const isLocalNetwork = process.env.DFX_NETWORK == 'local';
    const identityProviderUrl = isLocalNetwork
      ? `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`
      : 'https://identity.ic0.app/';

    authClient.login({
      identityProvider: identityProviderUrl,
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      onSuccess: async () => {
        authClientStore = authClient;
        const identity = await authClientStore.getIdentity();
        principal = identity.getPrincipal().toString();
        // console.log(principal);

        let userdata = await backend.getUserByPrincipal(
          Principal.fromText(principal),
        );
        // console.log(userdata);

        if (userdata) {
          username = userdata[0].username;
          haveUser = true;
        } else {
          haveUser = false;
        }
      },
    });
  };

  const seePrincipal = async () => {
    if (!authClientStore) {
      alert('You need to login first');
      return;
    } else {
      // console.log(`Your principal is: ${principal}`);
      toggleModal();
    }
  };

  // const register = async () => {
  //   console.log('anything');
  // };

  const saveUserData = async () => {
    await backend.setUser(principal, username);

    alert('User data saved');
    haveUser = true;
  };

  const showUsers =async () => {
    userList = await backend.getValues();
    seeUsers = !seeUsers;
    console.log(userList);
    
  }
</script>

<Modal {showModal} on:click={toggleModal}>
  <h2>Your Principal ID is</h2>
  <h3>{principal}</h3>
</Modal>

<div class="example">
  {#if !principal}
    <button on:click={login}> Login with Internet Identity </button>
  {:else}
    <button on:click={seePrincipal}> See my Principal ID </button>

    <div class="userInfo">
      {#if !haveUser}
        <h3>Save your information</h3>
      {/if}
      {#if haveUser}
        <h2>Welcome {username}</h2>
        <h3>Update your information</h3>
      {/if}
      <form on:submit|preventDefault={saveUserData}>
        <label for="username">User name</label>
        <input
          type="text"
          name="username"
          placeholder="Name"
          bind:value={username}
        />
        <button>Save Data</button>
      </form>
    </div>

    {#if !seeUsers && haveUser}
      <button on:click={showUsers}>See all the users</button>
    {:else if seeUsers && haveUser}
    <div>
      <ul>
        {#each userList as user}
        <li><b>{user.username}:</b> {user.id.toString()}</li>
        {/each}
      </ul>
    </div>
    {/if}
    <div>

    </div>
  {/if}
</div>

<style>
  button {
    border: 1px solid black;
  }
  .userInfo {
    border: 1px solid black;
    border-radius: 15px;
    padding: 1rem;
    margin: 1rem;
    background-color: rgb(182, 177, 177);
  }
</style>
