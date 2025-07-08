// Mobile Menu Toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');
    
    // Close cart if open when menu opens
    if (navbar.classList.contains('active')) {
        document.getElementById('cartModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Cart Functionality
let cart = JSON.parse(localStorage.getItem('boleabujaCart')) || [];
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartSubtotal = document.getElementById('cartSubtotal');
const deliveryFee = document.getElementById('deliveryFee');
const closeCart = document.querySelector('.close-cart');

// Delivery fee structure
const deliveryFees = {
    pickup: 0,
    wuse: 1500,
    garki: 2000,
    maitama: 2500,
    asokoro: 3000,
    kubwa: 3500
};

// Open/Close Cart
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
    renderCart();
    document.body.style.overflow = 'hidden';
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    hideDeliveryOptions();
});

// Close cart when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        hideDeliveryOptions();
    }
});

// Add to Cart
document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', function() {
        const item = this.getAttribute('data-item');
        const price = parseInt(this.getAttribute('data-price'));
        
        const existingItem = cart.find(cartItem => cartItem.name === item);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: item,
                price: price,
                quantity: 1
            });
        }
        
        updateCartCount();
        showAddToCartAnimation(this);
    });
});

// Render Cart Items
function renderCart() {
    cartItems.innerHTML = '';
    let subtotal = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartSubtotal.textContent = '₦0';
        deliveryFee.textContent = '₦0';
        cartTotal.textContent = '₦0';
        return;
    }
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₦${item.price.toLocaleString()} × ${item.quantity} = ₦${itemTotal.toLocaleString()}</p>
            </div>
            <div class="cart-item-controls">
                <button class="decrease-item" data-index="${index}">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="increase-item" data-index="${index}">+</button>
                <span class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></span>
            </div>
        `;
        
        cartItems.appendChild(cartItemElement);
    });
    
    cartSubtotal.textContent = `₦${subtotal.toLocaleString()}`;
    updateDeliveryTotal();
    
    // Add event listeners to new buttons
    document.querySelectorAll('.decrease-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            renderCart();
            updateCartCount();
        });
    });
    
    document.querySelectorAll('.increase-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart[index].quantity += 1;
            renderCart();
            updateCartCount();
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1);
            renderCart();
            updateCartCount();
        });
    });
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
    localStorage.setItem('boleabujaCart', JSON.stringify(cart));
}

// Delivery Options Functions
function showDeliveryOptions() {
    document.getElementById('deliveryOptions').style.display = 'block';
    document.querySelector('.btn-checkout').style.display = 'none';
    document.querySelector('.btn-back-to-cart').style.display = 'block';
}

function hideDeliveryOptions() {
    document.getElementById('deliveryOptions').style.display = 'none';
    document.querySelector('.btn-checkout').style.display = 'block';
    document.querySelector('.btn-back-to-cart').style.display = 'none';
}

function updateDeliveryTotal() {
    const selectedOption = document.querySelector('input[name="deliveryOption"]:checked').value;
    const fee = deliveryFees[selectedOption];
    const subtotal = parseInt(document.getElementById('cartSubtotal').textContent.replace(/\D/g, ''));
    
    deliveryFee.textContent = `₦${fee.toLocaleString()}`;
    cartTotal.textContent = `₦${(subtotal + fee).toLocaleString()}`;
}

// Checkout Button
document.querySelector('.btn-checkout').addEventListener('click', showDeliveryOptions);

// Back to Cart Button
document.querySelector('.btn-back-to-cart').addEventListener('click', hideDeliveryOptions);

// Delivery Option Selection
document.querySelectorAll('input[name="deliveryOption"]').forEach(radio => {
    radio.addEventListener('change', updateDeliveryTotal);
});

// Confirm Order Button
document.querySelector('.btn-confirm-delivery').addEventListener('click', function() {
    const selectedOption = document.querySelector('input[name="deliveryOption"]:checked').value;
    const deliveryNotes = document.querySelector('.delivery-notes textarea').value;
    const total = document.getElementById('cartTotal').textContent;
    
    // Here you would typically send to your backend
    alert(`Order confirmed!\n\n${selectedOption === 'pickup' ? 
        'Please come pick up your order' : 
        `Your order will be delivered (Fee: ₦${deliveryFees[selectedOption].toLocaleString()})`
    }\n\nTotal: ${total}`);
    
    // Reset cart
    cart = [];
    updateCartCount();
    cartModal.style.display = 'none';
    hideDeliveryOptions();
    document.querySelector('.delivery-notes textarea').value = '';
});

// Add to cart animation
function showAddToCartAnimation(button) {
    const btnRect = button.getBoundingClientRect();
    const cartIconRect = cartIcon.getBoundingClientRect();
    
    const animationElement = document.createElement('div');
    animationElement.className = 'add-to-cart-animation';
    animationElement.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    
    animationElement.style.position = 'fixed';
    animationElement.style.left = `${btnRect.left + btnRect.width/2}px`;
    animationElement.style.top = `${btnRect.top}px`;
    animationElement.style.color = 'var(--primary)';
    animationElement.style.fontSize = '1.2rem';
    animationElement.style.pointerEvents = 'none';
    animationElement.style.zIndex = '1001';
    animationElement.style.transition = 'all 0.5s ease-out';
    
    document.body.appendChild(animationElement);
    
    setTimeout(() => {
        animationElement.style.left = `${cartIconRect.left + cartIconRect.width/2}px`;
        animationElement.style.top = `${cartIconRect.top + cartIconRect.height/2}px`;
        animationElement.style.opacity = '0';
        animationElement.style.transform = 'scale(0.5)';
    }, 10);
    
    setTimeout(() => {
        animationElement.remove();
    }, 600);
}

// Menu Filtering System
const filterTabs = document.querySelectorAll('.filter-tab');
const menuSearch = document.getElementById('menuSearch');
const priceRange = document.getElementById('priceRange');
const menuItems = document.querySelectorAll('.menu-item');

filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        filterTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        filterMenuItems();
    });
});

menuSearch.addEventListener('input', filterMenuItems);
priceRange.addEventListener('change', filterMenuItems);

function filterMenuItems() {
    const activeCategory = document.querySelector('.filter-tab.active').dataset.category;
    const searchTerm = menuSearch.value.toLowerCase();
    const priceSelection = priceRange.value;

    menuItems.forEach(item => {
        const itemName = item.querySelector('h3').textContent.toLowerCase();
        const itemPrice = parseInt(item.querySelector('.price').textContent.replace(/\D/g, ''));
        const itemCategory = item.dataset.category;

        const categoryMatch = activeCategory === 'all' || itemCategory === activeCategory;
        const searchMatch = itemName.includes(searchTerm);
        let priceMatch = true;
        
        if (priceSelection === '5000') priceMatch = itemPrice < 5000;
        else if (priceSelection === '5000-10000') priceMatch = itemPrice >= 5000 && itemPrice <= 10000;
        else if (priceSelection === '10000') priceMatch = itemPrice > 10000;

        item.style.display = (categoryMatch && searchMatch && priceMatch) ? 'block' : 'none';
    });
}

// Smooth scrolling
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            document.querySelector('.navbar').classList.remove('active');
        }
    });
});

document.querySelector('.btn-primary').addEventListener('click', () => {
    document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.btn-secondary').addEventListener('click', () => {
    document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
});

// Initialize
updateCartCount();
filterMenuItems();