import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/MovieWatch/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        login: resolve(process.cwd(), 'login-form.html'),
        subscribe: resolve(process.cwd(), 'subscribe.html'),
        movieDetail: resolve(process.cwd(), 'movie-detail.html'),
        contact: resolve(process.cwd(), 'contact.html'),
        tvshows: resolve(process.cwd(), 'tvshows.html'),
      },
    },
  },
});