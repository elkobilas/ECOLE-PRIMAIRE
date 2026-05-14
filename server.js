const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;

// Types MIME
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;

    // Rediriger vers index.html si c'est la racine
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Fichier non trouvé, servir index.html pour SPA
                fs.readFile('./index.html', (error, content) => {
                    if (error) {
                        res.writeHead(500);
                        res.end('Erreur serveur');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end('Erreur serveur: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('🚀 Serveur démarré sur http://localhost:' + PORT);
    console.log('📱 Application de gestion scolaire accessible !');
    console.log('🛑 Pour arrêter le serveur, appuyez sur Ctrl+C');
    console.log('========================================');
});

// Gestion des erreurs
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log('❌ Le port ' + PORT + ' est déjà utilisé');
        console.log('💡 Essayez de fermer l\'autre serveur ou changez le port');
    } else {
        console.log('❌ Erreur serveur:', err);
    }
});

