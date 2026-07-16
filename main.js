// Main JavaScript File

// Language Toggle
function toggleLanguage() {
  const currentLang = document.documentElement.lang || 'ar';
  const newLang = currentLang === 'ar' ? 'en' : 'ar';
  window.location.href = `/?lang=${newLang}`;
}

// Search Function
function performSearch(event) {
  event.preventDefault();
  const query = document.getElementById('searchInput').value;
  if (query.trim().length > 0) {
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  }
}

// Add Comment
async function submitComment(articleId) {
  const content = document.getElementById('commentContent').value;
  const rating = document.getElementById('commentRating').value;

  if (!content.trim()) {
    alert('يرجى كتابة تعليق');
    return;
  }

  try {
    const response = await fetch(`/articles/${articleId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content, rating })
    });

    const data = await response.json();

    if (data.success) {
      alert(data.message);
      document.getElementById('commentContent').value = '';
      document.getElementById('commentRating').value = '';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error submitting comment:', error);
    alert('حدث خطأ أثناء إضافة التعليق');
  }
}

// Contact Form
async function submitContactForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      alert(result.message);
      event.target.reset();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('حدث خطأ أثناء إرسال النموذج');
  }
}

// Login
async function submitLoginForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = result.redirect || '/';
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error logging in:', error);
    alert('حدث خطأ أثناء تسجيل الدخول');
  }
}

// Register
async function submitRegisterForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = result.redirect || '/';
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error registering:', error);
    alert('حدث خطأ أثناء التسجيل');
  }
}

// Load Articles via API
async function loadArticles(page = 1, category = null) {
  try {
    let url = `/api/articles?page=${page}`;
    if (category) {
      url += `&category=${category}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
      displayArticles(data.data);
      updatePagination(data.pagination);
    }
  } catch (error) {
    console.error('Error loading articles:', error);
  }
}

// Display Articles
function displayArticles(articles) {
  const container = document.getElementById('articlesContainer');
  if (!container) return;

  container.innerHTML = articles.map(article => `
    <div class="article-card">
      ${article.featured_image ? `<img src="${article.featured_image}" alt="${article.title}" class="article-image">` : ''}
      <div class="article-content">
        <h3>${article.title}</h3>
        <p class="article-meta">${new Date(article.created_at).toLocaleDateString('ar-SA')}</p>
        <p>${article.description || article.content.substring(0, 150)}...</p>
        <a href="/articles/${article.slug}" class="btn btn-primary">اقرأ المزيد</a>
      </div>
    </div>
  `).join('');
}

// Update Pagination
function updatePagination(pagination) {
  const container = document.getElementById('paginationContainer');
  if (!container) return;

  let html = '';
  for (let i = 1; i <= pagination.pages; i++) {
    html += `<a href="?page=${i}" class="btn ${i === pagination.page ? 'btn-primary' : 'btn-secondary'}">${i}</a>`;
  }

  container.innerHTML = html;
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded successfully');
  
  // Load initial articles if container exists
  const articlesContainer = document.getElementById('articlesContainer');
  if (articlesContainer) {
    loadArticles();
  }
});

// Logout
function logout() {
  if (confirm('هل تريد تسجيل الخروج؟')) {
    window.location.href = '/auth/logout';
  }
}

// Admin Functions
async function approveComment(commentId) {
  try {
    const response = await fetch(`/admin/comments/${commentId}/approve`, {
      method: 'POST'
    });

    const data = await response.json();

    if (data.success) {
      alert(data.message);
      location.reload();
    }
  } catch (error) {
    console.error('Error approving comment:', error);
  }
}

async function rejectComment(commentId) {
  try {
    const response = await fetch(`/admin/comments/${commentId}/reject`, {
      method: 'POST'
    });

    const data = await response.json();

    if (data.success) {
      alert(data.message);
      location.reload();
    }
  } catch (error) {
    console.error('Error rejecting comment:', error);
  }
}

// Create Article
async function submitArticleForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/admin/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      alert(result.message);
      window.location.href = '/admin/articles';
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error creating article:', error);
    alert('حدث خطأ أثناء إنشاء المقالة');
  }
}
