<template>
  <div>
    <v-toolbar class="green">
      <router-link :to="{name: 'home'}" tag="v-toolbar-title" class="title-home white--text">Acidrain</router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items class="toolbar-buttons">
        <template v-if="!user">
          <v-btn flat @click="signUpModal">회원가입</v-btn>
          <v-btn flat @click="signInModal">로그인</v-btn>
        </template>
        <template v-else>
          <v-btn flat @click="signOutModal">로그아웃</v-btn>
        </template>
      </v-toolbar-items>
    </v-toolbar>

    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>
          <span class="headline" v-if="isSignUp">회원가입</span>
          <span class="headline" v-else>로그인</span>
        </v-card-title>

        <v-card-text>
          <v-text-field label="이름" required v-model="name"></v-text-field>
          <v-text-field label="비밀번호" type="password" required v-model="password"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat primary @click.native="dialog = false">취소</v-btn>
          <v-btn flat primary @click.native="signComplete">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="signOutDialog" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">로그아웃</span>
        </v-card-title>

        <v-card-text>로그아웃 하시겠습니까?</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat primary @click.native="signOutDialog = false">취소</v-btn>
          <v-btn flat primary @click.native="signOut">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      signOutDialog: false,
      isSignUp: false,
      name: null,
      password: null,
      user: null
    }
  },
  methods: {
    signUpModal () {
      this.dialog = true
      this.isSignUp = true
    },
    signInModal () {
      this.dialog = true
      this.isSignUp = false
    },
    signOutModal () {
      this.signOutDialog = true
    },
    signComplete () {
      if (this.isSignUp) {
        this.signUp()
      } else {
        this.signIn()
      }
    },
    signUp () {
      fetch('https://acidrain.azurewebsites.net/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.name,
          password: this.password
        })
      })
      .then(result => {
        return result.text()
      })
      .then(result => {
        if (result.success) {
          this.dialog = false
        }
      })
    },
    signIn () {
      fetch('https://acidrain.azurewebsites.net/sessions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.name,
          password: this.password
        })
      })
      .then(result => {
        return result.text()
      })
      .then(result => {
        result = JSON.parse(result)

        if (result.success) {
          this.user = result.user.name
          this.dialog = false
        }
      })
    },
    signOut () {
      fetch('https://acidrain.azurewebsites.net/sessions/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(result => {
        return result.text()
      })
      .then(result => {
        result = JSON.parse(result)

        if (result.success) {
          this.user = null
          this.signOutDialog = false
        }
      })
    }
  }
}
</script>

<style>
.title-home {
  cursor: pointer;
}

.toolbar .toolbar-buttons .btn {
  color: white;
}
</style>
