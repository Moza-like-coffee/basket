import { defineStore } from 'pinia';

export const useResponseStore = defineStore('response', {
    state: () => ({
        errors: [],
        success: []
    }),
    actions: {
        addError(msg) {
            this.errors = [...this.errors, msg];
        },
        clearErrors() {
            this.errors = [];
        },
        addSuccess(msg) {
            this.success = [...this.success, msg];
        },
        clearSuccess() {
            this.success = [];
        }
    }
});
