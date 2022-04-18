<template>
  <div v-if="people.length !== 0">
    <div class="card" v-for="person in people" :key="person.id">
      <div class="personLogin">{{ person.firstName }}</div>
      <div class="container-complete-mes">
      <div class="container-message">
        <div class="message">
          {{ $CryptoJS.AES.decrypt(person.message, "Secret Passphrase").toString().length > 1 ? $CryptoJS.AES.decrypt(person.message, "Secret Passphrase").toString() :person.message }}
        </div>
        <small class="person-time">{{ person.time }}</small>
      </div>
      <!-- container-message -->
      
      <button class="btn-cross" @click="$emit('remove', person.id)">
        <svg version="1.1"  xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 490 490" style="enable-background:new 0 0 490 490;" xml:space="preserve">
<polygon points="11.387,490 245,255.832 478.613,490 489.439,479.174 255.809,244.996 489.439,10.811 478.613,0 245,234.161 
	11.387,0 0.561,10.811 234.191,244.996 0.561,479.174 "/>
<g></g>
<g></g>
<g></g>
<g></g>
<g></g>
<g></g>
<g></g>
<g></g>
<g></g>
<g></g>
<g></g>
<g></g>
<g></g>
<g></g>
<g></g>
</svg>

      </button> 
      </div><!-- container-complete-mes -->
    </div>
    <!-- card -->
  </div>
  <div class="card center" v-else>
    <h4>Сообщений пока нет.</h4>
    <!--<button class="btn" @click="$emit('load')">Загрузить сообщения</button>-->
  </div>
</template>

<script>
export default {
  emits: ["load", "remove"],
  props: ["people"],
};
</script>

<style scoped>
.container-complete-mes {
  display:flex;
  
}
.personLogin {
  width: 300px;
}
.btn-cross {
  width:25px;
  height:25px;
  border:0px;
  background-color:#fff;
}
.container-message {
  display: flex;
  align-items: center;
  background-color: #F5F5F8;
  padding: 15px 20px;
  min-height: 60px;
  width: 300px;
  border-radius: 10px;
  justify-content: space-between;
}
.container-message small {
  margin-bottom:-30px;
}

.message {
  display: flex;
  justify-content: space-between;
}
</style>