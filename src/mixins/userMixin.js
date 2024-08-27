import { user } from "./authMixin";

export const userMixin = {
    computed: {
        user() {
            return user.value;
        },

        isAdmin() {
            user.value && user.value.role === "admin";
            return true
        }

    },

}

