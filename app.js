// 全域變數
let currentTab = 'accounting';
let budget = 5000;
let expenses = [];
let cart = [];
let notes = [];
let expenseChart;
let currentDate = new Date();
let calendarVisible = false;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSampleData();
});

function initializeApp() {
    // 導覽列切換
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });

    // 商城分類切換
    document.querySelectorAll('.category').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            filterProducts(this.dataset.category);
        });
    });

    // 初始化圖表
    initializeChart();
}

function switchTab(tab) {
    // 更新導覽列
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // 更新內容區域
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tab).classList.add('active');

    currentTab = tab;

    // 載入對應功能的資料
    if (tab === 'accounting') {
        updateAccountingDisplay();
    } else if (tab === 'shop') {
        loadProducts();
    } else if (tab === 'notes') {
        loadNotes();
    }
}

// 記帳功能
function setBudget() {
    const newBudget = prompt('請輸入本月預算:', budget);
    if (newBudget && !isNaN(newBudget)) {
        budget = parseInt(newBudget);
        updateAccountingDisplay();
    }
}

function addExpense() {
    const item = document.getElementById('expenseItem').value;
    const amount = parseInt(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;

    if (item && amount) {
        const expense = {
            id: Date.now(),
            item: item,
            amount: amount,
            category: category,
            date: new Date().toLocaleDateString('zh-TW')
        };

        expenses.push(expense);
        updateAccountingDisplay();
        
        // 清空表單
        document.getElementById('expenseItem').value = '';
        document.getElementById('expenseAmount').value = '';
    }
}

function updateAccountingDisplay() {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = budget - totalExpenses;

    document.getElementById('budget').textContent = budget;
    document.getElementById('remaining').textContent = remaining;

    // 更新支出列表
    const expenseList = document.getElementById('expenseItems');
    expenseList.innerHTML = '';

    expenses.forEach(expense => {
        const expenseDiv = document.createElement('div');
        expenseDiv.className = 'expense-item';
        expenseDiv.innerHTML = `
            <div>
                <strong>${expense.item}</strong>
                <small>${expense.date}</small>
            </div>
            <div>
                <span>NT$ ${expense.amount}</span>
                <button onclick="deleteExpense(${expense.id})" style="margin-left: 10px; background: #FF6B6B; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;">刪除</button>
            </div>
        `;
        expenseList.appendChild(expenseDiv);
    });

    // 更新圖表
    updateExpenseChart();
}

function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    updateAccountingDisplay();
}

function initializeChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF6B6B',
                    '#4ECDC4',
                    '#45B7D1',
                    '#96CEB4',
                    '#FFEAA7'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateExpenseChart() {
    const categoryTotals = {};
    const categoryNames = {
        food: '餐飲',
        transport: '交通',
        shopping: '購物',
        entertainment: '娛樂',
        other: '其他'
    };

    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });

    const labels = Object.keys(categoryTotals).map(key => categoryNames[key]);
    const data = Object.values(categoryTotals);

    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.update();
}

// 商城功能
function loadProducts() {
    const products = [
        { id: 1, name: '經典珍珠奶茶', price: 65, category: 'bubble-tea', image: 'bubble.jpg' },
        { id: 2, name: '黑糖珍珠鮮奶', price: 75, category: 'bubble-tea', image: 'https://images.unsplash.com/photo-1599536837271-f3e08bd0fac5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1YmJsZSUyMHRlYXxlbnwwfHwwfHx8MA%3D%3D' },
        { id: 3, name: '芋頭奶茶', price: 70, category: 'bubble-tea', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4GJq3OXSDDV0cPU5UqK2aXmuamzwGBPGKXg&s' },
        { id: 4, name: '雞蛋糕', price: 45, category: 'snacks', image: 'https://www.englishday.cc/upload/word_img/20200520150803.jpg' },
        { id: 5, name: '鹽酥雞', price: 80, category: 'snacks', image: 'https://i.ytimg.com/vi/OyAQrpyG0tE/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCfO3_9pUATENpXqLIsnl1t_YjHwg' },
        { id: 6, name: '環保吸管', price: 25, category: 'accessories', image: 'https://tshop.r10s.com/36f/b33/1235/cbb2/f02d/cc2c/0452/114feabfa40242ac110003.jpg?_ex=486x486' },
        { id: 7, name: '保溫杯', price: 350, category: 'accessories', image: 'https://images.unsplash.com/photo-1637496148496-26e341f3bec6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGhlcm1vcyUyMGN1cHxlbnwwfHwwfHx8MA%3D%3D' },
        { id: 8, name: '抹茶拿鐵', price: 85, category: 'bubble-tea', image: 'https://www.flavor.com.tw/UploadFile/UserFiles/d9d2d45e986875753662e0db7c4ce575.jpg' }
    ];

    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;
        productCard.innerHTML = `
            <div class="product-image"><img src="${product.image}" alt="${product.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 10px;"></div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">NT$ ${product.price}</div>
            <button class="btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                <i class="fas fa-cart-plus"></i> 加入購物車
            </button>
        `;
        productsGrid.appendChild(productCard);
    });
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    document.getElementById('cartCount').textContent = cartCount;
    document.getElementById('cartTotal').textContent = cartTotal;
    
    // 更新結帳按鈕的 tooltip
    const checkoutButton = document.querySelector('.button');
    if (checkoutButton) {
        checkoutButton.setAttribute('data-tooltip', `總計: NT$ ${cartTotal}`);
    }
}

function checkout() {
    if (cart.length === 0) {
        Swal.fire({
            title: '購物車是空的！',
            text: '請先加入商品到購物車',
            icon: 'warning',
            confirmButtonColor: '#D2691E',
            background: 'linear-gradient(145deg, #FFF8DC, #FFFACD)',
            color: '#8B4513'
        });
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => `${item.name} x${item.quantity} - NT$ ${item.price * item.quantity}`).join('<br>');

    Swal.fire({
        title: '🛋️ 結帳確認',
        html: `
            <div style="text-align: left; margin: 20px 0;">
                <h4 style="color: #8B4513; margin-bottom: 15px;">📝 訂單明細：</h4>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    ${itemsList}
                </div>
                <div style="font-size: 1.2rem; font-weight: bold; color: #D2691E; text-align: center;">
                    總計： NT$ ${total}
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '💳 確認付款',
        cancelButtonText: '取消',
        confirmButtonColor: '#D2691E',
        cancelButtonColor: '#8B4513',
        background: 'linear-gradient(145deg, #FFF8DC, #FFFACD)',
        color: '#8B4513',
        width: '500px'
    }).then((result) => {
        if (result.isConfirmed) {
            // 模擬付款處理
            const expense = {
                id: Date.now(),
                item: '商城購物',
                amount: total,
                category: 'shopping',
                date: new Date().toLocaleDateString('zh-TW')
            };

            // 清空購物車
            cart = [];
            updateCartDisplay();

            // 新增支出記錄
            expenses.push(expense);
            updateAccountingDisplay();

            // 顯示成功訊息
            Swal.fire({
                title: '🎉 付款成功！',
                text: '訂單已確認，感謝您的購買！已自動記錄到支出中。',
                icon: 'success',
                confirmButtonColor: '#4ECDC4',
                background: 'linear-gradient(145deg, #FFF8DC, #FFFACD)',
                color: '#8B4513'
            });
        }
    });
}

// 記事功能
function addNote() {
    document.getElementById('noteModal').style.display = 'block';
    document.getElementById('noteDate').value = new Date().toISOString().split('T')[0];
}

function closeNoteModal() {
    document.getElementById('noteModal').style.display = 'none';
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('noteDate').value = '';
}

function saveNote() {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    const color = document.getElementById('noteColor').value;
    const dateInput = document.getElementById('noteDate').value;

    if (title && content) {
        const note = {
            id: Date.now(),
            title: title,
            content: content,
            color: color,
            date: dateInput ? new Date(dateInput).toLocaleDateString('zh-TW') : new Date().toLocaleDateString('zh-TW')
        };

        notes.push(note);
        loadNotes();
        if (calendarVisible) {
            renderCalendar();
        }
        closeNoteModal();
    }
}

function loadNotes() {
    const notesGrid = document.getElementById('notesGrid');
    notesGrid.innerHTML = '';

    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = `note-card ${note.color}`;
        noteCard.innerHTML = `
            <button class="note-delete" onclick="deleteNote(${note.id})">×</button>
            <div class="note-title">${note.title}</div>
            <div class="note-content">${note.content}</div>
            <small style="color: #8B4513; margin-top: 10px; display: block;">${note.date}</small>
        `;
        notesGrid.appendChild(noteCard);
    });
}

function deleteNote(id) {
    Swal.fire({
        title: '確定要刪除嗎？',
        text: '這個記事將會被永久刪除！',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
        confirmButtonColor: '#FF6B6B',
        cancelButtonColor: '#8B4513',
        background: 'linear-gradient(145deg, #FFF8DC, #FFFACD)',
        color: '#8B4513'
    }).then((result) => {
        if (result.isConfirmed) {
            notes = notes.filter(note => note.id !== id);
            loadNotes();
            if (calendarVisible) {
                renderCalendar();
            }
            Swal.fire({
                title: '已刪除！',
                text: '記事已成功刪除',
                icon: 'success',
                confirmButtonColor: '#4ECDC4',
                background: 'linear-gradient(145deg, #FFF8DC, #FFFACD)',
                color: '#8B4513'
            });
        }
    });
}

// 載入範例資料
function loadSampleData() {
    // 範例支出
    expenses = [
        { id: 1, item: '午餐', amount: 120, category: 'food', date: '2024/01/15' },
        { id: 2, item: '捷運', amount: 30, category: 'transport', date: '2024/01/15' },
        { id: 3, item: '珍奶', amount: 65, category: 'food', date: '2024/01/14' }
    ];

    // 範例記事
    notes = [
        { id: 1, title: '今日待辦', content: '1. 買菜\n2. 繳電費\n3. 運動', color: 'yellow', date: '2024/01/15' },
        { id: 2, title: '珍奶清單', content: '想喝的店家：\n- 50嵐\n- 清心\n- 迷客夏', color: 'pink', date: '2024/01/14' }
    ];

    updateAccountingDisplay();
}

// 日曆功能
function toggleCalendar() {
    const container = document.getElementById('calendarContainer');
    calendarVisible = !calendarVisible;
    container.style.display = calendarVisible ? 'block' : 'none';
    if (calendarVisible) {
        renderCalendar();
    }
}

function renderCalendar() {
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
                       '七月', '八月', '九月', '十月', '十一月', '十二月'];
    
    document.getElementById('currentMonth').textContent = 
        `${currentDate.getFullYear()}年 ${monthNames[currentDate.getMonth()]}`;
    
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // 週標題
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    weekDays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.textAlign = 'center';
        dayHeader.style.padding = '10px';
        dayHeader.style.color = '#8B4513';
        calendarGrid.appendChild(dayHeader);
    });
    
    // 日期格子
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = date.getDate();
        
        if (date.getMonth() !== currentDate.getMonth()) {
            dayElement.classList.add('other-month');
        }
        
        // 檢查是否有記事
        const dateStr = date.toLocaleDateString('zh-TW');
        const hasNotes = notes.some(note => note.date === dateStr);
        if (hasNotes) {
            dayElement.classList.add('has-notes');
        }
        
        dayElement.onclick = () => showNotesForDate(dateStr);
        calendarGrid.appendChild(dayElement);
    }
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function showNotesForDate(dateStr) {
    const dayNotes = notes.filter(note => note.date === dateStr);
    if (dayNotes.length === 0) {
        Swal.fire({
            title: '無記事',
            text: `${dateStr} 沒有記事`,
            icon: 'info',
            confirmButtonColor: '#4ECDC4',
            background: 'linear-gradient(145deg, #FFF8DC, #FFFACD)',
            color: '#8B4513'
        });
    } else {
        const notesList = dayNotes.map(note => `• ${note.title}`).join('<br>');
        Swal.fire({
            title: `${dateStr} 的記事`,
            html: notesList,
            icon: 'info',
            confirmButtonColor: '#4ECDC4',
            background: 'linear-gradient(145deg, #FFF8DC, #FFFACD)',
            color: '#8B4513'
        });
    }
}





// 信用卡加值功能
function addBudget() {
    Swal.fire({
        title: '💳 信用卡加值',
        html: `
            <div style="text-align: left; margin: 20px 0;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #8B4513;">卡號</label>
                    <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" 
                           style="width: 100%; padding: 10px; border: 2px solid #D2691E; border-radius: 8px;">
                </div>
                <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #8B4513;">有效期限</label>
                        <input type="text" id="expiry" placeholder="MM/YY" maxlength="5" 
                               style="width: 100%; padding: 10px; border: 2px solid #D2691E; border-radius: 8px;">
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #8B4513;">安全碼</label>
                        <input type="text" id="cvv" placeholder="123" maxlength="3" 
                               style="width: 100%; padding: 10px; border: 2px solid #D2691E; border-radius: 8px;">
                    </div>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #8B4513;">加值金額</label>
                    <input type="number" id="addAmount" placeholder="請輸入金額" min="1" 
                           style="width: 100%; padding: 10px; border: 2px solid #D2691E; border-radius: 8px;">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '💳 確認加值',
        cancelButtonText: '取消',
        confirmButtonColor: '#D2691E',
        cancelButtonColor: '#8B4513',
        background: 'linear-gradient(145deg, #FFF8DC, #FFFACD)',
        color: '#8B4513',
        width: '500px',
        preConfirm: () => {
            const cardNumber = document.getElementById('cardNumber').value;
            const expiry = document.getElementById('expiry').value;
            const cvv = document.getElementById('cvv').value;
            const amount = parseInt(document.getElementById('addAmount').value);
            
            if (!cardNumber || !expiry || !cvv || !amount) {
                Swal.showValidationMessage('請填寫所有欄位');
                return false;
            }
            
            if (amount <= 0) {
                Swal.showValidationMessage('加值金額必須大於 0');
                return false;
            }
            
            return { cardNumber, expiry, cvv, amount };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { amount } = result.value;
            
            // 更新預算
            budget += amount;
            updateAccountingDisplay();
            
            // 顯示成功訊息
            Swal.fire({
                title: '🎉 加值成功！',
                text: `已成功加值 NT$ ${amount}，您的預算已更新。`,
                icon: 'success',
                confirmButtonColor: '#4ECDC4',
                background: 'linear-gradient(145deg, #FFF8DC, #FFFACD)',
                color: '#8B4513'
            });
        }
    });
}

// 點擊彈窗外部關閉
window.onclick = function(event) {
    const modal = document.getElementById('noteModal');
    if (event.target === modal) {
        closeNoteModal();
    }
}