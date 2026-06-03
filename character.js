/* ========== 角色相关函数 ========== */

class Character {
  constructor(type = 'otter') {
    this.type = type; // 'otter' 或 'capybara'
    this.mood = 'calm';
    this.container = document.getElementById('character-container');
  }

  // 改变角色表情
  setMood(mood) {
    this.mood = mood;
    const character = this.container.querySelector('.character-otter, .character-capybara');
    
    if (character) {
      character.classList.remove('happy', 'sad');
      
      if (mood === 'happy' || mood === 'calm') {
        character.classList.add('happy');
      } else if (mood === 'sad' || mood === 'anxious') {
        character.classList.add('sad');
      }
    }

    // 更新角色的说话气泡
    this.speak(this.getMoodMessage(mood));
  }

  // 根据心情获取消息
  getMoodMessage(mood) {
    const messages = {
      calm: '你很平静，保持这份安宁 ✨',
      happy: '太棒了！保持这份快乐！🌈',
      sad: '我陪伴着你，一切都会好的 💙',
      anxious: '深呼吸，让我们一起平静下来 🌊',
      unconfident: '你比想象中更棒！相信自己 💪'
    };
    return messages[mood] || '我在这里陪伴你';
  }

  // 角色说话
  speak(message) {
    // 创建对话气泡
    let bubble = document.querySelector('.character-bubble');
    if (!bubble) {
      bubble = document.createElement('div');
      bubble.className = 'character-bubble';
      this.container.appendChild(bubble);
    }
    
    bubble.textContent = message;
    bubble.style.display = 'block';
    
    // 3秒后隐藏
    setTimeout(() => {
      bubble.style.display = 'none';
    }, 3000);
  }

  // 角色跳舞（完成打卡时）
  dance() {
    const character = this.container.querySelector('.character-otter, .character-capybara');
    if (character) {
      character.style.animation = 'dance 0.6s ease-in-out';
      setTimeout(() => {
        character.style.animation = '';
      }, 600);
    }
    this.speak('恭喜你！坚持下去 🎉');
  }

  // 角色鼓励（AI对话）
  encourage() {
    this.speak('加油！你做得很好 🌟');
  }
}

// 创建全局角色实例
let character;

// 初始化角色
function initCharacter(type = 'otter') {
  character = new Character(type);
  
  // 添加对话气泡样式
  if (!document.querySelector('style[data-character]')) {
    const style = document.createElement('style');
    style.setAttribute('data-character', 'true');
    style.textContent = `
      .character-bubble {
        position: absolute;
        top: -50px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #5bb1a8, #7dd3c5);
        color: #fff;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 10;
        animation: bubbleFloat 0.5s ease-out;
        display: none;
      }

      .character-bubble::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #5bb1a8;
      }

      @keyframes bubbleFloat {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      @keyframes dance {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(-5deg); }
        50% { transform: translateY(0) rotate(5deg); }
        75% { transform: translateY(-10px) rotate(-5deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

// 更新角色表情（根据心情）
function updateCharacterMood(mood) {
  if (character) {
    character.setMood(mood);
  }
}

// 角色庆祝（完成打卡）
function characterCelebrate() {
  if (character) {
    character.dance();
  }
}

// 页面加载时初始化角色
document.addEventListener('DOMContentLoaded', () => {
  initCharacter('otter'); // 默认使用水獭，可改为 'capybara'
});
