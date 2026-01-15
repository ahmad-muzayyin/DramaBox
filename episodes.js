// Episodes Page JavaScript
class EpisodesPage {
    constructor() {
        this.currentDrama = null;
        this.episodes = [];
        this.currentEpisodeIndex = -1;
        this.apiBase = '/api';
        this.init();
    }

    init() {
        this.getDramaData();
        this.bindEvents();
    }

    bindEvents() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEpisodeModal();
            }
            if (e.key === 'ArrowLeft') {
                this.playPreviousEpisode();
            }
            if (e.key === 'ArrowRight') {
                this.playNextEpisode();
            }
        });

        // Close modal when clicking outside
        document.getElementById('episode-modal').addEventListener('click', (e) => {
            if (e.target.id === 'episode-modal') {
                this.closeEpisodeModal();
            }
        });
    }

    getDramaData() {
        // Get drama data from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const dramaData = urlParams.get('drama');

        if (dramaData) {
            try {
                this.currentDrama = JSON.parse(decodeURIComponent(dramaData));
                this.displayDramaInfo();
                this.loadEpisodes();
            } catch (error) {
                console.error('Error parsing drama data:', error);
                this.showError('Gagal memuat data drama');
            }
        } else {
            this.showError('Data drama tidak ditemukan');
        }
    }

    displayDramaInfo() {
        if (!this.currentDrama) return;

        // Update header information
        document.getElementById('drama-title').textContent = this.currentDrama.bookName || this.currentDrama.title || 'Untitled';

        const coverImg = document.getElementById('drama-cover');
        coverImg.src = this.currentDrama.coverWap || this.currentDrama.bookCover || this.currentDrama.thumbnail || '';
        coverImg.onerror = () => {
            coverImg.src = 'https://via.placeholder.com/150x200/2a2a2a/ffffff?text=No+Cover';
        };

        // Update episode count
        const episodeCount = this.currentDrama.chapterCount || this.currentDrama.totalChapterNum || 0;
        document.getElementById('episode-count').textContent = `${episodeCount} Episode`;

        // Update rating
        const rating = this.currentDrama.rankVo?.hotCode || this.currentDrama.playCount || 'N/A';
        document.getElementById('drama-rating').textContent = `Popularitas: ${rating}`;

        // Display tags
        this.displayTags();
    }

    displayTags() {
        const tagsContainer = document.getElementById('drama-tags');
        const tags = this.currentDrama.tags || [];

        tagsContainer.innerHTML = tags.slice(0, 5).map(tag => `
            <span class="drama-tag">${tag}</span>
        `).join('');
    }

    async loadEpisodes() {
        if (!this.currentDrama) return;

        this.showLoading();

        try {
            // Try to load episodes from API
            const dramaId = this.currentDrama.bookId || this.currentDrama.id;
            let episodes = [];

            try {
                const response = await fetch(`${this.apiBase}/dramabox/allepisode?bookId=${dramaId}`);
                if (response.ok) {
                    const apiData = await response.json();
                    episodes = this.processApiEpisodes(apiData);
                }
            } catch (apiError) {
                console.log('API episode fetch failed, creating fallback episodes');
            }

            // If API failed or no episodes, try to create from search result data
            if (!episodes || episodes.length === 0) {
                episodes = this.createEpisodesFromSearchResult();
            }

            // If still no episodes, create fallback
            if (!episodes || episodes.length === 0) {
                episodes = this.createFallbackEpisodes();
            }

            this.episodes = episodes;
            this.displayEpisodes();

        } catch (error) {
            console.error('Error loading episodes:', error);
            this.showError('Gagal memuat daftar episode');
        } finally {
            this.hideLoading();
        }
    }

    processApiEpisodes(apiData) {
        if (!apiData || !Array.isArray(apiData)) return [];

        return apiData.map((episode, index) => {
            // Get the best video URL (prefer 720p, fallback to highest available)
            let videoUrl = null;
            if (episode.cdnList && episode.cdnList.length > 0) {
                const cdn = episode.cdnList[0]; // Use first CDN
                if (cdn.videoPathList && cdn.videoPathList.length > 0) {
                    // Sort by quality (highest first) and find the best available
                    const sortedVideos = cdn.videoPathList.sort((a, b) => b.quality - a.quality);
                    const bestVideo = sortedVideos.find(v => v.videoPath) || sortedVideos[0];
                    videoUrl = bestVideo ? bestVideo.videoPath : null;
                }
            }

            // Fallback to direct videoPath if cdnList is not available
            if (!videoUrl && episode.videoPath) {
                videoUrl = episode.videoPath;
            }

            return {
                title: episode.chapterName || `Episode ${episode.chapterIndex + 1 || index + 1}`,
                episodeNumber: episode.chapterIndex + 1 || index + 1,
                chapterId: episode.chapterId,
                video_url: videoUrl,
                url: videoUrl,
                available: true, // Always available since all video data is complete
                isLocked: false, // Never locked as per user request
                thumbnail: episode.chapterImg,
                description: episode.introduction || `Episode ${episode.chapterIndex + 1 || index + 1} dari ${this.currentDrama.bookName || 'drama ini'}`
            };
        });
    }

    createEpisodesFromSearchResult() {
        const episodes = [];
        const episodeCount = this.currentDrama.totalChapterNum || this.currentDrama.chapterCount || 10;

        // If the drama has cdnList from search result, use it to create episodes
        if (this.currentDrama.cdnList && this.currentDrama.cdnList.length > 0) {
            const cdn = this.currentDrama.cdnList[0];
            if (cdn.videoPathList && cdn.videoPathList.length > 0) {
                // Create episodes based on the video path list - ALL UNLOCKED as per user request
                cdn.videoPathList.forEach((videoInfo, index) => {
                    episodes.push({
                        title: `Episode ${index + 1}`,
                        episodeNumber: index + 1,
                        chapterId: this.currentDrama.chapterId ? (parseInt(this.currentDrama.chapterId) + index).toString() : null,
                        video_url: videoInfo.videoPath,
                        url: videoInfo.videoPath,
                        available: true, // Always available since all video data is complete
                        isLocked: false, // Never locked as per user request
                        quality: videoInfo.quality,
                        thumbnail: this.currentDrama.chapterImg,
                        description: `Episode ${index + 1} dari ${this.currentDrama.bookName || 'drama ini'}`
                    });
                });
                return episodes;
            }
        }

        // Fallback: create numbered episodes - ALL UNLOCKED
        for (let i = 1; i <= episodeCount; i++) {
            episodes.push({
                title: `Episode ${i}`,
                episodeNumber: i,
                chapterId: this.currentDrama.chapterId ? (parseInt(this.currentDrama.chapterId) + i - 1).toString() : null,
                video_url: this.currentDrama.videoPath || null,
                url: this.currentDrama.videoPath || null,
                available: true, // Always available since all video data is complete
                isLocked: false, // Never locked as per user request
                thumbnail: this.currentDrama.chapterImg,
                description: `Episode ${i} dari ${this.currentDrama.bookName || 'drama ini'}`
            });
        }

        return episodes;
    }

    createFallbackEpisodes() {
        const episodeCount = this.currentDrama.chapterCount || this.currentDrama.totalChapterNum || 10;
        const episodes = [];

        for (let i = 1; i <= episodeCount; i++) {
            episodes.push({
                title: `Episode ${i}`,
                episodeNumber: i,
                chapterId: this.currentDrama.chapterId ? (parseInt(this.currentDrama.chapterId) + i - 1).toString() : null,
                video_url: null,
                url: null,
                available: true, // Always available since all video data is complete
                isLocked: false, // Never locked as per user request
                description: `Episode ${i} dari ${this.currentDrama.bookName || 'drama ini'}`
            });
        }

        return episodes;
    }

    displayEpisodes() {
        const episodesList = document.getElementById('episodes-list');
        const featuredEpisode = document.getElementById('featured-episode');
        const totalCount = document.getElementById('total-episodes');

        episodesList.innerHTML = '';
        featuredEpisode.innerHTML = '';

        if (!this.episodes || this.episodes.length === 0) {
            episodesList.innerHTML = '<div class="no-episodes"><i class="fas fa-exclamation-triangle"></i><p>Tidak ada episode tersedia</p></div>';
            return;
        }

        // Create featured episode (first episode - large card)
        if (this.episodes.length > 0) {
            const featuredEpisodeCard = this.createFeaturedEpisodeCard(this.episodes[0], 0);
            featuredEpisode.appendChild(featuredEpisodeCard);
        }

        // Create episode list (remaining episodes - small cards)
        const remainingEpisodes = this.episodes.slice(1);
        remainingEpisodes.forEach((episode, index) => {
            const episodeListItem = this.createEpisodeListItem(episode, index + 1);
            episodesList.appendChild(episodeListItem);
        });

        // Update episode counts
        document.getElementById('episode-count').textContent = `${this.episodes.length} Episode`;
        totalCount.textContent = `${this.episodes.length} Episode`;
    }

    createFeaturedEpisodeCard(episode, index) {
        const featuredCard = document.createElement('div');
        featuredCard.className = 'featured-episode';
        featuredCard.onclick = () => this.openEpisodeModal(index);

        const episodeNumber = episode.episodeNumber || (index + 1);
        const thumbnail = this.generateEpisodeThumbnail(episode, index, true);

        featuredCard.innerHTML = `
            <div class="featured-thumbnail">
                <img src="${thumbnail}" alt="Episode ${episodeNumber}" onerror="this.src='https://via.placeholder.com/640x360/2a2a2a/ffffff?text=Episode+${episodeNumber}'">
                <div class="featured-overlay">
                    <div class="featured-play-btn">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
            </div>
            <div class="featured-info">
                <div class="featured-title">${episode.title || `Episode ${episodeNumber}`}</div>
                <div class="featured-meta">
                    <span class="featured-episode-number">Episode ${episodeNumber}</span>
                    <span class="featured-status">
                        <i class="fas fa-play-circle"></i>
                        Tersedia
                    </span>
                </div>
                <div class="featured-description">
                    ${episode.description || `Tonton episode ${episodeNumber} dari ${this.currentDrama.bookName || 'drama ini'}. Episode ini siap untuk ditonton.`}
                </div>
            </div>
        `;

        return featuredCard;
    }

    createEpisodeListItem(episode, index) {
        const listItem = document.createElement('div');
        listItem.className = 'episode-list-item';
        listItem.onclick = () => this.openEpisodeModal(index);

        const episodeNumber = episode.episodeNumber || (index + 1);
        const thumbnail = this.generateEpisodeThumbnail(episode, index, false);

        listItem.innerHTML = `
            <div class="episode-thumbnail-small">
                <img src="${thumbnail}" alt="Episode ${episodeNumber}" onerror="this.src='https://via.placeholder.com/120x68/2a2a2a/ffffff?text=${episodeNumber}'">
                <div class="episode-number-overlay">${episodeNumber}</div>
            </div>
            <div class="episode-content-small">
                <div class="episode-title-small">${episode.title || `Episode ${episodeNumber}`}</div>
                <div class="episode-status-small">
                    <i class="fas fa-play-circle"></i>
                    Tersedia
                </div>
            </div>
        `;

        return listItem;
    }

    generateEpisodeThumbnail(episode, index, isFeatured = false) {
        // Try to use episode-specific thumbnail, fallback to drama cover
        if (episode.thumbnail || episode.chapterImg) {
            return episode.thumbnail || episode.chapterImg;
        }

        // Generate a placeholder with episode number - different sizes for featured vs list
        if (isFeatured) {
            return `https://via.placeholder.com/640x360/2a2a2a/ffffff?text=Episode+${index + 1}`;
        } else {
            return `https://via.placeholder.com/120x68/2a2a2a/ffffff?text=${index + 1}`;
        }
    }

    openEpisodeModal(index) {
        this.currentEpisodeIndex = index;
        const episode = this.episodes[index];

        document.getElementById('modal-episode-title').textContent = episode.title || `Episode ${episode.episodeNumber || (index + 1)}`;
        document.getElementById('modal-episode-description').textContent = episode.description || `Tonton episode ${episode.episodeNumber || (index + 1)} dari ${this.currentDrama.bookName || 'drama ini'}`;

        // Check if episode is locked
        if (episode.isLocked) {
            alert('Episode ini terkunci dan belum tersedia untuk ditonton.');
            return;
        }

        // Set video source
        const videoPlayer = document.getElementById('episode-video-player');
        if (episode.video_url || episode.url) {
            videoPlayer.src = episode.video_url || episode.url;
            videoPlayer.load();
        } else {
            videoPlayer.src = '';
            alert('Video untuk episode ini belum tersedia.');
            return;
        }

        // Update navigation buttons
        this.updateNavigationButtons();

        // Show modal
        document.getElementById('episode-modal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeEpisodeModal() {
        const videoPlayer = document.getElementById('episode-video-player');
        videoPlayer.pause();
        videoPlayer.src = '';

        document.getElementById('episode-modal').classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    updateNavigationButtons() {
        const prevBtn = document.querySelector('.prev-episode-btn');
        const nextBtn = document.querySelector('.next-episode-btn');

        prevBtn.disabled = this.currentEpisodeIndex <= 0;
        nextBtn.disabled = this.currentEpisodeIndex >= this.episodes.length - 1;

        prevBtn.style.opacity = prevBtn.disabled ? 0.5 : 1;
        nextBtn.style.opacity = nextBtn.disabled ? 0.5 : 1;
    }

    playPreviousEpisode() {
        if (this.currentEpisodeIndex > 0) {
            this.closeEpisodeModal();
            this.openEpisodeModal(this.currentEpisodeIndex - 1);
        }
    }

    playNextEpisode() {
        if (this.currentEpisodeIndex < this.episodes.length - 1) {
            this.closeEpisodeModal();
            this.openEpisodeModal(this.currentEpisodeIndex + 1);
        }
    }

    playFirstEpisode() {
        if (this.episodes && this.episodes.length > 0) {
            // Find first available and unlocked episode
            const firstAvailableIndex = this.episodes.findIndex(ep => !ep.isLocked && (ep.video_url || ep.url));
            if (firstAvailableIndex >= 0) {
                this.openEpisodeModal(firstAvailableIndex);
            } else {
                alert('Tidak ada episode yang tersedia untuk diputar.');
            }
        }
    }

    async downloadAllEpisodes() {
        if (!this.episodes || this.episodes.length === 0) {
            alert('Tidak ada episode untuk diunduh.');
            return;
        }

        // Create and show custom dialog
        this.showDownloadDialog();
    }

    showDownloadDialog() {
        // Check if a dialog already exists
        if (document.getElementById('download-dialog')) {
            return;
        }

        const dialog = document.createElement('div');
        dialog.id = 'download-dialog';
        dialog.className = 'download-dialog';
        dialog.innerHTML = `
            <div class="download-dialog-content">
                <div class="download-dialog-header">
                    <h3>Download Semua Video</h3>
                    <button id="close-dialog-btn" class="close-dialog-btn">&times;</button>
                </div>
                <div class="download-dialog-body">
                    <p>Pilih metode unduhan:</p>
                    <button id="copy-json-btn" class="btn btn-primary">
                        <i class="fas fa-copy"></i> Salin Link (JSON)
                    </button>
                    <button id="download-zip-btn" class="btn btn-secondary">
                        <i class="fas fa-file-archive"></i> Download ZIP
                    </button>
                    <p class="dialog-info">
                        <b>Salin Link (JSON):</b> Menyalin daftar link video ke clipboard. Buka Internet Download Manager (IDM), pilih "Tugas" > "Tambah unduhan kelompok dari clipboard".
                    </p>
                    <p class="dialog-info">
                        <b>Download ZIP:</b> Mengunduh semua video dalam satu file ZIP. Proses ini mungkin memakan waktu lama dan memori yang besar, tergantung jumlah dan ukuran episode.
                    </p>
                </div>
                <div id="download-progress" class="download-progress" style="display: none;">
                    <div class="progress-bar-container">
                        <div id="progress-bar" class="progress-bar"></div>
                    </div>
                    <p id="progress-text">Memulai unduhan...</p>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Event Listeners
        document.getElementById('close-dialog-btn').onclick = () => this.closeDownloadDialog();
        document.getElementById('copy-json-btn').onclick = () => this.copyLinksAsJson();
        document.getElementById('download-zip-btn').onclick = () => this.downloadVideosAsZip();

        // Close when clicking outside
        dialog.addEventListener('click', (e) => {
            if (e.target.id === 'download-dialog') {
                this.closeDownloadDialog();
            }
        });
    }

    closeDownloadDialog() {
        const dialog = document.getElementById('download-dialog');
        if (dialog) {
            document.body.removeChild(dialog);
        }
    }

    copyLinksAsJson() {
        const links = this.episodes.map(episode => ({
            title: episode.title,
            url: episode.video_url || episode.url
        }));

        const jsonString = JSON.stringify(links, null, 2);

        navigator.clipboard.writeText(jsonString).then(() => {
            alert('Link video (JSON) telah disalin ke clipboard.\n\nBuka IDM, pilih "Tugas" -> "Tambah unduhan kelompok dari clipboard".');
            this.closeDownloadDialog();
        }).catch(err => {
            console.error('Gagal menyalin link:', err);
            alert('Gagal menyalin link. Silakan coba lagi.');
        });
    }

    async downloadVideosAsZip() {
        const zip = new JSZip();
        const progressContainer = document.getElementById('download-progress');
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        // Show progress bar
        progressContainer.style.display = 'block';

        try {
            const totalEpisodes = this.episodes.length;
            let downloadedCount = 0;

            for (const [index, episode] of this.episodes.entries()) {
                const episodeNumber = index + 1;
                const url = episode.video_url || episode.url;

                if (!url) {
                    console.warn(`Skipping episode ${episodeNumber} due to missing URL.`);
                    continue;
                }

                progressText.textContent = `Mengunduh episode ${episodeNumber} dari ${totalEpisodes}...`;

                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Gagal mengunduh video: ${response.statusText}`);
                    }
                    const videoBlob = await response.blob();
                    const fileName = `${this.currentDrama.bookName || 'Drama'} - Episode ${episodeNumber}.mp4`;

                    zip.file(fileName, videoBlob);

                    downloadedCount++;
                    const progress = (downloadedCount / totalEpisodes) * 100;
                    progressBar.style.width = `${progress}%`;

                } catch (fetchError) {
                    console.error(`Gagal memproses episode ${episodeNumber}:`, fetchError);
                    alert(`Gagal mengunduh episode ${episodeNumber}. Melanjutkan ke episode berikutnya.`);
                }
            }

            if (downloadedCount === 0) {
                alert('Tidak ada video yang berhasil diunduh. Periksa koneksi atau URL video.');
                this.closeDownloadDialog();
                return;
            }

            progressText.textContent = 'Membuat file ZIP... Ini mungkin memakan waktu beberapa saat.';
            progressBar.style.width = '100%';

            zip.generateAsync({ type: 'blob' }).then(blob => {
                const zipFileName = `${this.currentDrama.bookName || 'Drama'} - Semua Episode.zip`;
                saveAs(blob, zipFileName);
                this.closeDownloadDialog();
            });

        } catch (error) {
            console.error('Error creating ZIP file:', error);
            alert('Terjadi kesalahan saat membuat file ZIP. Silakan periksa konsol untuk detailnya.');
            this.closeDownloadDialog();
        }
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('show');
    }

    showError(message) {
        const episodesList = document.getElementById('episodes-list');
        episodesList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-btn">
                    <i class="fas fa-refresh"></i> Coba Lagi
                </button>
            </div>
        `;
    }
}

// Initialize the episodes page
document.addEventListener('DOMContentLoaded', () => {
    const episodesPage = new EpisodesPage();
    window.episodesPage = episodesPage;
});

// Utility functions
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}

function playFirstEpisode() {
    window.episodesPage.playFirstEpisode();
}

function downloadAllEpisodes() {
    window.episodesPage.downloadAllEpisodes();
}

function closeEpisodeModal() {
    window.episodesPage.closeEpisodeModal();
}

function playPreviousEpisode() {
    window.episodesPage.playPreviousEpisode();
}

function playNextEpisode() {
    window.episodesPage.playNextEpisode();
}
