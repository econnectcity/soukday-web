const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');
const oldDir = path.join(outDir, '_next');
const newDir = path.join(outDir, 'next-assets');

const fse = require('fs-extra');

// 1. Rename physical folder
if (fse.existsSync(oldDir)) {
  try {
    fse.moveSync(oldDir, newDir, { overwrite: true });
    console.log('Successfully moved _next folder to next-assets');
  } catch (err) {
    console.warn('moveSync retry fallback:', err.message);
    fse.copySync(oldDir, newDir, { overwrite: true });
    fse.removeSync(oldDir);
    console.log('Copied and removed _next folder to next-assets');
  }
}

// 2. Safe URL replacement (avoids breaking JS variables like self.__next_f)
function safeReplace(content) {
  return content
    .replace(/\/_next\//g, '/next-assets/')
    .replace(/\\\/_next\\\//g, '\\/next-assets\\/')
    .replace(/"_next\//g, '"next-assets/')
    .replace(/'_next\//g, "'next-assets/")
    .replace(/_next\/static/g, 'next-assets/static');
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (/\.(html|js|css|json|txt|xml)$/.test(f)) {
      const orig = fs.readFileSync(full, 'utf8');
      const replaced = safeReplace(orig);
      if (replaced !== orig) {
        fs.writeFileSync(full, replaced, 'utf8');
      }
    }
  }
}

walk(outDir);

// 3. Write LiteSpeed / Apache .htaccess
const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Force HTTPS
  RewriteCond %{HTTPS} !=on
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Never rewrite static assets
  RewriteRule ^next-assets/ - [L]
  RewriteRule ^favicon\\.ico - [L]
  RewriteRule ^robots\\.txt - [L]
  RewriteRule ^sitemap\\.xml - [L]

  # Serve existing file or directory directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Route all other requests to index.html for client-side routing
  RewriteRule ^ index.html [L]
</IfModule>

# MIME Types
<IfModule mod_mime.c>
  AddType text/css .css
  AddType application/javascript .js
  AddType image/svg+xml .svg
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# Caching: HTML fresh, static assets cached
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType application/json "access plus 0 seconds"
</IfModule>
`;

fs.writeFileSync(path.join(outDir, '.htaccess'), htaccessContent, 'utf8');
console.log('Static export post-processing complete and .htaccess created!');
