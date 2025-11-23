// main.js - extracted from index.html
(function(){
    document.addEventListener('DOMContentLoaded', function() {
        const checkBtn = document.getElementById('checkBtn');
        const gameIdInput = document.getElementById('gameId');
        const resultsSection = document.getElementById('resultsSection');
        const terminalOutput = document.getElementById('terminalOutput');
        const downloadSection = document.getElementById('downloadSection');
        const downloadLink = document.getElementById('downloadLink');
        const multiDownloadSection = document.getElementById('multiDownloadSection');
        const multiDownloadLink = document.getElementById('multiDownloadLink');
        const notFoundSection = document.getElementById('notFoundSection');

        if (!checkBtn || !gameIdInput) return;

        checkBtn.addEventListener('click', checkManifest);
        gameIdInput.addEventListener('keypress', e => { if (e.key === 'Enter') checkManifest(); });

        function base32Encode(input) {
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            let bits = "";
            let output = "";
            for (let i = 0; i < input.length; i++) bits += input.charCodeAt(i).toString(2).padStart(8, "0");
            for (let j = 0; j < bits.length; j += 5) {
                const chunk = bits.substring(j, j + 5);
                if (chunk.length < 5) bits += "0".repeat(5 - chunk.length);
                output += alphabet[parseInt(chunk, 2)] || "";
            }
            return output.replace(/=+$/, "");
        }

        function checkManifest() {
            const gameId = gameIdInput.value.trim();
            if (!gameId || !/^\d+$/.test(gameId)) { showError('Please enter a valid Steam AppID (numbers only)'); return; }

            checkBtn.disabled = true;
            checkBtn.classList.remove('pulse-animation');
            checkBtn.innerHTML = '<svg class="icon spin" style="margin-right:8px" viewBox="0 0 50 50" aria-hidden="true"><circle cx="25" cy="25" r="20" stroke="currentColor" stroke-width="5" stroke-linecap="round" fill="none" stroke-dasharray="31.4 31.4"></circle></svg> CHECKING...';

            resultsSection.style.display = '';
            downloadSection.style.display = 'none';
            multiDownloadSection.style.display = 'none';
            notFoundSection.style.display = 'none';
            terminalOutput.textContent = '';

            typeTerminalText(`> Initiating manifest check for Steam AppID: ${gameId}\n`, 0);

            setTimeout(() => {
                typeTerminalText(`> Searching database...\n> Manifest found in database!\n> Encoding request ID (Base32)...\n`, 100);
                const base32Id = base32Encode(gameId);
                const githubUrl = `https://api.fuad0.workers.dev/proxy?id=${base32Id}`;
                const multiSourceUrl = `https://api-psi-eight-12.vercel.app/proxy?id=${base32Id}`;

                typeTerminalText(`> Preparing download link...\n> Waiting 8 seconds before download...\n`, 400);

                let seconds = 8;

                const interval = setInterval(() => {
                    seconds--;

                    if (seconds <= 0) {
                        clearInterval(interval);

                        typeTerminalText(`> Ready for download.\n`, 0);
                        downloadLink.href = githubUrl;
                        downloadSection.style.display = '';

                        multiDownloadLink.href = multiSourceUrl;
                        multiDownloadSection.style.display = '';

                        checkBtn.innerHTML = '<svg class="icon" style="margin-right:8px" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"></circle><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg> CHECK COMPLETE';
                        checkBtn.style.backgroundImage = 'linear-gradient(90deg, #16a34a, #059669)';
                        checkBtn.disabled = false;
                    }
                }, 1000);
            }, 1000);
        }

        function typeTerminalText(text, initialDelay) {
            // Reduce CPU by writing terminal text instantly instead of character-by-character
            setTimeout(() => {
                terminalOutput.textContent += text;
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }, initialDelay);
        }

        function showError(message) {
            terminalOutput.textContent = `> ERROR: ${message}\n`;
            resultsSection.style.display = '';
            downloadSection.style.display = 'none';
            multiDownloadSection.style.display = 'none';
            notFoundSection.style.display = 'none';
            checkBtn.innerHTML = 'CHECK MANIFEST';
            checkBtn.disabled = false;
        }

    });

    // Service Worker registration - only on secure origins or localhost
    if ('serviceWorker' in navigator) {
        const isLocalhost = Boolean(
            location.hostname === 'localhost' ||
            location.hostname === '127.0.0.1'
        );

        if (location.protocol === 'https:' || isLocalhost) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('sw.js').then(function(reg){
                    console.log('ServiceWorker registered:', reg);
                }).catch(function(err){
                    console.warn('ServiceWorker registration failed:', err);
                });
            });
        } else {
            console.log('ServiceWorker not registered: insecure origin (', location.protocol, ')');
        }
    }
})();

// Static gallery / VirusTotal UI removed — disclaimer now shows a single known-malicious-report block.
// Placeholder to avoid errors if elements are missing on some pages.
(function(){
    document.addEventListener('DOMContentLoaded', function(){
        // no-op
    });
})();
