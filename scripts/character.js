class Character {
  static STAGES = [
    new AnimationStage(new Map([
      ['idle', new Animation('assets/stages/one/triangle.png', 1, 1)],
      ['walk', new Animation('assets/stages/one/triangle.png', 1, 1)],
      ['bolt', new Animation('assets/stages/one/triangle.png', 1, 1)],
    ])),
    new AnimationStage(new Map([
      ['idle', new Animation('assets/stages/two/idle.png', 1, 1)],
      ['walk', new Animation('assets/stages/two/walk.png', 4, 10)],
      ['bolt', new Animation('assets/stages/two/walk.png', 4, 5)],
    ])),
    new AnimationStage(new Map([
      ['idle', new Animation('assets/stages/three/idle.png', 1, 1)],
      ['walk', new Animation('assets/stages/three/walk.png', 8, 5)],
      ['bolt', new Animation('assets/stages/three/walk.png', 8, 2)],
      ['dead', new Animation('assets/stages/three/dead.png', 1, 1)],
    ]))
  ];

  static SIZES = [
    { width: 55, height: 55 },
    { width: 65, height: 65 },
    { width: 75, height: 75 },
  ];

  constructor(x, y, size, stage) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.stage = stage;

    this.state = 'idle';
    this.animation = Character.STAGES[this.stage].getAnimation(this.state).clone();
    this.targetX = x;
    this.targetY = y;
    this.speed = 1.5;

    this.stunned = false;
  }

  tick(borderX, borderY, borderW, borderH) {
    this.animation.tick();

    switch (this.state) {
      case 'idle':
        if (Math.random() < 0.01 && !this.stunned) {
          this.setState('walk');
          do {
            this.targetX = this.x + (Math.random() - 0.5) * 500;
            this.targetY = this.y + (Math.random() - 0.5) * 500;
          } while (
            this.targetX < borderX + Character.SIZES[this.size].width / 2 || 
            this.targetX > borderX + borderW - Character.SIZES[this.size].width / 2 || 
            this.targetY < borderY + Character.SIZES[this.size].height / 2 || 
            this.targetY > borderY + borderH - Character.SIZES[this.size].height / 2
          );
        } else if (Math.random() < 0.0011 * (this.stunned ? 2 : 1)) {
          this.setState('bolt');
          // pick a random target outside the border
          do {
            this.targetX = this.x + (Math.random() - 0.5) * 10000;
            this.targetY = this.y + (Math.random() - 0.5) * 10000;
          } while (
            this.targetX > borderX + Character.SIZES[this.size].width / 2 && 
            this.targetX < borderX + borderW - Character.SIZES[this.size].width / 2 && 
            this.targetY > borderY + Character.SIZES[this.size].height / 2 && 
            this.targetY < borderY + borderH - Character.SIZES[this.size].height / 2
          );
        }

        break;
      case 'walk':
        // Calculate the x and y increments so that the character moves towards the target at the specified speed
        var dx = this.targetX - this.x;
        var dy = this.targetY - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          // Apply a curve in speed: slow down as the character gets closer to the target
          const adjustedSpeed = this.speed * Math.min(1, distance / 30);

          const incrementX = (dx / distance) * adjustedSpeed;
          const incrementY = (dy / distance) * adjustedSpeed;

          // Update the character's position
          this.x += incrementX;
          this.y += incrementY;

          // If the character is close enough to the target, stop moving
          if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
            this.setState('idle');
          }
        }
        break;

      case 'bolt':
        // Calculate the x and y increments so that the character moves towards the target at the specified speed
        var dx = this.targetX - this.x;
        var dy = this.targetY - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          const incrementX = (dx / distance) * this.speed * 2;
          const incrementY = (dy / distance) * this.speed * 2;

          // Update the character's position
          this.x += incrementX;
          this.y += incrementY;
        }
        break;
      default:
        break;
    }
  }

  draw(ctx) {    const size = Character.SIZES[this.size];

    // ctx.fillStyle = "red";
    // ctx.fillRect(this.x - size.width / 2, this.y - size.height / 2, size.width, size.height);
    this.animation.draw(ctx, this.x - size.width / 2, this.y - size.height / 2, size.width, size.height);
  }

  setState(state) {
    if (this.state !== state) {
      this.state = state;
      this.animation = Character.STAGES[this.stage].getAnimation(this.state).clone();
    }
  }

  stun(){
    this.stunned = true;
  }
}
