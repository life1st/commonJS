export default function Canvas(el) {
  this.canvas = el
  this.height = 900
  this.width = 1280
  this.ctx = this.canvas.getContext('2d')
  this.__callback_list = []

  this.canvas.addEventListener('click', (e) => {
    console.log(e, 'canvas had clicked.')
    this.__callback_list.forEach(cb => cb(e))
  })
}

Canvas.prototype.setSize = function(width = 1280, height = 900) {
  this.canvas.width = width
  this.canvas.height = height
  this.height = height
  this.width = width
}

Canvas.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
}

Canvas.prototype.drawRect = function(color, left, top, width, height) {
  this.ctx.fillStyle = color
  this.ctx.fillRect(top, left, width, height)
}

Canvas.prototype.drwaImg = function(img, left, top, width, height) {
  this.ctx.drawImage(img, left, top, width, height)
}

Canvas.prototype.setBackgroundImage = function (img) {
  const {width, height} = img

  if (width < this.width || height < this.height) {

  }

}

Canvas.prototype.onClick = function (callback) {
  if (this.__callback_list.includes(callback)) return


}