class Animation {
  constructor (imagePath, frameCount, ticksPerFrame, loop = true) {
    this.image = new Image();
    this.image.src = imagePath;
    this.frameCount = frameCount;
    this.ticksPerFrame = ticksPerFrame;
    this.loop = loop;
    this.currentFrame = 0;
    this.tickCount = 0;
  }

  tick () {
    this.tickCount++;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      this.currentFrame++;
      if (this.currentFrame >= this.frameCount) {
        if (this.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = this.frameCount - 1;
        }
      }
    }
  }

  draw (ctx, x, y, width, height) {
    const frameWidth = this.image.width / this.frameCount;
    const frameHeight = this.image.height;
    ctx.drawImage(
      this.image,
      this.currentFrame * frameWidth,
      0,
      frameWidth,
      frameHeight,
      x,
      y,
      width,
      height
    );
  }

  reset () {
    this.currentFrame = 0;
    this.tickCount = 0;
  }

  clone () {
    return new Animation(this.image.src, this.frameCount, this.ticksPerFrame, this.loop);
  }
}

class AnimationStage {
  constructor (animations) {
    this.animations = animations;
  }

  getAnimation (name) {
    return this.animations.get(name);
  }
}