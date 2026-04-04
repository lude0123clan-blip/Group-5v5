// Admin Authentication
let isAdmin = false;
let currentEditingProductId = null;
let cart = [];

const phRegions = {
    Luzon: ['Abra','Apayao','Benguet','Ifugao','Kalinga','Mountain Province','Ilocos Norte','Ilocos Sur','La Union','Pangasinan','Batanes','Cagayan','Isabela','Nueva Vizcaya','Quirino','Aurora','Bataan','Bulacan','Nueva Ecija','Pampanga','Tarlac','Zambales','Batangas','Cavite','Laguna','Quezon','Rizal','Marinduque','Occidental Mindoro','Oriental Mindoro','Palawan','Romblon','Albay','Camarines Norte','Camarines Sur','Catanduanes','Masbate','Sorsogon'],
    Visayas: ['Aklan','Antique','Capiz','Guimaras','Iloilo','Negros Occidental','Bohol','Cebu','Negros Oriental','Siquijor','Biliran','Eastern Samar','Leyte','Northern Samar','Samar','Southern Leyte'],
    Mindanao: ['Basilan','Lanao del Norte','Lanao del Sur','Maguindanao del Norte','Maguindanao del Sur','Sulu','Tawi-Tawi','Zamboanga del Norte','Zamboanga del Sur','Zamboanga Sibugay','Bukidnon','Camiguin','Davao de Oro','Davao del Norte','Davao del Sur','Davao Occidental','Davao Oriental','Cotabato','Sarangani','South Cotabato','Sultan Kudarat','Agusan del Norte','Agusan del Sur','Dinagat Islands','Surigao del Norte','Surigao del Sur','Misamis Occidental','Misamis Oriental']
};

const provinceCities = {
    'Abra': ['Bangued','Tayum','La Paz','Tubo','Boliney'],
    'Aklan': ['Kalibo','Malay','Buruanga','Lezo','Numancia'],
    'Cebu': ['Cebu City','Mandaue City','Lapu-Lapu City','Toledo City','Talisay City'],
    'Laguna': ['Santa Rosa','Calamba','San Pablo','Biñan','San Pedro'],
    'Cavite': ['Imus','Dasmarañas','Bacoor','Tagaytay','Cavite City'],
    'Rizal': ['Antipolo','Cainta','Taytay','Angono','San Mateo'],
    'Pangasinan': ['Dagupan','Urdaneta','Alaminos','San Carlos','Binmaley'],
    'Quezon': ['Lucena','Tayabas','Gumaca','Sariaya','Candelaria'],
    'Davao del Norte': ['Tagum','Panabo','Samal','Kaputian','Asuncion'],
    'Davao del Sur': ['Digos','Padada','Bansalan','Matanao','Hagonoy'],
    'Iloilo': ['Iloilo City','Oton','Pavia','Leganes','Santa Barbara'],
    'Bohol': ['Tagbilaran','Ubay','Dauis','Talibon','Carmen']
};

const cityBarangays = {
    'Bangued': ['Bagong Barrio','Beddeng','Baybay','Poblacion East','Poblacion West'],
    'Kalibo': ['Poblacion','Poblacion East','Poblacion West','Singolong','Tinigban'],
    'Cebu City': ['Lahug','Mabolo','Banilad','Apas','Talamban'],
    'Santa Rosa': ['Balibago','Ciudad Real','Malitlit','San Lorenzo','Wawa'],
    'Antipolo': ['Dela Paz','Mayamot','San Roque','Calawis','Tinajeros'],
    'Dagupan': ['Bonuan Binloc','Bonuan Boquig','Bonuan Gueset','Pogo','Carosucan'],
    'Lucena': ['Ithaca','Cotta','Ilayang Iyam','Dagatan','Sariaya Heights']
};

function populateProvinceOptions(region) {
    const provinceSelect = document.getElementById('province');
    if (!provinceSelect) return;
    provinceSelect.innerHTML = '<option value="">Select Province</option>';
    if (!region || !phRegions[region]) {
        provinceSelect.disabled = true;
        return;
    }
    phRegions[region].forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });
    provinceSelect.disabled = false;
}

function resetLocationSelectors() {
    const citySelect = document.getElementById('city');
    const cityOther = document.getElementById('city-other');
    if (citySelect) {
        citySelect.innerHTML = '<option value="">Select City / Municipality</option>';
        citySelect.disabled = true;
    }
    if (cityOther) cityOther.style.display = 'none';
}

function populateCityOptions(province) {
    const citySelect = document.getElementById('city');
    const cityOther = document.getElementById('city-other');
    if (!citySelect) return;
    citySelect.innerHTML = '<option value="">Select City / Municipality</option>';
    if (!province) {
        resetLocationSelectors();
        return;
    }
    const cities = provinceCities[province] || [];
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
    citySelect.insertAdjacentHTML('beforeend', '<option value="other">Other / Enter manually</option>');
    citySelect.disabled = false;
    if (cityOther) cityOther.style.display = 'none';
}

function initializeShippingSelectors() {
    populateProvinceOptions();
    const regionSelect = document.getElementById('region');
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    const cityOther = document.getElementById('city-other');
    const phoneInput = document.getElementById('phone-number');
    const postalInput = document.getElementById('postal-code');

    if (regionSelect && provinceSelect) {
        regionSelect.addEventListener('change', () => {
            populateProvinceOptions(regionSelect.value);
            resetLocationSelectors();
        });
    }

    if (provinceSelect) {
        provinceSelect.addEventListener('change', function() {
            populateCityOptions(this.value);
        });
    }

    if (citySelect) {
        citySelect.addEventListener('change', function() {
            if (this.value === 'other') {
                if (cityOther) cityOther.style.display = 'block';
            } else {
                if (cityOther) cityOther.style.display = 'none';
            }
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 11);
        });
    }

    if (postalInput) {
        postalInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 4);
        });
    }

    resetLocationSelectors();
}

// Default products
const defaultProducts = [
    {
        id: 1,
        name: 'iPhone 16 Pro',
        price: 999,
        description: 'Latest Apple flagship with advanced features',
        image: '📱',
        promoDiscount: 0
    },
    {
        id: 2,
        name: 'Samsung S26 Ultra',
        price: 1199,
        description: 'Premium Samsung flagship smartphone',
        image: '📱',
        promoDiscount: 0
    },
    {
        id: 3,
        name: 'Xiaomi 15 Pro',
        price: 899,
        description: 'High performance Xiaomi device',
        image: '📱',
        promoDiscount: 0
    },
    {
        id: 4,
        name: 'OnePlus 13',
        price: 799,
        description: 'Fast and smooth OnePlus experience',
        image: '📱',
        promoDiscount: 0
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
    if (isAdmin) {
        document.getElementById('admin-panel').style.display = 'flex';
        document.getElementById('admin-name').textContent = `Welcome, ${localStorage.getItem('adminUser')}`;
        document.getElementById('add-product-btn').style.display = 'block';
    }
    initializeShippingSelectors();
});

// Load or initialize products from localStorage
function loadProducts() {
    let products = localStorage.getItem('products');
    if (!products) {
        products = defaultProducts;
        localStorage.setItem('products', JSON.stringify(products));
    } else {
        products = JSON.parse(products);
    }
    renderProducts(products);
    if (isAdmin) renderOrders();
}

// Render products
function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    products.forEach(product => {
        let displayPrice = product.price;
        let priceHtml = `$${product.price.toLocaleString()}`;
        if (product.promoDiscount > 0) {
            displayPrice = product.price * (1 - product.promoDiscount / 100);
            priceHtml = `<span style="text-decoration: line-through; color: #999;">$${product.price.toLocaleString()}</span> $${displayPrice.toLocaleString()}`;
        }
        const card = document.createElement('div');
        card.className = 'product-card-full';
        card.innerHTML = `
            <div class="product-image-full">
                ${typeof product.image === 'string' && product.image.startsWith('data:') 
                    ? `<img src="${product.image}" alt="${product.name}">` 
                    : product.image}
            </div>
            <div class="product-info-full">
                <div class="product-name-full">${product.name}</div>
                <div class="product-description-full">${product.description || 'Quality smartphone'}</div>
                <div class="product-price-full">${priceHtml}</div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart('${product.name}', ${displayPrice})">Add to Cart</button>
                    ${isAdmin ? `<button class="btn-edit" style="display: block;" onclick="openEditProduct(${product.id})">Edit</button>` : ''}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Show/hide edit buttons based on admin status
    const editBtns = document.querySelectorAll('.btn-edit');
    editBtns.forEach(btn => {
        btn.style.display = isAdmin ? 'block' : 'none';
    });
}

// Admin Login
function openAdminLogin() {
    openModal('admin-login-modal');
}

function adminLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    // Simple demo authentication (replace with real authentication)
    if (username === 'admin' && password === 'admin123') {
        isAdmin = true;
        localStorage.setItem('adminUser', username);
        closeModal('admin-login-modal');
        
        // Show admin panel
        const adminPanel = document.getElementById('admin-panel');
        adminPanel.style.display = 'flex';
        document.getElementById('admin-name').textContent = `Welcome, ${username}`;
        
        // Show add product button
        document.getElementById('add-product-btn').style.display = 'block';
        
        // Re-render to show edit buttons
        const products = JSON.parse(localStorage.getItem('products'));
        renderProducts(products);
        renderOrders();
        
        alert('Logged in as Admin!');
    } else {
        alert('Invalid credentials. Try username: admin, password: admin123');
    }
}

function adminLogout() {
    isAdmin = false;
    localStorage.removeItem('adminUser');
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('add-product-btn').style.display = 'none';
    document.getElementById('orders-section').style.display = 'none';
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
    const products = JSON.parse(localStorage.getItem('products'));
    renderProducts(products);
    alert('Logged out successfully');
}

// Order Management
function renderOrders() {
    if (!isAdmin) return;
    document.getElementById('orders-section').style.display = 'block';
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <h3>Order #${order.id}</h3>
                <span class="order-status status-${order.status}">${order.status}</span>
            </div>
            <div class="order-details">
                <p><strong>Name:</strong> ${order.shipping.name}</p>
                <p><strong>Phone:</strong> ${order.shipping.phone}</p>
                <p><strong>Address:</strong> ${order.shipping.house} ${order.shipping.street}, ${order.shipping.barangay}, ${order.shipping.city}, ${order.shipping.province}, ${order.shipping.region} ${order.shipping.postal}</p>
                <p><strong>Items:</strong> ${order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}</p>
                <p><strong>Total:</strong> $${order.total}</p>
            </div>
            ${order.status === 'pending' ? `
                <div class="order-actions">
                    <button class="btn-primary" onclick="acceptOrder(${order.id})">Accept</button>
                    <button class="btn-danger" onclick="rejectOrder(${order.id})">Reject</button>
                </div>
            ` : `
                <div class="order-actions">
                    <button class="btn-danger" onclick="deleteOrder(${order.id})">Delete Order</button>
                </div>
            `}
        </div>
    `).join('');
}

function acceptOrder(orderId) {
    updateOrderStatus(orderId, 'accepted');
}

function rejectOrder(orderId) {
    updateOrderStatus(orderId, 'rejected');
}

function updateOrderStatus(orderId, status) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        renderOrders();
    }
}

function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrders();
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Edit Product
function openEditProduct(productId) {
    if (!isAdmin) {
        alert('Only admins can edit products');
        return;
    }

    currentEditingProductId = productId;
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === productId);

    if (product) {
        document.getElementById('edit-product-name').value = product.name;
        document.getElementById('edit-product-price').value = product.price;
        document.getElementById('edit-product-description').value = product.description || '';
        document.getElementById('edit-product-discount').value = product.promoDiscount || 0;
        
        const preview = document.getElementById('edit-image-preview');
        if (typeof product.image === 'string' && product.image.startsWith('data:')) {
            preview.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
        } else {
            preview.innerHTML = product.image;
        }

        openModal('edit-product-modal');
    }
}

function saveProduct() {
    if (!isAdmin || !currentEditingProductId) return;

    const name = document.getElementById('edit-product-name').value;
    const price = parseFloat(document.getElementById('edit-product-price').value);
    const description = document.getElementById('edit-product-description').value;
    const discount = parseFloat(document.getElementById('edit-product-discount').value) || 0;
    const imageFile = document.getElementById('edit-product-image').files[0];

    if (!name || !price) {
        alert('Please fill in all required fields');
        return;
    }

    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === currentEditingProductId);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.promoDiscount = discount;

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                product.image = e.target.result;
                localStorage.setItem('products', JSON.stringify(products));
                renderProducts(products);
                closeModal('edit-product-modal');
                alert('Product updated successfully!');
            };
            reader.readAsDataURL(imageFile);
        } else {
            localStorage.setItem('products', JSON.stringify(products));
            renderProducts(products);
            closeModal('edit-product-modal');
            alert('Product updated successfully!');
        }
    }
}

function deleteProduct() {
    if (!isAdmin || !currentEditingProductId) return;
    
    if (!confirm('Are you sure you want to delete this product?')) return;

    let products = JSON.parse(localStorage.getItem('products'));
    products = products.filter(p => p.id !== currentEditingProductId);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts(products);
    closeModal('edit-product-modal');
    alert('Product deleted successfully!');
}

// Add Product
function openAddProduct() {
    if (!isAdmin) {
        alert('Only admins can add products');
        return;
    }

    document.getElementById('new-product-name').value = '';
    document.getElementById('new-product-price').value = '';
    document.getElementById('new-product-description').value = '';
    document.getElementById('new-product-discount').value = '';
    document.getElementById('new-product-image').value = '';
    document.getElementById('new-image-preview').innerHTML = '';
    openModal('add-product-modal');
}

function createProduct() {
    if (!isAdmin) return;

    const name = document.getElementById('new-product-name').value;
    const price = parseFloat(document.getElementById('new-product-price').value);
    const description = document.getElementById('new-product-description').value;
    const discount = parseFloat(document.getElementById('new-product-discount').value) || 0;
    const imageFile = document.getElementById('new-product-image').files[0];

    if (!name || !price) {
        alert('Please fill in all required fields');
        return;
    }

    const products = JSON.parse(localStorage.getItem('products'));
    const newId = Math.max(...products.map(p => p.id), 0) + 1;

    const newProduct = {
        id: newId,
        name: name,
        price: price,
        description: description,
        promoDiscount: discount,
        image: '📱'
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newProduct.image = e.target.result;
            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));
            renderProducts(products);
            closeModal('add-product-modal');
            alert('Product added successfully!');
        };
        reader.readAsDataURL(imageFile);
    } else {
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts(products);
        closeModal('add-product-modal');
        alert('Product added successfully!');
    }
}

// Image Preview
document.addEventListener('DOMContentLoaded', function() {
    const editImageInput = document.getElementById('edit-product-image');
    if (editImageInput) {
        editImageInput.addEventListener('change', function(e) {
            if (e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('edit-image-preview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    const newImageInput = document.getElementById('new-product-image');
    if (newImageInput) {
        newImageInput.addEventListener('change', function(e) {
            if (e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('new-image-preview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
});

// Cart Functions
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCart();
    showNotification(`${name} added to cart!`);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCart();
        updateCart();
    }
}

function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartCountBadge = document.getElementById('cart-count');
    const cartTotalDiv = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    let totalAmount = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
        cartCountBadge.textContent = '0';
        cartTotalDiv.textContent = '$0';
        checkoutBtn.disabled = true;
    } else {
        cartItemsDiv.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
                <div class="cart-item-image">📱</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');

        cart.forEach(item => {
            totalAmount += item.price * item.quantity;
            totalItems += item.quantity;
        });

        cartCountBadge.textContent = totalItems;
        cartTotalDiv.textContent = `$${totalAmount.toLocaleString()}`;
        checkoutBtn.disabled = false;
    }
}

function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.toggle('active');
}

function checkout() {
    if (cart.length === 0) return;
    openModal('checkout-modal');
}

function submitOrder() {
    const name = document.getElementById('full-name').value.trim();
    const phone = document.getElementById('phone-number').value.trim();
    const region = document.getElementById('region').value;
    const province = document.getElementById('province').value;
    const citySelect = document.getElementById('city');
    const cityOtherInput = document.getElementById('city-other');
    const rawCity = citySelect ? citySelect.value : '';
    const city = rawCity === 'other' ? (cityOtherInput ? cityOtherInput.value.trim() : '') : rawCity;
    const barangay = document.getElementById('barangay').value.trim();
    const postal = document.getElementById('postal-code').value.trim();
    const street = document.getElementById('street-name').value.trim();
    const building = document.getElementById('building').value.trim();
    const house = document.getElementById('house-number').value.trim();

    if (!name || !phone || !region || !province || !city || !barangay || !postal || !street || !house) {
        alert('Please fill all required fields.');
        return;
    }

    if (!/^[0-9]{10,11}$/.test(phone)) {
        alert('Please enter a valid mobile number with only digits (10 to 11 digits).');
        return;
    }

    if (!/^[0-9]{4}$/.test(postal)) {
        alert('Postal code must be exactly 4 digits.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = {
        id: Date.now(),
        items: [...cart],
        total: total,
        shipping: {
            name, phone, region, province, city, barangay, postal, street, building, house
        },
        status: 'pending',
        date: new Date().toISOString()
    };

    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear form
    document.getElementById('full-name').value = '';
    document.getElementById('phone-number').value = '';
    document.getElementById('region').value = '';
    document.getElementById('province').value = '';
    populateProvinceOptions('');
    document.getElementById('city').value = '';
    document.getElementById('barangay').value = '';
    document.getElementById('city-other').value = '';
    document.getElementById('postal-code').value = '';
    document.getElementById('street-name').value = '';
    document.getElementById('building').value = '';
    document.getElementById('house-number').value = '';
    resetLocationSelectors();

    cart = [];
    saveCart();
    updateCart();
    closeModal('checkout-modal');
    toggleCart();
    alert('Order placed successfully! Waiting for admin approval.');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #0088ff;
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        z-index: 300;
        animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}