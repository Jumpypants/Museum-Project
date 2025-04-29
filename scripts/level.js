class Level {
  constructor(characterCount, stage, width, height, margin, time) {
    this.width = width;
    this.height = height;
    
    this.maxTime = time;
    this.timeLeft = time;

    this.borderX = margin;
    this.borderY = margin;
    this.borderW = width - 2 * margin;
    this.borderH = height - 2 * margin;
    this.stage = stage;

    this.characters = [];

    this.killed = false;
    this.gunAnimation = new Animation('assets/gun.png', 2, 20, false);
    
    for (let i = 0; i < characterCount; i++) {
      const size = Math.floor(Math.random() * 3);
      const x = Math.random() * (this.borderW - Character.SIZES[size].width) + this.borderX;
      const y = Math.random() * (this.borderH - Character.SIZES[size].height) + this.borderY;
      this.characters.push(new Character(x, y, size, stage));
    }
  }

  draw(ctx) {
    // Draw an outline of the scene
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw the border
    ctx.fillStyle = "black";
    ctx.fillRect(this.borderX, this.borderY, this.borderW, this.borderH);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.strokeRect(this.borderX, this.borderY, this.borderW, this.borderH);

    // Draw the characters
    for (const character of this.characters) {
      character.draw(ctx);
    }

    // Draw the gun animation
    if (this.killed) {
      this.gunAnimation.draw(ctx, this.width - 400, this.height - 400, 400, 400);
      this.gunAnimation.tick();
    }
  }

  tick() {
    this.timeLeft--;

    for (const character of this.characters) {
      character.tick(this.borderX, this.borderY, this.borderW, this.borderH);
    }

    // Check if any character is outside the level
    for (const character of this.characters) {
      if (
        character.x < -Character.SIZES[character.size].width / 2 ||
        character.x > this.width + Character.SIZES[character.size].width / 2 ||
        character.y < -Character.SIZES[character.size].height / 2 ||
        character.y > this.height + Character.SIZES[character.size].height / 2
      ) {
        return true; // Return true if any character is outside the level
      }
    }

    return false; // Return false if all characters are within the level
  }

  click(mouseX, mouseY) {
    for (const character of this.characters) {
      if (
        mouseX > character.x - Character.SIZES[character.size].width / 2 &&
        mouseX < character.x + Character.SIZES[character.size].width / 2 &&
        mouseY > character.y - Character.SIZES[character.size].height / 2 &&
        mouseY < character.y + Character.SIZES[character.size].height / 2
      ) {
        if (this.stage === 2) {
          character.setState('dead');
          this.killed = true;
          this.gunAnimation.reset();
          for (const otherCharacter of this.characters) {
            if (otherCharacter !== character) {
              otherCharacter.stun();
            }
          }
          break;
        } else {
          // Pick a random position within the border
          const newX = Math.random() * (this.borderW - Character.SIZES[character.size].width) + this.borderX;
          const newY = Math.random() * (this.borderH - Character.SIZES[character.size].height) + this.borderY;
          character.x = newX;
          character.y = newY;
          character.state = 'idle';
        }
      }
    }
  }

  reset() {
    for (const character of this.characters) {
      character.x = Math.random() * (this.borderW - Character.SIZES[character.size].width) + this.borderX;
      character.y = Math.random() * (this.borderH - Character.SIZES[character.size].height) + this.borderY;
      character.setState('idle');
    }
    this.timeLeft = this.maxTime;
  }
}