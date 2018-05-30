<template>
  <div>
    <flower-spinner :animation-duration="2500" :size="70" color="#187dd4"/>
  </div>
</template>

<script>
  import { FlowerSpinner } from 'epic-spinners'

  export default{
    components: {
      FlowerSpinner
    }
  }
</script>

<style lang="less" scoped>
  div{
    height: 100%;
    padding-top: 9%;

    .flower-spinner{
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
