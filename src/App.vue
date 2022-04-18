<template>
  <app-alert :alert="alert" @close="alert = null"></app-alert>
  <div class="container">
    <div class="wrapper">
      <div class="messengerWindow">
        <div class="overflow">
          <app-loader v-if="loading"></app-loader>
          <app-people-list
            v-else
            :people="people"
            @load="loadPeople"
            @remove="removePerson"
          ></app-people-list>
        </div>
        <div class="personMessage">
          <form
            class="form-control inline form-control-message"
            @submit.prevent="createPerson"
          >
            <!-- <label  for="name">Сообщение</label> -->
            <input
              class="inputForMessage"
              type="text"
              id="message"
              v-model.trim="message"
              minlength="5"
            />
            <button class="btn-send" @click="$emit('load')">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.0187 10.2213L1.76874 0.596256C1.61786 0.520801 1.44839 0.490569 1.28073 0.509197C1.11307 0.527826 0.954373 0.594523 0.82374 0.701255C0.698987 0.805812 0.605871 0.943094 0.554861 1.09767C0.503851 1.25224 0.49697 1.41798 0.53499 1.57626L3.12499 11L0.49999 20.3975C0.464314 20.5297 0.460149 20.6684 0.487832 20.8025C0.515514 20.9365 0.574272 21.0622 0.65938 21.1695C0.744487 21.2767 0.85357 21.3625 0.977857 21.4199C1.10214 21.4773 1.23817 21.5047 1.37499 21.5C1.51197 21.4992 1.64683 21.4662 1.76874 21.4038L21.0187 11.7788C21.1621 11.7053 21.2824 11.5938 21.3663 11.4564C21.4503 11.319 21.4948 11.161 21.4948 11C21.4948 10.839 21.4503 10.681 21.3663 10.5436C21.2824 10.4062 21.1621 10.2947 21.0187 10.2213ZM2.73124 18.9713L4.66499 11.875H12.75V10.125H4.66499L2.73124 3.02876L18.665 11L2.73124 18.9713Z"
                  fill="#0047FF"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
      <!-- messenger-windows-->
    </div>
    <!-- wrapper -->
    <div class="login-window">
      <form class="card">
        <h2>Ваш Login - {{ name }}</h2>

        <div class="form-control">
          <label for="name">Введите логин</label>
          <input
            max-length="14"
            class="inputForMessage"
            type="text"
            id="name"
            v-model.trim="name"
          />
        </div>

        <!-- <button class="btn primary" :disabled="name.length === 0">
        Создать человека
      </button> -->
      </form>
    </div>
    <!-- login wirndow-->
  </div>
</template>

<script>
import AppPeopleList from "./AppPeopleList";
import AppAlert from "./AppAlert";
import AppLoader from "./AppLoader";
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      people: [],
      message: "",
      time: "",
      alert: null,
      loading: false,
    };
  },
  mounted() {
    this.loadPeople();
  },
  methods: {
    async createPerson() {
      let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes(),
        currentTime = "";
      // выполним форматирование времени с использованием тернарного оператора
      minute = minute < 10 ? "0" + minute : minute;
      hour = hour < 10 ? "0" + hour : hour;
      currentTime += hour + ":" + minute;

      this.time = currentTime; // HH:MM
      const response = await fetch(
        "https://test-task-3e05a-default-rtdb.firebaseio.com/people.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: this.name,
            message: this.$CryptoJS.AES.encrypt(
              this.message,
              "Secret Passphrase"
            ).toString(),

            time: this.time,
          }),
        }
      );

      const firebaseData = await response.json();

      this.people.push({
        firstName: this.name,
        id: firebaseData.name,
        message: this.message,
        time: this.time,
      });

      this.name = "";
      this.message = "";
      this.time = "";
    },
    // decrypt(data) {
    //   console.log(
    //     this.$CryptoJS.AES.decrypt(data, "Secret Passphrase").toString(
    //       this.CryptoJS.enc.Utf8
    //     )
    //   );
    // },
    loadPeople() {
      this.loading = true;
      setTimeout(async () => {
        try {
          const { data } = await axios.get(
            "https://test-task-3e05a-default-rtdb.firebaseio.com//people.json"
          );
          if (!data) {
            throw new Error("Список людей пуст");
          }

          this.people = Object.keys(data).map((key) => {

            return {
              id: key,
              firstName: data[key].firstName,
              message: data[key].message,
              time: data[key].time,
            };
          });
          this.loading = false;
        } catch (e) {
          this.alert = {
            type: "danger",
            title: "Ошибка!",
            text: e.message,
          };
          this.loading = false;
          console.log(e.message);
        }
      }, 1500);
    },
    async removePerson(id) {
      try {
        const name = this.people.find((person) => person.id === id).firstName;
        await axios.delete(
          `https://test-task-3e05a-default-rtdb.firebaseio.com/people/${id}.json`
        );
        this.people = this.people.filter((person) => person.id !== id);
        this.alert = {
          type: "primary",
          title: "Успешно!",
          text: `Пользователь с именем "${name}" был удален`,
        };
      } catch (e) {}
    },
  },
  components: { AppPeopleList, AppAlert, AppLoader },
};
</script>

<style>
</style>
