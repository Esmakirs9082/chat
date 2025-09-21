# 🚀 Netlify Deployment Guide

## 📋 Обзор

AI Chat Frontend настроен для развертывания на Netlify как альтернатива Vercel с расширенными возможностями serverless функций.

## 🔧 Конфигурационные файлы

### `netlify.toml`
- ✅ Оптимизированные redirects для SPA
- ✅ API проксирование с headers
- ✅ Security headers + CSP
- ✅ Environment-specific конфигурации
- ✅ Plugins интеграция (Lighthouse, Sitemap)

### Netlify Functions
- `health.js` - Health check endpoint
- `contact.js` - Contact form handler
- Готовность к расширению

## 🚀 Quick Start

### 1. Netlify CLI Setup:
```bash
# Установка CLI
npm install -g netlify-cli

# Login в Netlify
netlify login

# Инициализация проекта
cd ai-chat-frontend
netlify init

# Локальная разработка с functions
netlify dev
```

### 2. Deployment:
```bash
# Manual deploy
netlify deploy --prod --dir=dist

# Или через GitHub (рекомендуется)
git push origin main  # автоматический deploy
```

## 🔐 Environment Variables

### Netlify Dashboard Setup:
```bash
# Site Settings → Environment Variables

# Production
VITE_API_URL=https://api.ai-chat.com
VITE_WS_URL=wss://ws.ai-chat.com
VITE_STRIPE_KEY=pk_live_...
VITE_SENTRY_DSN=https://...

# GitHub Actions
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
```

### Deploy Contexts:
- **Production** (`main` branch): Полная конфигурация
- **Deploy Preview** (PR): Staging окружение  
- **Branch Deploy**: Development окружение

## 🔄 Features Comparison

### Netlify vs Vercel:

| Feature | Netlify | Vercel |
|---------|---------|---------|
| **SPA Support** | ✅ Redirects | ✅ Routes |
| **API Proxy** | ✅ Advanced | ✅ Basic |
| **Functions** | ✅ Netlify Functions | ✅ Vercel Functions |
| **Forms** | ✅ Built-in | ❌ Custom |
| **Plugins** | ✅ Rich ecosystem | ⚡ Limited |
| **Build speed** | ⚡ Fast | 🚀 Faster |
| **Free tier** | ✅ Generous | ✅ Good |

## 🛠️ Serverless Functions

### Available Endpoints:

**🏥 Health Check:**
```bash
GET /health
# Response: System status, API health, metrics
```

**📧 Contact Form:**
```bash
POST /.netlify/functions/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question",
  "message": "Hello world",
  "type": "general"
}
```

### Local Development:
```bash
# Запуск dev сервера с functions
netlify dev

# Functions доступны на:
http://localhost:8888/.netlify/functions/health
http://localhost:8888/.netlify/functions/contact
```

## 📊 Build Plugins

### Automated SEO:
```toml
[[plugins]]
  package = "netlify-plugin-submit-sitemap"
  [plugins.inputs]
    baseUrl = "https://ai-chat.netlify.app"
    sitemapPath = "/sitemap.xml"
```

### Performance Monitoring:
```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"
  [plugins.inputs]
    output_path = "reports/lighthouse.html"
```

## 🔒 Security Configuration

### Content Security Policy:
```toml
Content-Security-Policy = """
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://api.ai-chat.com wss://ws.ai-chat.com;
"""
```

### Headers Applied:
- **HSTS**: Strict transport security
- **CSP**: Content security policy
- **X-Frame-Options**: Clickjacking protection
- **X-XSS-Protection**: XSS filtering

## 📈 Performance Optimizations

### Caching Strategy:
- **Assets**: 1 year immutable cache
- **HTML**: No cache for fresh updates
- **API responses**: Custom TTL via headers

### Build Optimizations:
- **Node.js 18**: Latest stable version
- **npm ci**: Faster, reliable installs
- **Build cache**: Dependency caching

## 🔍 Monitoring & Analytics

### Built-in Features:
- 📊 Deploy previews for PRs
- ⚡ Build performance metrics
- 🚀 Form submission tracking
- 📈 Function invocation logs

### GitHub Actions Integration:
- 🔍 **Lighthouse audits** on PRs
- 🛡️ **Security scanning** with Snyk
- 📋 **Automated comments** with deploy URLs
- ✅ **Status checks** for builds

## 🎯 Custom Domains

### Domain Setup:
1. **Netlify Dashboard** → Domain management
2. Add custom domain: `ai-chat.com`
3. Configure DNS:
   ```
   # Netlify DNS (рекомендуется)
   Name servers: dns1.netlify.com, dns2.netlify.com
   
   # Или CNAME
   CNAME www ai-chat.netlify.app
   ```

### SSL Certificate:
- ✅ Auto-provisioned Let's Encrypt
- ✅ Wildcard support for subdomains
- ✅ HTTPS redirect enabled

## 🚀 GitHub Actions Workflow

### Automated Pipeline:
```yaml
# .github/workflows/netlify.yml
- Quality checks (lint, test, type-check)
- Build optimization
- Deploy to Netlify
- Lighthouse performance audit
- Security scanning
- PR deploy previews
```

### Required Secrets:
```bash
NETLIFY_AUTH_TOKEN=your_personal_access_token
NETLIFY_SITE_ID=your_site_id
LHCI_GITHUB_APP_TOKEN=lighthouse_token (optional)
SNYK_TOKEN=security_scan_token (optional)
```

## 🔄 Migration from Vercel

### Steps:
1. **Export from Vercel**: Download build settings
2. **Import to Netlify**: Use `netlify.toml` configuration  
3. **Update DNS**: Point to Netlify servers
4. **Environment vars**: Copy from Vercel dashboard
5. **Test deployment**: Verify all routes work

### Key Differences:
- **Redirects**: `netlify.toml` vs `vercel.json`
- **Functions**: Different file structure
- **Environment**: Context-based vs branch-based

## 🛠️ Troubleshooting

### Common Issues:

**❌ Function not found:**
```bash
# Check function path
netlify functions:list

# Test locally
netlify dev --live
```

**❌ Build fails:**
```bash
# Check build logs in Netlify dashboard
# Verify Node.js version
# Test build locally: npm run build
```

**❌ Redirect loops:**
```bash
# Verify redirect order in netlify.toml
# SPA fallback should be last redirect
```

## 📊 Performance Metrics

### Expected Results:
- **Build time**: 2-4 minutes
- **Deploy time**: 30-60 seconds  
- **Cold start** (functions): <500ms
- **Lighthouse score**: 90+ for all metrics

---

**Status**: ✅ Production Ready  
**Alternative to**: Vercel  
**Best for**: Advanced serverless needs  
**Performance**: A+ grade