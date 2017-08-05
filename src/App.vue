<template>
    <v-app>
        <app-header></app-header>

        <main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </main>

        <v-footer class="green">
            <span>© 2017 powered by showerbugs</span>
        </v-footer>

    </v-app>
</template>

<script>
import appHeader from './components/Header.vue'

export default {
    components: {
        appHeader
    }
}
</script>

<style>
</style>
