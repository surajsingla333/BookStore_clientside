<template>
    <div>
        <button class="button is-primary is-larges">{{msg.key1}}</button>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Welcome',
    data()
    {
        return{
            msg: "" }
    },
    methods: {
    getMessage() {
      const path = 'http://localhost:3000/';
      axios.get(path)
        .then((res) => {
          console.log(res)
          this.msg = res.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
  },
  created() {
    this.getMessage();
  },
}
</script>

