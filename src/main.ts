import "vuetify/styles";
import "@/assets/styles/main.scss";
import "vue-toastification/dist/index.css";
import { createApp, provide, h } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/graphql/apollo-client";
import { loadFonts } from "./plugins/webfontloader";
import mitt from "mitt";
import type { Events } from "@/types/EmitEvents";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Toast, { POSITION } from "vue-toastification";
import type { PluginOptions } from "vue-toastification";

const toastOptions: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
};

loadFonts();

//Event bus
const emitter = mitt<Events>();

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
    provide("emitter", emitter);
  },
  render: () => h(App),
});

app.use(router).use(vuetify).use(pinia).use(Toast, toastOptions).mount("#app");
