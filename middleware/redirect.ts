export default defineNuxtRouteMiddleware((to, from) => {
  const { public: { init} } = useRuntimeConfig()
  const date = new Date()
  const today = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${date.getDate()}`
  if (to.path !== '/' && to.path.slice(1) < init) return navigateTo('/')
  if (to.path !== '/' && to.path.slice(1) > today) return navigateTo('/')
})
