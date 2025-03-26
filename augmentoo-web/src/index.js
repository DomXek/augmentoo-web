import { MindARCompiler } from './compiler/mindar-compiler.js';

document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const compileBtn = document.getElementById('compileBtn');
    const debugMode = document.getElementById('debugMode');
    const resultsDiv = document.getElementById('results');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    
    let selectedFiles = [];
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    compileBtn.addEventListener('click', async () => {
        if (selectedFiles.length === 0) return;
        
        compileBtn.disabled = true;
        compileBtn.textContent = 'Compiling...';
        
        const compiler = new MindARCompiler({
            debug: debugMode.checked
        });
        
        try {
            const results = await compiler.compileImages(selectedFiles);
            displayResults(results);
            downloadAllBtn.style.display = 'block';
        } catch (error) {
            console.error('Compilation error:', error);
            alert('Error during compilation: ' + error.message);
        } finally {
            compileBtn.disabled = false;
            compileBtn.textContent = 'Compile Selected Images';
        }
    });
    
    downloadAllBtn.addEventListener('click', () => {
        // Implement download all functionality
    });
    
    function handleFiles(files) {
        selectedFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (selectedFiles.length > 0) {
            compileBtn.disabled = false;
            // Show previews or file names
        } else {
            compileBtn.disabled = true;
        }
    }
    
    function displayResults(results) {
        resultsDiv.innerHTML = '';
        
        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'result-item';
            
            const img = document.createElement('img');
            img.src = URL.createObjectURL(result.imageFile);
            
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = 'Download Target';
            downloadBtn.addEventListener('click', () => {
                downloadFile(result.mindFile, `${result.name}.mind`);
            });
            
            if (result.debugImage) {
                const debugImg = document.createElement('img');
                debugImg.src = URL.createObjectURL(result.debugImage);
                item.appendChild(debugImg);
            }
            
            item.appendChild(img);
            item.appendChild(downloadBtn);
            resultsDiv.appendChild(item);
        });
    }
    
    function downloadFile(data, filename) {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        URL.revokeObjectURL(url);
    }
});