// src/stores/auth.js
import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    user: {},
    loading: false
  }),

  getters: {
  },

  actions: {

    async getCuruntUser() {
      try {
        const user = {
          id:123,
          name:'admin',
          content:"hi my name is abd i am 20 years okld",
          postsCount:10,
          followers:100,
          following:100,


        }
        this.user = user
      } catch (error) {
        
        console.log(error)
      }
    }
  }
})
