// main.js: 页面交互、localStorage、与 character.js 的桥接
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const welcome = document.getElementById('welcome');
  const journal = document.getElementById('journal');
  const guide = document.getElementById('guide');
  const submitBtn = document.getElementById('submitBtn');
  const againBtn = document.getElementById('againBtn');
  const entryEl = document.getElementById('entry');
  const moodEl = document.getElementById('mood');
  const errEl = document.getElementById('errorMsg');

  // 初始化角色（如果 character.js 提供 initCharacter）
  if (typeof initCharacter === 'function') {
    try {
      // 防止重复初始化：initCharacter 可以自行判断
      initCharacter('otter');
    } catch (e) {
      console.warn('角色初始化错误', e);
    }
  }

  function showError(msg){
    errEl.textContent = msg;
    setTimeout(()=> { if (errEl.textContent === msg) errEl.textContent = ''; }, 3000);
  }

  startBtn.addEventListener('click', () => {
    welcome.classList.add('hide');
    welcome.setAttribute('aria-hidden','true');
    journal.classList.remove('hide');
    journal.setAttribute('aria-hidden','false');
  });

  againBtn.addEventListener('click', () => {
    guide.classList.add('hide');
    guide.setAttribute('aria-hidden','true');
    journal.classList.remove('hide');
    journal.setAttribute('aria-hidden','false');
    entryEl.value = '';
    errEl.textContent = '';
  });

  submitBtn.addEventListener('click', () => {
    const text = (entryEl.value || '').trim();
    const mood = (moodEl.value || 'calm');

    if (!text) {
      showError('请先写点内容😊');
      return;
    }

    // 保存到 localStorage（最新在前，保存 200 条）
    try {
      const key = 'md-entries';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.unshift({mood, text, t: Date.now()});
      localStorage.setItem(key, JSON.stringify(list.slice(0,200)));
    } catch (e) {
      console.warn('localStorage 保存失败', e);
    }

    // 更新角色表情并庆祝
    if (typeof updateCharacterMood === 'function') updateCharacterMood(mood);
    if (typeof characterCelebrate === 'function') characterCelebrate();

    // 显示引导内容（guide data 可以保留在 index.html 或在此处重构）
    showGuide(mood);
  });

  // 引导文本与展示函数（保持原有内容）
  const guides = {
    calm: {
      title: '🌞 适合你：呼吸静观冥想',
      content: '继续觉察呼吸与身体，让平静成为你的力量。找一个舒适的姿势，闭上眼睛，专注于每一次呼吸。吸气时默数四拍，呼气时也默数四拍。感受身体的放松，享受这一刻的宁静。'
    },
    happy: {
      title: '🌈 适合你：感恩冥想',
      content: '记得心中的快乐源泉，给自己一个拥抱，感恩世界和自己。想想今天让你开心的事情，可能是一句话、一个笑容、或者一个小幸运。默念:"感恩这一切美好"，让快乐在心中流淌。'
    },
    sad: {
      title: '🌧️ 适合你：情绪陪伴冥想',
      content: '允许情绪出现，请深呼吸，念一句"我被理解，也逐渐变好"。悲伤是正常的情绪，不必压抑它。找个舒适的地方坐下，让眼泪流出来也没关系。慢慢呼吸，告诉自己：这也会过去。'
    },
    anxious: {
      title: '🌊 适合你：波浪冥想',
      content: '专注吸气吐气，试着想象海浪声，让思绪慢慢安静。焦虑时，身体会紧张。尝试从脚趾开始，逐步放松全身肌肉。想象自己被温暖的海浪轻轻托住，随波逐流，一切都会好起来。'
    },
    unconfident: {
      title: '🌪️ 适合你：自我激励冥想',
      content: '你很棒，允许偶尔怀疑，相信自己终会成长！每个人都有迷茫和怀疑的时候。看看你已经走过的路，克服过的困难，你比想象中坚强得多。默念:"我值得被爱，我会越来越好"。'
    }
  };

  function showGuide(moodType) {
    const guideData = guides[moodType] || guides.calm;
    document.getElementById('guideTitle').textContent = guideData.title || '';
    document.getElementById('guideContent').textContent = guideData.content || '';

    journal.classList.add('hide');
    journal.setAttribute('aria-hidden','true');
    guide.classList.remove('hide');
    guide.setAttribute('aria-hidden','false');
  }

  // PWA Service Worker 注册（移动到 main.js 统一管理）
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.log('Service Worker 注册失败:', err);
    });
  }
});
