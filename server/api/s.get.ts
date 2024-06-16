export default eventHandler(
  async (event) => await hubBlob().serve(event, 'songs.json')
)
