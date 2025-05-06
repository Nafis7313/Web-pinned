document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const linksContainer = document.getElementById('linksContainer');
    const addLinkBtn = document.getElementById('addLinkBtn');
    const addLinkModal = document.getElementById('addLinkModal');
    const closeBtn = document.querySelector('.close-btn');
    const linkForm = document.getElementById('linkForm');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const deleteModal = document.getElementById('deleteModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    
    // Sample data - in a real app, you might load this from localStorage or a database
    let links = JSON.parse(localStorage.getItem('links')) || [
        {
            id: 1,
            title: 'Google',
            url: 'https://google.com',
            category: 'work',
            icon: 'fab fa-google'
        },
        {
            id: 2,
            title: 'GitHub',
            url: 'https://github.com',
            category: 'work',
            icon: 'fab fa-github'
        },
        {
            id: 3,
            title: 'YouTube',
            url: 'https://youtube.com',
            category: 'entertainment',
            icon: 'fab fa-youtube'
        },
        {
            id: 4,
            title: 'Twitter',
            url: 'https://twitter.com',
            category: 'social',
            icon: 'fab fa-twitter'
        },
        {
            id: 5,
            title: 'MDN Web Docs',
            url: 'https://developer.mozilla.org',
            category: 'learning',
            icon: 'fas fa-book'
        }
    ];
    
    // Track which link is being deleted
    let currentDeleteId = null;
    
    // Initialize the app
    function init() {
        renderLinks(links);
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Add link button
        addLinkBtn.addEventListener('click', () => {
            addLinkModal.style.display = 'flex';
        });
        
        // Close modal button
        closeBtn.addEventListener('click', () => {
            addLinkModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === addLinkModal) {
                addLinkModal.style.display = 'none';
            }
            if (e.target === deleteModal) {
                deleteModal.style.display = 'none';
            }
        });
        
        // Form submission
        linkForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewLink();
        });
        
        // Search functionality
        searchBtn.addEventListener('click', filterLinks);
        searchInput.addEventListener('input', filterLinks);
        
        // Category filtering
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterLinks();
            });
        });
        
        // Delete confirmation
        confirmDeleteBtn.addEventListener('click', confirmDelete);
        cancelDeleteBtn.addEventListener('click', () => deleteModal.style.display = 'none');
        closeDeleteModal.addEventListener('click', () => deleteModal.style.display = 'none');
    }
    
    // Render links to the page
    function renderLinks(linksToRender) {
        linksContainer.innerHTML = '';
        
        if (linksToRender.length === 0) {
            linksContainer.innerHTML = '<p class="no-links">No links found. Add some!</p>';
            return;
        }
        
        linksToRender.forEach(link => {
            const linkCard = document.createElement('div');
            linkCard.className = 'link-card';
            linkCard.setAttribute('data-category', link.category);
            linkCard.setAttribute('data-title', link.title.toLowerCase());
            
            linkCard.innerHTML = `
                <div class="link-icon">
                    <i class="${link.icon || 'fas fa-globe'}"></i>
                </div>
                <h3 class="link-title">${link.title}</h3>
                <p class="link-url">${link.url}</p>
                <span class="link-category">${link.category}</span>
            `;
            
            // Add delete button
            setupDeleteButton(linkCard, link.id);
            
            // Open link when clicked (but not when clicking delete button)
            linkCard.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-btn')) {
                    window.open(link.url, '_blank');
                }
            });
            
            linksContainer.appendChild(linkCard);
        });
    }
    
    // Add delete button to link card
    function setupDeleteButton(linkCard, linkId) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent opening the link
            currentDeleteId = linkId;
            deleteModal.style.display = 'flex';
        });
        
        linkCard.appendChild(deleteBtn);
    }
    
    // Confirm deletion of a link
    function confirmDelete() {
        if (currentDeleteId) {
            links = links.filter(link => link.id !== currentDeleteId);
            saveLinks();
            renderLinks(links);
            deleteModal.style.display = 'none';
            currentDeleteId = null;
        }
    }
    
    // Add a new link
    function addNewLink() {
        const title = document.getElementById('linkTitle').value;
        const url = document.getElementById('linkUrl').value;
        const category = document.getElementById('linkCategory').value;
        const icon = document.getElementById('linkIcon').value || 'fas fa-globe';
        
        const newLink = {
            id: Date.now(),
            title,
            url: url.startsWith('http') ? url : `https://${url}`,
            category,
            icon
        };
        
        links.push(newLink);
        saveLinks();
        renderLinks(links);
        linkForm.reset();
        addLinkModal.style.display = 'none';
    }
    
    // Filter links based on search and category
    function filterLinks() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        
        const filteredLinks = links.filter(link => {
            const matchesSearch = link.title.toLowerCase().includes(searchTerm) || 
                                link.url.toLowerCase().includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || link.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
        
        renderLinks(filteredLinks);
    }
    
    // Save links to localStorage
    function saveLinks() {
        localStorage.setItem('links', JSON.stringify(links));
    }
    
    // Initialize the app
    init();
});