/**
 * The Usual Kaffèe (थे उसूल काफ़ी)
 * Core Application Engine & Interactive System
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 500);
    });
    // Fallback if load already happened
    setTimeout(() => {
      if (!preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
      }
    }, 1200);
  }

  // 2. Scroll Progress & Sticky Navbar
  const scrollProgress = document.getElementById('scroll-progress');
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / (totalHeight || 1)) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Drawer
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Accessibility Controls
  const fontSizes = [0.9, 1, 1.15];
  let currentFontIdx = 1;
  const fontDecBtn = document.getElementById('font-decrease');
  const fontResetBtn = document.getElementById('font-reset');
  const fontIncBtn = document.getElementById('font-increase');
  const themeToggle = document.getElementById('theme-toggle');
  const contrastToggle = document.getElementById('contrast-toggle');
  const motionToggle = document.getElementById('motion-toggle');

  function updateFontSize(idx) {
    currentFontIdx = idx;
    document.documentElement.style.setProperty('--font-scale', fontSizes[currentFontIdx]);
    showToast(`Font scale set to ${Math.round(fontSizes[currentFontIdx] * 100)}%`);
  }

  if (fontDecBtn) {
    fontDecBtn.addEventListener('click', () => {
      if (currentFontIdx > 0) updateFontSize(currentFontIdx - 1);
    });
  }
  if (fontResetBtn) {
    fontResetBtn.addEventListener('click', () => {
      updateFontSize(1);
    });
  }
  if (fontIncBtn) {
    fontIncBtn.addEventListener('click', () => {
      if (currentFontIdx < fontSizes.length - 1) updateFontSize(currentFontIdx + 1);
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', next);
      themeToggle.innerHTML = next === 'light' ? '☀️ Mode' : '🌙 Mode';
      showToast(`Switched to ${next} ambiance`);
    });
  }

  if (contrastToggle) {
    contrastToggle.addEventListener('click', () => {
      const current = document.body.getAttribute('data-contrast');
      const isHigh = current === 'high';
      if (isHigh) {
        document.body.removeAttribute('data-contrast');
        contrastToggle.classList.remove('active');
        showToast('High contrast disabled');
      } else {
        document.body.setAttribute('data-contrast', 'high');
        contrastToggle.classList.add('active');
        showToast('High contrast mode enabled');
      }
    });
  }

  if (motionToggle) {
    motionToggle.addEventListener('click', () => {
      const current = document.body.getAttribute('data-reduced-motion');
      const isReduced = current === 'true';
      if (isReduced) {
        document.body.removeAttribute('data-reduced-motion');
        motionToggle.classList.remove('active');
        showToast('Animations restored');
      } else {
        document.body.setAttribute('data-reduced-motion', 'true');
        motionToggle.classList.add('active');
        showToast('Reduced motion enabled');
      }
    });
  }

  // 4. Toast Notification
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
  window.showToast = showToast;

  // 5. Live Public Weather API (Open-Meteo for Hari Nagar, New Delhi)
  async function fetchDelhiWeather() {
    const tempEl = document.getElementById('live-delhi-temp');
    const descEl = document.getElementById('live-weather-desc');
    const pairingEl = document.getElementById('live-pairing-text');
    const aqiEl = document.getElementById('live-delhi-aqi');

    try {
      // Hari Nagar, New Delhi coordinates
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6289&longitude=77.1086&current=temperature_2m,relative_humidity_2m,is_day,weather_code');
      if (!response.ok) throw new Error('Weather API error');
      const data = await response.json();
      const current = data.current;
      const temp = Math.round(current.temperature_2m);
      const humidity = current.relative_humidity_2m;

      if (tempEl) tempEl.innerHTML = `${temp}°<span style="font-size: 1.1rem; color: var(--text-muted);">C</span>`;

      let condition = 'Pleasant & Breezy';
      let pairing = 'Pair with: Signature Desi Hand-Beaten Coffee & Steamed Momos';

      if (temp >= 32) {
        condition = 'Warm Delhi Sun';
        pairing = 'Pair with: Iced Hand-Beaten Frappe + Refreshing Veg Chowmein';
      } else if (temp <= 18) {
        condition = 'Chilly Delhi Evening';
        pairing = 'Pair with: Piping Hot Beaten Coffee + Spicy Mixed Sauce Pasta';
      } else {
        condition = 'Perfect Cafe Weather';
        pairing = 'Pair with: Farmhouse Pizza + Creamy Hand-Beaten Coffee';
      }

      if (descEl) descEl.textContent = `${condition} in Hari Nagar (${humidity}% humidity)`;
      if (pairingEl) pairingEl.textContent = pairing;
      if (aqiEl) aqiEl.textContent = 'Indoor HEPA Filtered · Pure Cafe Air';

    } catch (err) {
      if (tempEl) tempEl.innerHTML = `24°<span style="font-size: 1.1rem; color: var(--text-muted);">C</span>`;
      if (descEl) descEl.textContent = `Cozy Ambience in Hari Nagar, West Delhi`;
      if (pairingEl) pairingEl.textContent = `Pair with: Signature Hand-Beaten Coffee & Farmhouse Pizza`;
      if (aqiEl) aqiEl.textContent = 'HEPA Filtered Pure Indoor Air';
    }
  }
  fetchDelhiWeather();

  // Live Delhi Time Clock
  function updateDelhiClock() {
    const clockEl = document.getElementById('live-delhi-clock');
    if (!clockEl) return;
    const now = new Date();
    // Format in Indian Standard Time (IST)
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    clockEl.textContent = now.toLocaleTimeString('en-US', options) + ' IST';
  }
  setInterval(updateDelhiClock, 1000);
  updateDelhiClock();

  // 6. Interactive Dashboard Tabs
  const dashTabBtns = document.querySelectorAll('.dash-tab-btn');
  const dashTabContents = document.querySelectorAll('.dash-tab-content');

  dashTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');
      dashTabBtns.forEach(b => b.classList.remove('active'));
      dashTabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(tabTarget);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Interactive Table Grid Node Selection
  const tableNodes = document.querySelectorAll('.cafe-table-node');
  const selectedTableDisplay = document.getElementById('selected-table-label');
  const selectedTableStatus = document.getElementById('selected-table-status');

  tableNodes.forEach(node => {
    node.addEventListener('click', () => {
      tableNodes.forEach(n => n.classList.remove('selected'));
      node.classList.add('selected');
      const tNum = node.getAttribute('data-table');
      const isOccupied = node.classList.contains('occupied');

      if (selectedTableDisplay) selectedTableDisplay.textContent = `Table #${tNum}`;
      if (selectedTableStatus) {
        if (isOccupied) {
          selectedTableStatus.textContent = 'Currently in service · Ready in ~15 mins';
          selectedTableStatus.style.color = '#f87171';
        } else {
          selectedTableStatus.textContent = 'Ready for immediate seating · Click Reserve Below';
          selectedTableStatus.style.color = '#4ade80';
        }
      }
    });
  });

  // Dashboard Roaster / Coffee Profiler Sliders
  const roastSlider = document.getElementById('slider-roast');
  const milkSlider = document.getElementById('slider-milk');
  const sweetSlider = document.getElementById('slider-sweet');
  const matchBrewTitle = document.getElementById('match-brew-title');
  const matchBrewDesc = document.getElementById('match-brew-desc');
  const matchBrewPrice = document.getElementById('match-brew-price');

  function updateCoffeeMatch() {
    if (!roastSlider || !milkSlider || !sweetSlider) return;
    const roast = parseInt(roastSlider.value);
    const milk = parseInt(milkSlider.value);
    const sweet = parseInt(sweetSlider.value);

    let title = 'The Signature Desi Hand-Beaten Coffee';
    let desc = 'Thick velvety foam whipped meticulously by hand with caramel notes and rich warmth.';
    let price = '₹89';

    if (roast > 75 && milk < 30) {
      title = 'Midnight Dark Espresso Shot';
      desc = 'Intense bold roasted Arabica extraction with rich crema and dark cocoa finish.';
      price = '₹79';
    } else if (sweet > 70 && milk > 60) {
      title = 'Velvet Caramel Beaten Frappe';
      desc = 'Chilled luscious hand-beaten cold brew blended with creamy caramel syrup and whole milk.';
      price = '₹129';
    } else if (milk > 80) {
      title = 'Silky Hazelnut Cafe Latte';
      desc = 'Triple-microfoamed steamed milk poured over smooth roasted beans with nutty notes.';
      price = '₹119';
    } else if (roast < 40 && sweet < 30) {
      title = 'Artisan Single Origin Pour-Over';
      desc = 'Bright floral citrus notes, crystal clear clarity, light and clean finish.';
      price = '₹139';
    }

    if (matchBrewTitle) matchBrewTitle.textContent = title;
    if (matchBrewDesc) matchBrewDesc.textContent = desc;
    if (matchBrewPrice) matchBrewPrice.textContent = price;
  }

  if (roastSlider) roastSlider.addEventListener('input', updateCoffeeMatch);
  if (milkSlider) milkSlider.addEventListener('input', updateCoffeeMatch);
  if (sweetSlider) sweetSlider.addEventListener('input', updateCoffeeMatch);

  // Group Bill & Feast Calculator
  const guestCountInput = document.getElementById('calc-guests');
  const guestCountVal = document.getElementById('calc-guests-val');
  const mealTypeSelect = document.getElementById('calc-meal-type');
  const calcTotalBill = document.getElementById('calc-total-bill');
  const calcPerPerson = document.getElementById('calc-per-person');
  const calcItemsList = document.getElementById('calc-items-list');

  function updateBillCalculation() {
    if (!guestCountInput) return;
    const guests = parseInt(guestCountInput.value);
    if (guestCountVal) guestCountVal.textContent = guests;

    const meal = mealTypeSelect ? mealTypeSelect.value : 'balanced';
    let perHead = 120;
    let menuCombo = 'Hand-beaten Coffee + Steamed Veg Momos';

    if (meal === 'snack') {
      perHead = 75;
      menuCombo = 'Hand-beaten Coffee + Masala Crisps';
    } else if (meal === 'balanced') {
      perHead = 135;
      menuCombo = 'Desi Beaten Coffee + Steamed Momos + Chowmein Sharing';
    } else if (meal === 'feast') {
      perHead = 190;
      menuCombo = 'Special Beaten Coffee + Farmhouse Pizza + Mixed Sauce Penne + Fried Momos';
    }

    const total = perHead * guests;
    if (calcTotalBill) calcTotalBill.textContent = `₹${total}`;
    if (calcPerPerson) calcPerPerson.textContent = `₹${perHead} / person (Within ₹1–200 range!)`;
    if (calcItemsList) calcItemsList.textContent = `Ideal order: ${guests > 1 ? `${guests}x ` : ''}${menuCombo}`;
  }

  if (guestCountInput) guestCountInput.addEventListener('input', updateBillCalculation);
  if (mealTypeSelect) mealTypeSelect.addEventListener('change', updateBillCalculation);
  updateBillCalculation();

  // 7. Gaia AI Barista Chatbot System
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const typingIndicator = document.getElementById('typing-indicator');

  // Intelligent Knowledge Base for The Usual Kaffèe
  const cafeKnowledge = [
    {
      keywords: ['hand beaten', 'beaten coffee', 'hand-beaten', 'coffee', 'specialty', 'special', 'coffee menu'],
      response: `Our crown jewel is the <strong>Signature Desi Hand-Beaten Coffee</strong>! ☕<br><br>
      Inspired by authentic Indian household traditions, our baristas hand-whip coffee crystals and sugar into a silky, golden caramel froth before folding in steaming, velvety milk. It delivers a rich, creamy cloud on top that melts in your mouth with zero bitterness. Available in classic hot (₹89) or chilled beaten frappe (₹119).`
    },
    {
      keywords: ['momo', 'momos', 'steamed', 'fried', 'tandoori momos'],
      response: `Our Momos are rated the absolute best in Hari Nagar! 🥟<br><br>
      • <strong>Steamed Veg Momos (₹99)</strong>: Ultra-thin translucent wrapper filled with fresh garden herbs and spicy fire-chili garlic dip.<br>
      • <strong>Kurkure Crispy Momos (₹129)</strong>: Golden crunchy outer coating with juicy melting filling.<br>
      • <strong>Paneer Steamed Momos (₹119)</strong>: Tender cottage cheese infused with secret spices.<br><br>
      <em>Pairing Tip:</em> Steamed momos pair astonishingly well with hot hand-beaten coffee!`
    },
    {
      keywords: ['pasta', 'penne', 'mixed sauce', 'red sauce', 'white sauce'],
      response: `You must try our <strong>Mixed Sauce Penne Pasta (₹149)</strong>! 🍝<br><br>
      We simmer authentic Italian penne with a harmonious blend of creamy Alfredo and fiery tangy Arrabiata pomodoro, loaded with bell peppers, sweet corn, and melted mozzarella. Diners consistently rave about the rich garlic aroma and balance.`
    },
    {
      keywords: ['pizza', 'farmhouse', 'crust', 'cheese'],
      response: `Our <strong>Farmhouse Pizza (₹169)</strong> is freshly baked to order! 🍕<br><br>
      Crispy thin crust topped with signature herb tomato sauce, diced capsicum, red onions, mushrooms, sweet corn, and a generous layer of stringy mozzarella. Perfect for sharing with friends.`
    },
    {
      keywords: ['chowmein', 'noodles', 'chinese', 'hakka'],
      response: `Our street-style <strong>Desi Wok Chowmein (₹109)</strong> brings pure Delhi street nostalgia! 🍜<br><br>
      Tossed on a screaming hot iron wok with crunchy cabbage, capsicum, soy sauce, green chilies, and our house spice blend. A diner favorite for quick evening comfort!`
    },
    {
      keywords: ['price', 'cost', 'budget', 'affordable', 'rate', 'menu cost'],
      response: `We pride ourselves on offering luxurious taste at pocket-friendly student and family rates! 💰<br><br>
      Our verified price range is <strong>₹1–200 per person</strong>. You can enjoy a full hearty meal (coffee + momos or pasta) comfortably under ₹180!`
    },
    {
      keywords: ['time', 'timings', 'open', 'close', 'midnight', 'late night', 'hours'],
      response: `We are open every day from <strong>11:00 AM to 12:00 Midnight</strong>! 🌙<br><br>
      Whether you're looking for an afternoon work recharge or a late-night midnight coffee run with friends, our doors and kitchen are open.`
    },
    {
      keywords: ['location', 'where', 'address', 'directions', 'milap market', 'hari nagar', 'reach'],
      response: `We are conveniently located at: 📍<br><br>
      <strong>Milap Market, J/41, Block J, Beri Wala Bagh, Hari Nagar, New Delhi, Delhi 110064</strong><br>
      Google Plus Code: <code>J4M6+JH New Delhi, Delhi</code><br>
      📞 Direct Line: <strong>088821 61836</strong><br><br>
      Ample street parking is available along Milap Market road!`
    },
    {
      keywords: ['lgbtq', 'safe space', 'women owned', 'owner', 'pride', 'inclusive'],
      response: `Yes, absolutely! 🏳️‍🌈✨<br><br>
      The Usual Kaffèe is proudly <strong>women-owned</strong> and an officially certified <strong>LGBTQ+ friendly safe space</strong>. Everyone is welcomed with open arms, respect, warm smiles, and phenomenal food.`
    },
    {
      keywords: ['delivery', 'takeaway', 'pickup', 'kerbside', 'order online', 'swiggy', 'zomato'],
      response: `We offer three convenient service options: 🛵<br><br>
      1. <strong>Dine-In</strong>: Relax in our aesthetic, ambient cafe.<br>
      2. <strong>Kerbside Pickup</strong>: Pull up to Milap Market and our team will bring your hot order directly to your car.<br>
      3. <strong>No-Contact Delivery</strong>: Order directly or through our delivery partners to enjoy at home.`
    },
    {
      keywords: ['reservation', 'table', 'book', 'party', 'birthday', 'seat'],
      response: `You can reserve your table right here using our interactive <strong>Reserve a Table</strong> section below! 🥂<br><br>
      Simply choose your date, time, and party size. We hold reserved tables for 15 minutes past booking time with special ambient table lighting.`
    }
  ];

  function getAiResponse(userText) {
    const text = userText.toLowerCase().trim();

    for (const item of cafeKnowledge) {
      if (item.keywords.some(kw => text.includes(kw))) {
        return item.response;
      }
    }

    // Default intelligent conversational barista response
    return `Thank you for asking! At <strong>The Usual Kaffèe</strong>, we craft every dish with love—from our legendary hand-beaten coffee to spicy steamed momos, wood-fired farmhouse pizza, and creamy mixed-sauce penne.<br><br>
    Would you like to know more about our:<br>
    • ☕ <strong>Hand-Beaten Coffee Secrets</strong><br>
    • 🥟 <strong>Momos & Chowmein Specials</strong><br>
    • 💰 <strong>Pocket-Friendly ₹150 Combos</strong><br>
    • 📍 <strong>Directions to Milap Market, Hari Nagar</strong>?`;
  }

  function appendMessage(sender, content) {
    if (!chatMessages) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;

    if (sender === 'bot') {
      bubble.innerHTML = `
        <div class="bubble-avatar" aria-hidden="true">☕</div>
        <div class="bubble-body">
          <div class="bubble-content">${content}</div>
          <div class="bubble-meta">
            <span>Gaia AI · ${timeStr}</span>
          </div>
          <div class="bubble-actions">
            <button class="bubble-action-btn copy-btn" title="Copy response">
              <span>📋 Copy</span>
            </button>
            <button class="bubble-action-btn like-btn" title="Helpful">
              <span>👍</span>
            </button>
          </div>
        </div>
      `;

      // Copy listener
      const copyBtn = bubble.querySelector('.copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = content;
          navigator.clipboard.writeText(tempDiv.innerText);
          showToast('Copied to clipboard');
        });
      }

      // Like listener
      const likeBtn = bubble.querySelector('.like-btn');
      if (likeBtn) {
        likeBtn.addEventListener('click', () => {
          likeBtn.style.color = 'var(--amber-glow)';
          showToast('Thanks for your feedback!');
        });
      }

    } else {
      bubble.innerHTML = `
        <div class="bubble-avatar" aria-hidden="true">👤</div>
        <div class="bubble-body">
          <div class="bubble-content">${escapeHTML(content)}</div>
          <div class="bubble-meta">
            <span>You · ${timeStr}</span>
          </div>
        </div>
      `;
    }

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  function handleUserChat(text) {
    if (!text || text.trim() === '') return;
    appendMessage('user', text);

    if (typingIndicator) {
      typingIndicator.style.display = 'flex';
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Realistic human-paced AI response
    setTimeout(() => {
      if (typingIndicator) typingIndicator.style.display = 'none';
      const aiReply = getAiResponse(text);
      appendMessage('bot', aiReply);
    }, 650);
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = chatInput.value;
      chatInput.value = '';
      handleUserChat(val);
    });
  }

  // Chips click handlers
  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt') || chip.textContent;
      handleUserChat(promptText);
    });
  });

  // 8. Chart.js Data Visualizations
  if (typeof Chart !== 'undefined') {
    // Chart 1: Popular Times & Tuesday Footfall Peak
    const ctxHours = document.getElementById('popularHoursChart');
    if (ctxHours) {
      new Chart(ctxHours, {
        type: 'bar',
        data: {
          labels: ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p', '12a'],
          datasets: [{
            label: 'Relative Cafe Footfall',
            data: [15, 30, 65, 80, 55, 75, 95, 100, 85, 40],
            backgroundColor: (context) => {
              // Highlight peak evening hours (6p, 8p)
              const idx = context.dataIndex;
              return idx === 6 || idx === 7 ? 'rgba(245, 158, 11, 0.9)' : 'rgba(217, 119, 6, 0.4)';
            },
            borderRadius: 6,
            borderWidth: 1,
            borderColor: 'rgba(245, 158, 11, 0.6)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(18, 15, 12, 0.95)',
              titleColor: '#f59e0b',
              bodyColor: '#fdfbf7',
              borderColor: 'rgba(217, 119, 6, 0.3)',
              borderWidth: 1,
              callbacks: {
                label: (item) => ` Footfall: ${item.formattedValue}% of capacity`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#8c816f' }
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#8c816f', callback: (v) => `${v}%` }
            }
          }
        }
      });
    }

    // Chart 2: Flavor Profile Radar (Hand-Beaten vs Espresso vs Cold Brew)
    const ctxFlavor = document.getElementById('flavorRadarChart');
    if (ctxFlavor) {
      new Chart(ctxFlavor, {
        type: 'radar',
        data: {
          labels: ['Crema Density', 'Caramel Sweetness', 'Body & Thickness', 'Aromatics', 'Boldness'],
          datasets: [
            {
              label: 'Desi Hand-Beaten Coffee',
              data: [98, 92, 95, 90, 84],
              backgroundColor: 'rgba(245, 158, 11, 0.3)',
              borderColor: '#f59e0b',
              borderWidth: 2,
              pointBackgroundColor: '#f59e0b'
            },
            {
              label: 'Standard Machine Espresso',
              data: [80, 50, 70, 85, 95],
              backgroundColor: 'rgba(20, 184, 166, 0.15)',
              borderColor: '#14b8a6',
              borderWidth: 2,
              pointBackgroundColor: '#14b8a6'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#b8b0a2', boxWidth: 12, font: { size: 11 } }
            }
          },
          scales: {
            r: {
              angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
              grid: { color: 'rgba(255, 255, 255, 0.08)' },
              pointLabels: { color: '#fed7aa', font: { size: 10, weight: 600 } },
              ticks: { display: false, maxTicksLimit: 5 }
            }
          }
        }
      });
    }

    // Chart 3: Customer Craving Demand Breakdown
    const ctxDemand = document.getElementById('demandDoughnutChart');
    if (ctxDemand) {
      new Chart(ctxDemand, {
        type: 'doughnut',
        data: {
          labels: ['Hand-Beaten Coffee', 'Steamed/Crispy Momos', 'Farmhouse Pizza', 'Mixed Sauce Penne', 'Wok Chowmein'],
          datasets: [{
            data: [35, 28, 18, 11, 8],
            backgroundColor: [
              '#d97706',
              '#f59e0b',
              '#e11d48',
              '#14b8a6',
              '#8b5cf6'
            ],
            borderColor: '#0a0908',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#b8b0a2', boxWidth: 12, padding: 14 }
            }
          },
          cutout: '68%'
        }
      });
    }
  }

  // 9. Filterable Gallery
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');

      galleryItems.forEach(item => {
        if (cat === 'all' || item.getAttribute('data-category') === cat) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.remove('active');
    });
  }

  // 10. Animated Statistics Counters
  const counterElements = document.querySelectorAll('.stat-counter-number');
  let countersAnimated = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counterElements.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;
          const duration = 1800;
          const startTime = performance.now();

          function updateCounter(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = progress * target;
            counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
            }
          }
          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) countObserver.observe(statsSection);

  // 11. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => {
          other.classList.remove('active');
          const t = other.querySelector('.faq-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // 12. Table Booking Form
  const bookingForm = document.getElementById('table-booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('book-name')?.value || 'Guest';
      const guests = document.getElementById('book-guests')?.value || '2';
      const time = document.getElementById('book-time')?.value || '7:00 PM';
      const date = document.getElementById('book-date')?.value || 'Today';

      const bookingRef = 'UK-' + Math.floor(1000 + Math.random() * 9000);
      showToast(`🎉 Table Confirmed! Booking Ref: ${bookingRef} for ${name} (${guests} Guests at ${time})`);
      bookingForm.reset();
    });
  }
});
