<template>
  <tr>
    <td class="email">{{ user?.email }}</td>
    <td class="name"></td>
    <td class="role">{{ user?.role.title }}</td>
    <td class="del__button" @click="handleDelete ">X</td>
  </tr>
</template>

<script>
export default {
  name: "User",
  props: ["user", "data"],
  setup(props) {
    const handleDelete = async () => {
      if (props.user.role.role === 1) return alert("You cant delete this account");
      if(confirm("Kindly confirm you want to delete this account")) await props.data.handleDeleteUser(props.user)
    }

    return {
      handleDelete
    }
  }
}
</script>

<style lang="scss" scoped>
tr {
  border-bottom: solid 1px var(--secondary-color);
    td {
      &.del__button {
        background: tomato;
        text-align: center;
        transition: all 0.3s ease-in-out;
        cursor: pointer;
        filter: saturate(1);
        &:hover {
          filter: saturate(3);
        }
      }
    }

}
</style>